#!/usr/bin/env node
// Load environment variables
// You can run this script with: 
//   NODE_ENV=development node scripts/analyze-r2.mjs
// Or source your .env.local file first

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// Try to load .env.local if it exists (simple manual loader)
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
    const envPath = join(__dirname, '..', '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const [key, ...valueParts] = trimmed.split('=');
            const value = valueParts.join('=').replace(/^["']|["']$/g, '');
            if (!process.env[key]) {
                process.env[key] = value;
            }
        }
    });
} catch (e) {
    // .env.local doesn't exist or can't be read, that's okay
}

import { serverEnv } from "../lib/env.mjs";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const s3 = new S3Client({
    region: "auto",
    endpoint: serverEnv.R2_ENDPOINT,
    credentials: {
        accessKeyId: serverEnv.R2_ACCESS_KEY_ID,
        secretAccessKey: serverEnv.R2_SECRET_ACCESS_KEY,
    },
});

async function* listAllObjects(bucket, prefix = "") {
    let ContinuationToken;
    do {
        const { Contents, IsTruncated, NextContinuationToken } =
            await s3.send(new ListObjectsV2Command({ 
                Bucket: bucket, 
                Prefix: prefix, 
                ContinuationToken 
            }));
        for (const obj of Contents ?? []) {
            yield obj;
        }
        ContinuationToken = IsTruncated ? NextContinuationToken : undefined;
    } while (ContinuationToken);
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function analyzeObject(key) {
    const parts = key.split('/');
    const filename = parts[parts.length - 1];
    const dir = parts.slice(0, -1).join('/') || '(root)';
    
    // Extract file extension
    const extMatch = filename.match(/\.([^.]+)$/);
    const ext = extMatch ? extMatch[1].toLowerCase() : 'no-ext';
    
    // Check if it's a variant
    const variantMatch = filename.match(/-w(\d+)\.(webp|avif)$/);
    const isVariant = !!variantMatch;
    const variantWidth = variantMatch ? parseInt(variantMatch[1]) : null;
    const variantFormat = variantMatch ? variantMatch[2] : null;
    
    // Check if it's an original
    const isOriginal = /\.(jpe?g|png)$/i.test(filename) && !isVariant;
    
    return {
        key,
        dir,
        filename,
        ext,
        isVariant,
        isOriginal,
        variantWidth,
        variantFormat,
    };
}

async function analyzeR2() {
    console.log('🔍 Connecting to R2 and analyzing bucket layout...\n');
    console.log(`Bucket: ${serverEnv.R2_BUCKET}`);
    console.log(`Endpoint: ${serverEnv.R2_ENDPOINT}\n`);
    
    const objects = [];
    const stats = {
        total: 0,
        totalSize: 0,
        byDirectory: {},
        byExtension: {},
        byType: {
            originals: 0,
            variants: 0,
            other: 0,
        },
        variantBreakdown: {
            webp: {},
            avif: {},
        },
    };
    
    // Collect all objects
    console.log('📦 Listing all objects...');
    for await (const obj of listAllObjects(serverEnv.R2_BUCKET)) {
        const analysis = analyzeObject(obj.Key);
        const size = obj.Size || 0;
        
        objects.push({
            ...analysis,
            size,
            lastModified: obj.LastModified,
        });
        
        // Update stats
        stats.total++;
        stats.totalSize += size;
        
        // By directory
        if (!stats.byDirectory[analysis.dir]) {
            stats.byDirectory[analysis.dir] = { count: 0, size: 0, files: [] };
        }
        stats.byDirectory[analysis.dir].count++;
        stats.byDirectory[analysis.dir].size += size;
        stats.byDirectory[analysis.dir].files.push(obj.Key);
        
        // By extension
        if (!stats.byExtension[analysis.ext]) {
            stats.byExtension[analysis.ext] = { count: 0, size: 0 };
        }
        stats.byExtension[analysis.ext].count++;
        stats.byExtension[analysis.ext].size += size;
        
        // By type
        if (analysis.isOriginal) {
            stats.byType.originals++;
        } else if (analysis.isVariant) {
            stats.byType.variants++;
            if (analysis.variantFormat && analysis.variantWidth) {
                if (!stats.variantBreakdown[analysis.variantFormat][analysis.variantWidth]) {
                    stats.variantBreakdown[analysis.variantFormat][analysis.variantWidth] = 0;
                }
                stats.variantBreakdown[analysis.variantFormat][analysis.variantWidth]++;
            }
        } else {
            stats.byType.other++;
        }
    }
    
    // Print summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 SUMMARY STATISTICS');
    console.log('='.repeat(80));
    console.log(`Total Objects: ${stats.total.toLocaleString()}`);
    console.log(`Total Size: ${formatBytes(stats.totalSize)}`);
    console.log(`\nType Breakdown:`);
    console.log(`  Originals: ${stats.byType.originals.toLocaleString()}`);
    console.log(`  Variants: ${stats.byType.variants.toLocaleString()}`);
    console.log(`  Other: ${stats.byType.other.toLocaleString()}`);
    
    // Directory breakdown
    console.log('\n' + '='.repeat(80));
    console.log('📁 DIRECTORY STRUCTURE');
    console.log('='.repeat(80));
    const sortedDirs = Object.entries(stats.byDirectory)
        .sort((a, b) => b[1].count - a[1].count);
    
    for (const [dir, data] of sortedDirs) {
        const percentage = ((data.count / stats.total) * 100).toFixed(1);
        console.log(`\n${dir}/`);
        console.log(`  Files: ${data.count.toLocaleString()} (${percentage}%)`);
        console.log(`  Size: ${formatBytes(data.size)}`);
        
        // Show sample files (first 5)
        const samples = data.files.slice(0, 5);
        if (samples.length > 0) {
            console.log(`  Sample files:`);
            samples.forEach(key => {
                const parts = key.split('/');
                const filename = parts[parts.length - 1];
                console.log(`    - ${filename}`);
            });
            if (data.files.length > 5) {
                console.log(`    ... and ${data.files.length - 5} more`);
            }
        }
    }
    
    // Extension breakdown
    console.log('\n' + '='.repeat(80));
    console.log('📄 FILE EXTENSIONS');
    console.log('='.repeat(80));
    const sortedExts = Object.entries(stats.byExtension)
        .sort((a, b) => b[1].count - a[1].count);
    
    for (const [ext, data] of sortedExts) {
        const percentage = ((data.count / stats.total) * 100).toFixed(1);
        console.log(`${ext.padEnd(10)} ${data.count.toString().padStart(8)} files (${percentage.padStart(5)}%) | ${formatBytes(data.size).padStart(12)}`);
    }
    
    // Variant breakdown
    console.log('\n' + '='.repeat(80));
    console.log('🖼️  IMAGE VARIANT BREAKDOWN');
    console.log('='.repeat(80));
    
    console.log('\nWebP Variants:');
    const webpWidths = Object.keys(stats.variantBreakdown.webp)
        .map(Number)
        .sort((a, b) => a - b);
    for (const width of webpWidths) {
        const count = stats.variantBreakdown.webp[width];
        console.log(`  w${width.toString().padStart(4)}: ${count.toLocaleString().padStart(6)} files`);
    }
    
    console.log('\nAVIF Variants:');
    const avifWidths = Object.keys(stats.variantBreakdown.avif)
        .map(Number)
        .sort((a, b) => a - b);
    for (const width of avifWidths) {
        const count = stats.variantBreakdown.avif[width];
        console.log(`  w${width.toString().padStart(4)}: ${count.toLocaleString().padStart(6)} files`);
    }
    
    // Analyze directory patterns
    console.log('\n' + '='.repeat(80));
    console.log('🔍 DIRECTORY ANALYSIS');
    console.log('='.repeat(80));
    
    const dirPatterns = {};
    for (const obj of objects) {
        const depth = obj.dir.split('/').filter(Boolean).length;
        if (!dirPatterns[depth]) {
            dirPatterns[depth] = { count: 0, dirs: new Set() };
        }
        dirPatterns[depth].count++;
        dirPatterns[depth].dirs.add(obj.dir);
    }
    
    console.log('\nDirectory Depth Analysis:');
    for (const [depth, data] of Object.entries(dirPatterns).sort((a, b) => a[0] - b[0])) {
        console.log(`  Depth ${depth}: ${data.count.toLocaleString()} files across ${data.dirs.size} unique directories`);
    }
    
    // Find orphaned variants (variants without originals)
    // Variants are in variants/ subfolders, so we need to look for originals in the parent folder
    console.log('\n' + '='.repeat(80));
    console.log('🔗 ORIGINAL-VARIANT RELATIONSHIPS');
    console.log('='.repeat(80));
    
    const originals = new Set(objects.filter(o => o.isOriginal).map(o => o.key));
    const variants = objects.filter(o => o.isVariant);
    
    const orphanedVariants = [];
    for (const variant of variants) {
        // Extract base name from variant (e.g., "example-w320.webp" -> "example")
        const baseName = variant.filename.replace(/-w\d+\.(webp|avif)$/, '');
        const possibleExts = ['jpg', 'jpeg', 'png'];
        
        // Variants are in variants/ subfolders, so original should be in parent folder
        // e.g., "assets/portfolio/landscapes/keswick/variants/" -> "assets/portfolio/landscapes/keswick/"
        let originalDir = variant.dir;
        if (originalDir.endsWith('/variants')) {
            originalDir = originalDir.replace(/\/variants$/, '');
        }
        // Also handle old structure with _variants suffix (for backward compatibility)
        else if (originalDir.endsWith('_variants')) {
            originalDir = originalDir.replace(/_variants$/, '');
        }
        
        let found = false;
        for (const ext of possibleExts) {
            const possibleKey = `${originalDir}/${baseName}.${ext}`;
            if (originals.has(possibleKey)) {
                found = true;
                break;
            }
        }
        
        if (!found) {
            orphanedVariants.push(variant.key);
        }
    }
    
    if (orphanedVariants.length > 0) {
        console.log(`\n⚠️  Found ${orphanedVariants.length} orphaned variants (no matching original):`);
        orphanedVariants.slice(0, 10).forEach(key => console.log(`  - ${key}`));
        if (orphanedVariants.length > 10) {
            console.log(`  ... and ${orphanedVariants.length - 10} more`);
        }
    } else {
        console.log('\n✅ All variants have matching originals');
    }
    
    // Check for originals without variants
    // Variants are in variants/ subfolders, so we need to look for variants there
    const missingVariants = [];
    for (const original of objects.filter(o => o.isOriginal)) {
        const baseName = original.filename.replace(/\.[^.]+$/, '');
        const dir = original.dir;
        
        // Variants should be in the variants/ subfolder
        const variantDir = `${dir}/variants`;
        const expectedWidths = [320, 640, 1280, 1920];
        const expectedFormats = ['webp', 'avif'];
        
        const existingVariants = new Set(
            objects
                .filter(o => o.dir === variantDir && o.filename.startsWith(baseName + '-w'))
                .map(o => o.filename)
        );
        
        const missing = [];
        for (const width of expectedWidths) {
            for (const format of expectedFormats) {
                const expectedVariant = `${baseName}-w${width}.${format}`;
                if (!existingVariants.has(expectedVariant)) {
                    missing.push(expectedVariant);
                }
            }
        }
        
        if (missing.length > 0) {
            missingVariants.push({
                original: original.key,
                variantDir: variantDir,
                missing: missing.length,
                total: expectedWidths.length * expectedFormats.length,
            });
        }
    }
    
    if (missingVariants.length > 0) {
        console.log(`\n⚠️  Found ${missingVariants.length} originals with incomplete variants:`);
        missingVariants.slice(0, 10).forEach(({ original, variantDir, missing, total }) => {
            console.log(`  - ${original} (missing ${missing}/${total} variants in ${variantDir}/)`);
        });
        if (missingVariants.length > 10) {
            console.log(`  ... and ${missingVariants.length - 10} more`);
        }
    } else {
        console.log('\n✅ All originals have complete variant sets');
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ Analysis complete!');
    console.log('='.repeat(80) + '\n');
}

analyzeR2().catch(console.error);


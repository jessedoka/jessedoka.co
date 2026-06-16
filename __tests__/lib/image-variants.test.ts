import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetObjectCommand, HeadObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

vi.mock('sharp', () => ({
    default: vi.fn().mockReturnValue({
        resize: vi.fn().mockReturnThis(),
        toFormat: vi.fn().mockReturnThis(),
        toBuffer: vi.fn().mockResolvedValue(Buffer.from('fake-output')),
    }),
}));

const { listObjects, ensureVariants, WIDTHS, FORMATS } = await import('@/lib/image-variants.mjs');

const VARIANT_COUNT = WIDTHS.length * FORMATS.length;

function makeGetResponse() {
    return {
        Body: { transformToByteArray: vi.fn().mockResolvedValue(Buffer.from('fake-image')) },
    };
}

function makeNotFoundError() {
    return Object.assign(new Error('Not Found'), {
        name: 'NotFound',
        $metadata: { httpStatusCode: 404 },
    });
}

describe('WIDTHS / FORMATS constants', () => {
    it('exports four widths', () => {
        expect(WIDTHS).toHaveLength(4);
        expect(WIDTHS).toContain(320);
        expect(WIDTHS).toContain(1920);
    });

    it('exports webp and avif formats', () => {
        expect(FORMATS.map((f: { ext: string }) => f.ext)).toEqual(expect.arrayContaining(['webp', 'avif']));
    });
});

describe('listObjects', () => {
    const mockSend = vi.fn();
    const mockS3 = { send: mockSend };

    beforeEach(() => { mockSend.mockReset(); });

    it('yields keys from a single page', async () => {
        mockSend.mockResolvedValueOnce({
            Contents: [{ Key: 'a/b.jpg' }, { Key: 'a/c.png' }],
            IsTruncated: false,
        });
        const keys: string[] = [];
        for await (const key of listObjects(mockS3, 'bucket', 'a/')) keys.push(key);
        expect(keys).toEqual(['a/b.jpg', 'a/c.png']);
    });

    it('paginates using ContinuationToken', async () => {
        mockSend
            .mockResolvedValueOnce({ Contents: [{ Key: 'x.jpg' }], IsTruncated: true, NextContinuationToken: 'tok' })
            .mockResolvedValueOnce({ Contents: [{ Key: 'y.jpg' }], IsTruncated: false });
        const keys: string[] = [];
        for await (const key of listObjects(mockS3, 'bucket', '')) keys.push(key);
        expect(keys).toEqual(['x.jpg', 'y.jpg']);
        expect(mockSend).toHaveBeenCalledTimes(2);
    });

    it('returns empty for an empty bucket', async () => {
        mockSend.mockResolvedValueOnce({ Contents: [], IsTruncated: false });
        const keys: string[] = [];
        for await (const key of listObjects(mockS3, 'bucket', '')) keys.push(key);
        expect(keys).toEqual([]);
    });

    it('handles undefined Contents', async () => {
        mockSend.mockResolvedValueOnce({ Contents: undefined, IsTruncated: false });
        const keys: string[] = [];
        for await (const key of listObjects(mockS3, 'bucket', '')) keys.push(key);
        expect(keys).toEqual([]);
    });
});

describe('ensureVariants — skip conditions', () => {
    const mockSend = vi.fn();
    const mockS3 = { send: mockSend };

    beforeEach(() => { mockSend.mockReset(); });

    it('skips keys matching the variant pattern (-w<n>.webp/avif)', async () => {
        await ensureVariants(mockS3, 'bucket', 'dir/img-w640.webp');
        await ensureVariants(mockS3, 'bucket', 'dir/img-w1280.avif');
        expect(mockSend).not.toHaveBeenCalled();
    });

    it('skips .gitkeep files', async () => {
        await ensureVariants(mockS3, 'bucket', 'dir/.gitkeep');
        expect(mockSend).not.toHaveBeenCalled();
    });

    it('skips keys inside a /variants/ folder', async () => {
        await ensureVariants(mockS3, 'bucket', 'dir/variants/img.jpg');
        expect(mockSend).not.toHaveBeenCalled();
    });

    it('skips non-image files', async () => {
        await ensureVariants(mockS3, 'bucket', 'dir/doc.pdf');
        await ensureVariants(mockS3, 'bucket', 'dir/data.json');
        expect(mockSend).not.toHaveBeenCalled();
    });

    it('skips root-level keys with no directory', async () => {
        await ensureVariants(mockS3, 'bucket', 'photo.jpg');
        expect(mockSend).not.toHaveBeenCalled();
    });
});

describe('ensureVariants — variant creation', () => {
    const mockSend = vi.fn();
    const mockS3 = { send: mockSend };

    beforeEach(() => { mockSend.mockReset(); });

    it('skips PutObject when all variants already exist (HeadObject 200)', async () => {
        mockSend.mockImplementation(async (cmd: unknown) => {
            if (cmd instanceof GetObjectCommand) return makeGetResponse();
            return {};
        });
        await ensureVariants(mockS3, 'bucket', 'dir/photo.jpg');
        const puts = mockSend.mock.calls.filter(([cmd]) => cmd instanceof PutObjectCommand);
        expect(puts).toHaveLength(0);
    });

    it('creates all variants when none exist (HeadObject 404)', async () => {
        mockSend.mockImplementation(async (cmd: unknown) => {
            if (cmd instanceof GetObjectCommand) return makeGetResponse();
            if (cmd instanceof HeadObjectCommand) throw makeNotFoundError();
            if (cmd instanceof PutObjectCommand) return {};
        });
        await ensureVariants(mockS3, 'bucket', 'dir/photo.jpg');
        const puts = mockSend.mock.calls.filter(([cmd]) => cmd instanceof PutObjectCommand);
        expect(puts).toHaveLength(VARIANT_COUNT);
    });

    it('generates correctly named variant keys', async () => {
        mockSend.mockImplementation(async (cmd: unknown) => {
            if (cmd instanceof GetObjectCommand) return makeGetResponse();
            if (cmd instanceof HeadObjectCommand) throw makeNotFoundError();
            if (cmd instanceof PutObjectCommand) return {};
        });
        await ensureVariants(mockS3, 'bucket', 'assets/photos/sunset.jpg');
        const puts = mockSend.mock.calls.filter(([cmd]) => cmd instanceof PutObjectCommand);
        const keys = puts.map(([cmd]) => (cmd as PutObjectCommand).input.Key);
        expect(keys).toContain('assets/photos/variants/sunset-w320.webp');
        expect(keys).toContain('assets/photos/variants/sunset-w320.avif');
        expect(keys).toContain('assets/photos/variants/sunset-w1920.webp');
        expect(keys).toContain('assets/photos/variants/sunset-w1920.avif');
    });

    it('only creates missing variants (partial HeadObject 404)', async () => {
        const existingKeys = new Set(['dir/variants/photo-w320.webp', 'dir/variants/photo-w320.avif']);
        mockSend.mockImplementation(async (cmd: unknown) => {
            if (cmd instanceof GetObjectCommand) return makeGetResponse();
            if (cmd instanceof HeadObjectCommand) {
                if (existingKeys.has((cmd as HeadObjectCommand).input.Key!)) return {};
                throw makeNotFoundError();
            }
            if (cmd instanceof PutObjectCommand) return {};
        });
        await ensureVariants(mockS3, 'bucket', 'dir/photo.jpg');
        const puts = mockSend.mock.calls.filter(([cmd]) => cmd instanceof PutObjectCommand);
        expect(puts).toHaveLength(VARIANT_COUNT - existingKeys.size);
        const putKeys = puts.map(([cmd]) => (cmd as PutObjectCommand).input.Key);
        expect(putKeys).not.toContain('dir/variants/photo-w320.webp');
        expect(putKeys).not.toContain('dir/variants/photo-w320.avif');
    });

    it('rethrows non-404 HeadObject errors', async () => {
        const networkErr = Object.assign(new Error('Network Error'), { name: 'NetworkError' });
        mockSend.mockImplementation(async (cmd: unknown) => {
            if (cmd instanceof GetObjectCommand) return makeGetResponse();
            if (cmd instanceof HeadObjectCommand) throw networkErr;
        });
        await expect(ensureVariants(mockS3, 'bucket', 'dir/photo.jpg')).rejects.toThrow('Network Error');
    });

    it('sets correct ContentType and CacheControl on PutObject', async () => {
        mockSend.mockImplementation(async (cmd: unknown) => {
            if (cmd instanceof GetObjectCommand) return makeGetResponse();
            if (cmd instanceof HeadObjectCommand) throw makeNotFoundError();
            if (cmd instanceof PutObjectCommand) return {};
        });
        await ensureVariants(mockS3, 'bucket', 'dir/photo.jpg');
        const puts = mockSend.mock.calls.filter(([cmd]) => cmd instanceof PutObjectCommand);
        const webpPut = puts.find(([cmd]) => (cmd as PutObjectCommand).input.Key?.endsWith('.webp'));
        const avifPut = puts.find(([cmd]) => (cmd as PutObjectCommand).input.Key?.endsWith('.avif'));
        expect((webpPut![0] as PutObjectCommand).input.ContentType).toBe('image/webp');
        expect((avifPut![0] as PutObjectCommand).input.ContentType).toBe('image/avif');
        expect((webpPut![0] as PutObjectCommand).input.CacheControl).toBe('public, max-age=31536000, immutable');
    });
});

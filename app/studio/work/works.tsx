
import path from 'node:path';
import { getSignedImageUrls } from '@/lib/listimages';
import WorkView from './workView';

export default async function Works({ name }: { name: string }) {
    const urls = await getSignedImageUrls(`raw/${name}`);

    return <WorkView images={urls} />;
}

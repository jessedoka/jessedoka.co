
import path from 'node:path';
import { getSignedImageUrls } from '@/lib/listimages';
import WorkView from './workView';

export default async function Works({ name }: { name: string }) {
    const urls = await getSignedImageUrls(`raw/${name}`, ((key: string) => {
            const { dir, name } = path.parse(key);
            return `${dir}/${name}-w1280.webp`;
        }));


    return <WorkView images={urls} />;
}

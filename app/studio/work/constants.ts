export type Work = {
    name: string;
    url: string;
    banner: string;
    featured?: boolean;
};

export const WORKS: Work[] = [
    { name: 'Keswick', url: 'keswick', banner: 'https://img.jessedoka.co/assets/portfolio/landscapes/keswick/variants/keswick_loneIsland-w1920.webp', featured: true },
    { name: 'Wales', url: 'wales', banner: 'https://img.jessedoka.co/assets/portfolio/landscapes/wales/variants/wales_viewsBeforeSnowdon2-w1920.webp' },
    { name: 'King Of The Ring', url: 'kingofthering', banner: 'https://img.jessedoka.co/assets/portfolio/events/kingofthering/variants/kingofthering_greyScaleSidePunch-w1920.webp' },
];

export const WORK_PATHS: Record<string, string> = {
    'keswick': 'assets/portfolio/landscapes/keswick',
    'wales': 'assets/portfolio/landscapes/wales',
    'kingofthering': 'assets/portfolio/events/kingofthering',
};
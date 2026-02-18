declare module '*.frag' {
  const content: string;
  export default content;
}

declare module 'glslCanvas' {
  export default class GlslCanvas {
    constructor(canvas: HTMLCanvasElement);
    load(fragmentString: string): void;
    setUniform(name: string, ...value: number[]): void;
    destroy(): void;
  }
}

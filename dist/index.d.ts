interface WalkOptions {
    depth?: number;
    extension?: string;
}
/**
 * Walk down `directory` and return an array of tuples corresponding to all
 * paths found within.
 * Travel only as far down as `options.depth` and limit results to
 * `options.extension` if provided.
 */
declare const walk: (directory: string, options?: WalkOptions) => string[][];

export { walk };

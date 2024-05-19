const trim = (text: string) => text.replace(/^\d+-/, '');

/**
 * Make a dictionary of path crumbs out of the provided tree of files.
 *
 * Expect the tree to have a depth of 2 where for each path tuple, the first
 * item is the chapter name and the second item corrspond to the chapter slug.
 * The output is a map of named route to crumb arrays for further reference.
 * More notably, crumbs correspond to the real file name including digit
 * prefixes and file extensions.
 */
export const makePaths = (paths: [chapter: string, slug: string][]) =>
  paths.reduce<Record<string, Record<string, string[]>>>(
    (accumulator, [realChapter, realSlug]) => {
      const [chapter, slug] = [trim(realChapter), trim(realSlug)];
      const path = (accumulator[chapter] ??= {});
      path[slug] = [realChapter, `${realSlug}.md`];
      return accumulator;
    },
    {},
  );

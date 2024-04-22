const trim = (text: string): string => text.replace(/^\d+-/, '');

type Entry = { label: string; path: string };

export type Menu = [chapter: string, entries: Entry[]][];

export const makeMenu = (paths: [chapter: string, slug: string][]): Menu => {
  const menu = paths.reduce<Map<string, Entry[]>>((accumulator, crumbs) => {
    if (crumbs.length !== 2) {
      throw new Error(`Expect depth of 2 but got "${crumbs}"`);
    }
    const [realChapter, realSlug] = crumbs;
    const [chapter, slug] = [trim(realChapter), trim(realSlug)];
    if (!accumulator.get(chapter)) {
      accumulator.set(chapter, []);
    }
    const nodes = accumulator.get(chapter)!;
    nodes.push({ label: slug, path: `/${chapter}/${slug}` });
    return accumulator;
  }, new Map());
  return Array.from(menu);
};

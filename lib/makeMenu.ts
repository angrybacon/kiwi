type Entry = { label: string; path: string };

export type Menu = [chapter: string, entries: Entry[]][];

export const makeMenu = (paths: [chapter: string, slug: string][]): Menu => {
  const menu = paths.reduce<Map<string, Entry[]>>(
    (accumulator, [chapter, slug]) => {
      if (!accumulator.get(chapter)) {
        accumulator.set(chapter, []);
      }
      const nodes = accumulator.get(chapter)!;
      nodes.push({ label: slug, path: `/${chapter}/${slug}` });
      return accumulator;
    },
    new Map(),
  );
  return Array.from(menu);
};

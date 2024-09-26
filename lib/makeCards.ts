import { join } from 'node:path';

import { read } from './read.ts';

/**
 * Read all the provided PATHS and read Markdown found to create data cards.
 * Loop over SPECIFICATIONS entries and augment each card with it.
 */
export const makeCards = async <
  TCrumbs extends readonly [string, ...string[]],
  TSpecifications extends Record<
    string,
    (context: {
      crumbs: { [K in keyof TCrumbs]: string };
      matter: Record<string, unknown>;
      path: string;
    }) => any
  >,
>(
  input: { paths: TCrumbs[]; root: string },
  /**
   * The specification table to augment the card with.
   * Both `href` and `title` are already managed by this function and are
   * ignored.
   */
  specifications: TSpecifications,
) =>
  Promise.all(
    input.paths.map(async (crumbs) => {
      const prettyCrumbs = crumbs.map((crumb) =>
        crumb.replace(/^\d+-/, ''),
      ) as { [K in keyof TCrumbs]: string };
      const relativePath = join(...crumbs) + '.md';
      const path = join(input.root, relativePath);
      const { matter } = await read([path]);
      const extra = Object.fromEntries(
        Object.entries(specifications).map(([name, f]) => [
          name,
          f({ crumbs: prettyCrumbs, matter, path: relativePath }),
        ]),
      ) as { [K in keyof TSpecifications]: ReturnType<TSpecifications[K]> };
      if (typeof matter.title !== 'string' || !matter.title.length) {
        throw new Error(`Missing title in '${relativePath}'`);
      }
      return {
        ...extra,
        href: ['', ...prettyCrumbs].join('/'),
        path,
        title: matter.title,
      };
    }),
  );

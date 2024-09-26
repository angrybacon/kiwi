import { join } from 'node:path';

import { read } from './read.ts';
import { trimOrderPrefix } from './trimOrderPrefix.ts';

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
    }) => unknown
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
    input.paths.map(async (items) => {
      const crumbs = items.map((crumb) => trimOrderPrefix(crumb)) as {
        [K in keyof TCrumbs]: string;
      };
      const id = crumbs.join('!');
      const path = join(input.root, join(...items) + '.md');
      const { matter } = await read([path]);
      try {
        if (typeof matter.title !== 'string' || !matter.title.length) {
          throw new Error(`Invalid title`);
        }
        const extra = Object.fromEntries(
          Object.entries(specifications).map(([name, f]) => {
            try {
              return [name, f({ crumbs: crumbs, matter })];
            } catch (error) {
              const message = error instanceof Error ? error.message : error;
              throw new Error(`Invalid specification "${name}" ${message}`);
            }
          }),
        ) as { [K in keyof TSpecifications]: ReturnType<TSpecifications[K]> };
        return {
          ...extra,
          href: ['', ...crumbs].join('/'),
          /** Identifier serialized from the crumbs for easy comparison. */
          id,
          path,
          title: matter.title,
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : error;
        throw new Error(`${message} in "${id}"`);
      }
    }),
  );

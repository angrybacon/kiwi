import { join } from 'node:path';

import { read } from './read';
import { trimOrderPrefix } from './trimOrderPrefix';

/**
 * Read the provided PATHS under ROOT and make a dictionary of data cards.
 *
 * Use the optional PREFIX in order to build the resulting href for each card.
 * Loop over SPECIFICATIONS entries and augment each card with it.
 *
 * Caller responsible for keeping PATHS bounded.
 */
export const makeCards = <
  TCrumbs extends readonly [string, ...string[]],
  TSpecifications extends Record<
    string,
    (context: {
      crumbs: { [K in keyof TCrumbs]: string };
      matter: Record<string, unknown>;
    }) => unknown
  >,
>(
  input: { paths: TCrumbs[]; prefix?: `/${string}`; root: string },
  /** The specification table to augment the card with */
  specifications: TSpecifications,
) =>
  Promise.all(
    input.paths.map(async (items) => {
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      const crumbs = items.map((crumb) => trimOrderPrefix(crumb)) as {
        [K in keyof TCrumbs]: string;
      };
      const id = crumbs.join('!');
      const path = join(input.root, ...items) + '.md';
      const { matter } = await read(path);
      const entries = Object.entries(specifications).map(([name, f]) => {
        try {
          return [name, f({ crumbs, matter })];
        } catch (cause) {
          const error = cause instanceof Error ? cause.message : String(cause);
          throw new Error(
            `Invalid specification "${name}" in "${id}". ${error}`,
            { cause },
          );
        }
      });
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion
      const extra = Object.fromEntries(entries) as {
        [K in keyof TSpecifications]: ReturnType<TSpecifications[K]>;
      };
      return {
        ...extra,
        href: [input.prefix ?? '', ...crumbs].join('/'),
        /** Identifier serialized from the crumbs for easy comparison */
        id,
        path,
      };
    }),
  );

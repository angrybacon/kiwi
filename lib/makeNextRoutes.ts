import { trimOrderPrefix } from './trimOrderPrefix';

/**
 * Loop over the provided PATHS and use NAMES to group routes.
 *
 * The output is meant to be used with the Next.js _app_ router (_pages_ router
 * not supported).
 * Each route consists of key value pairs corresponding to the provided name
 * specifications and each crumb is stripped of its digits prefix.
 */
export const makeNextRoutes = <
  TName extends string,
  TRoute extends Record<TName, string>,
>(
  paths: [...crumbs: string[]][],
  names: TName[],
): TRoute[] =>
  paths.map((crumbs) => {
    if (crumbs.length !== names.length) {
      throw new Error(
        `Found orphan at "${crumbs.join('/')}", expected depth of ${names.length}`,
      );
    }
    const route = {} as Record<string, string>;
    for (let index = 0; index < names.length; index++) {
      route[names[index]!] = trimOrderPrefix(crumbs[index]!);
    }
    // oxlint-disable-next-line typescript/no-unsafe-type-assertion
    return route as TRoute;
  });

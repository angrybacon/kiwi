import { trimOrderPrefix } from './trimOrderPrefix.ts';

/**
 * Loop over the provided `paths` and return an array of named routes.
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
        `Found orphan at "${crumbs}", expected depth of ${names.length}`,
      );
    }
    return names.reduce<TRoute>(
      (route, name, index) => ({
        ...route,
        [name]: crumbs[index] && trimOrderPrefix(crumbs[index]),
      }),
      {} as TRoute,
    );
  });

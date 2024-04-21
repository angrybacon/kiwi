/** Loop over the provided `paths` and return an array of named routes. */
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
    return names.reduce(
      (route, name, index) => ({
        ...route,
        [name]: crumbs[index]?.replace(/^\d+-/, ''),
      }),
      {} as TRoute,
    );
  });

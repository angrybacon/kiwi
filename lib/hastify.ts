type Directive = {
  attributes?: Record<string, any> | null;
  data?: { hName?: string; hProperties?: object };
  name: string;
};

/**
 * Augment the input DIRECTIVE with the provided EXTRA properties.
 *
 * This also asserts that the output directive has the expected well-formed
 * properties.
 *
 * Note that the recommended way to decorate things seems to involve flat and
 * HTML-supported attributes in the resulting `hProperties` map. Since we need
 * more complex data, we cheat and use that very map to transport data from
 * remarkers to renderers. This might make HAST gurus cringe a lot but heh it
 * works.
 */
export function hastify<TDirective extends Directive, TExtra extends object>(
  directive: TDirective,
  extra: TExtra,
): asserts directive is TDirective & {
  data: NonNullable<TDirective['data']> & {
    hName: TDirective['name'];
    hProperties: NonNullable<TDirective['data']>['hProperties'] & TExtra;
  };
} {
  directive.data = directive.data || {};
  directive.data.hName = directive.name;
  directive.data.hProperties = {
    ...directive.data.hProperties,
    ...directive.attributes,
    ...extra,
  };
}

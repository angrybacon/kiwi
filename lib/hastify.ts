type Directive = {
  data?: { hName?: string; hProperties?: object };
  name: string;
};

/**
 * Augment the input directive with the provided extra properties.
 * Asserts that the output directive has the expected well-formed properties.
 */
export function hastify<
  TDirective extends Directive,
  TProperties extends object,
>(
  directive: TDirective,
  properties: TProperties,
): asserts directive is TDirective & {
  data: NonNullable<TDirective['data']> & {
    hName: TDirective['name'];
    hProperties: NonNullable<TDirective['data']>['hProperties'] & TProperties;
  };
} {
  directive.data = {
    ...directive.data,
    hName: directive.name,
    hProperties: { ...directive.data?.hProperties, ...properties },
  };
}

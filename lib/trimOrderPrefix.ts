const PREFIX = /^\d+-/;

/** Strip the order prefix from `input` and return the resulting string. */
export const trimOrderPrefix = (input: string) => input.replace(PREFIX, '');

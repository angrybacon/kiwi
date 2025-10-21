const PREFIX = /^\d+-/;

/** Strip the order prefix from INPUT and return the resulting string */
export const trimOrderPrefix = (input: string) => input.replace(PREFIX, '');

/**
 * Build an array of menu entries out of metadata cards.
 * Cards are grouped together following the `category` property.
 */
export const makeMenu = <
  TCategory extends string,
  TCard extends { category: TCategory },
>(
  cards: TCard[],
) => {
  const menu = cards.reduce<Map<TCard['category'], TCard[]>>(
    (accumulator, card) => {
      if (!accumulator.get(card.category)) {
        accumulator.set(card.category, []);
      }
      const nodes = accumulator.get(card.category)!;
      nodes.push(card);
      return accumulator;
    },
    new Map(),
  );
  return [...menu].map(([id, pages]) => ({ id, pages }));
};

export const triadMaker = (array) => {
  const triads = [];
  array.forEach((quote) => {
    const split = quote.split(' ');
    while (split.length >= 3) {
      triads.push(`${split[0].toLowerCase()} ${split[1].toLowerCase()} ${split[2].toLowerCase()}`);
      split.shift();
    }
  });
  return triads;
};

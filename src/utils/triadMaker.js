export const triadMaker = (array) => {
  const triads = [];
  array.forEach((quote) => {
    const split = quote.split(' ');
    while (split.length >= 3) {
      triads.push(`${split[0]} ${split[1]} ${split[2]}`);
      split.shift();
    }
  });
  return triads;
};

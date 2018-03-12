export const hunter = (input, array) => {
  let possibilities = array.filter(
    triad => triad.split(' ').indexOf(input) === 1
  );
  if (possibilities.length === 0) {
    possibilities = array.filter(
      triad => triad.split(' ').indexOf(input) === 0
    );
  }
  return possibilities[Math.floor(Math.random() * possibilities.length)];
};
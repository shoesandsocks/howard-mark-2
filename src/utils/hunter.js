export const hunter = (input, array) => {
  let possibilities = array.filter(triad => triad.split(' ').indexOf(input) === 1);
  if (possibilities.length === 0) {
    possibilities = array.filter(triad => triad.split(' ').indexOf(input) === 0);
    // not in 2nd spot? try first. not there either? it'll endd up returning undefined
  }
  return possibilities[Math.floor(Math.random() * possibilities.length)];
};

export const leftHunter = (input, array) => {
  const possibilities = array.filter(triad => triad.split(' ').indexOf(input) === 1);
  if (possibilities.length < 2) {
    // there's ALWAYS one. quit if you can't get 2.
    return undefined;
  }
  return possibilities[Math.floor(Math.random() * possibilities.length)];
};

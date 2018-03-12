import { recurse } from './recurse';

export const markov = (seed, allTriads) => {
  let result;
  const array = seed.split(' ');
  while (array.length > 0) {
    const w = array.shift();
    result = recurse(w, allTriads, '', array.length);
    if (result.length > 0 && result !== 'nah') {
      break;
    }
  }
  return result;
};

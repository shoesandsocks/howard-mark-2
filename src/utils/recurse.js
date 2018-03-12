import { hunter } from './hunter';

export const recurse = (input, array, phrase, triesLeft) => {
  let getATriad = hunter(input, array);
  if (typeof getATriad === 'undefined' && phrase === '' && triesLeft === 0) {
    // never took off; pick at random instead
    const rnd = Math.floor(Math.random() * array.length);
    getATriad = array[rnd];
  } else if (typeof getATriad === 'undefined' && phrase === '') {
    return 'nah';
  }
  if (typeof getATriad === 'undefined') return { text: phrase };

  const newInput = getATriad.split(' ')[2];
  const firstPair = `${getATriad.split(' ')[1]} ${newInput}`;
  const addToPhrase = `${phrase} ${newInput}`;
  const newPhrase = phrase === '' ? firstPair : addToPhrase;
  return recurse(newInput, array, newPhrase);
};

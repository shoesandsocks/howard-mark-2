import { recurse, recurseLeft } from './recurse';

export const markov = (seed, allTriads) => {
  let rightResult;
  const rightArray = seed.split(' ');
  while (rightArray.length > 0) {
    const w = rightArray.shift();
    rightResult = recurse(w, allTriads, '', rightArray.length);
    if (rightResult.length > 0 && rightResult !== 'nah') {
      break;
    }
  }
  console.log(rightResult);
  const right = rightResult.text;

  let leftResult;
  const leftArray = seed.split(' ');
  while (leftArray.length > 0) {
    const w = leftArray.shift(); // originally pop()
    leftResult = recurseLeft(w, allTriads, '', leftArray.length);
    if (leftResult.length > 0 && leftResult !== 'nah') {
      break;
    }
  }
  console.log(leftResult);
  const leftSplit = leftResult.text.split(' ');
  const leftLength = leftSplit.length;
  const lastLeft = leftSplit[leftLength - 1];

  const firstRight = rightResult.text.split(' ')[0];
  if (lastLeft === firstRight) {
    leftSplit.splice(-1, 1);
  }
  return { text: `${leftSplit.join(' ')} ${right}` };
};

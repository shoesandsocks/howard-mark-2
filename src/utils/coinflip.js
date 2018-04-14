export const coinflip = (num = 50) => {
  // if no num passed, default is 50
  let odds = 50; // odds set to 50, but...
  if (parseInt(num, 10) > 0 && parseInt(num, 10) < 101) {
    odds = num; // if num is a valid # from 0-100, it takes place of odds
  }
  return Math.random() * 100 < odds; // if rnd < odds, return true.
};

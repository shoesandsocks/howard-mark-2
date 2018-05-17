import fetch from 'node-fetch';

const getJSON = url =>
  new Promise(
    (resolve) => {
      fetch(url)
        .then(response =>
          response
            .json()
            .then(json => resolve(json.data))
            .catch(() => console.log('json err'.red))) // eslint-disable-line
        .catch(() => console.log('fetch error'.red)); // eslint-disable-line
    },
    (reject) => {
      reject({ text: 'it barfed.' });
    },
  );

export const coreUpdate = async (db) => {
  const quoteArray = await getJSON('https://mtklr.github.io/howard/js/howard.json');
  console.log(quoteArray[300]); // just to see if it's working
  const stringedQA = quoteArray.map((q, i) => {
    const toString = q.title ? Object.assign({}, q, { episode: i }) : q;
    return JSON.stringify(toString);
  });

  const entireDb = await db
    .collection('howard')
    .find({ deprecated: { $exists: false } }, { _id: 0, original: 1 })
    .toArray();

  const stringedEntireDb = entireDb.map(q => JSON.stringify(q.original));

  const newQuotes = quoteArray
    .map((q, i) => {
      let comparator = q;
      let stringedComparator = JSON.stringify(q);
      if (q.title) {
        comparator = Object.assign({}, q, { episode: i });
        stringedComparator = JSON.stringify(comparator);
      }
      if (stringedEntireDb.indexOf(stringedComparator) === -1) {
        return comparator;
      }
      return null;
    })
    .filter(a => a !== null);

  const depQuotes = entireDb
    .map((c) => {
      const dbquote = JSON.stringify(c.original);
      return stringedQA.indexOf(dbquote) === -1 ? c.original : null;
    })
    .filter(a => a !== null);

  newQuotes.forEach(q => db.collection('howard').insert({ original: q }));
  depQuotes.forEach((q) => {
    const someKey = Object.keys(q)[0];
    const itsValue = q[someKey];
    const dotKey = `original.${someKey}`;
    const query = { [dotKey]: itsValue };
    console.log(`query is: ${JSON.stringify(query)}`); // eslint-disable-line
    db.collection('howard').updateOne(query, { $set: { deprecated: true } });
  });
  console.log(newQuotes, depQuotes); // eslint-disable-line
  return { newQuotes, depQuotes };
};

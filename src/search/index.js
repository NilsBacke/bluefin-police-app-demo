import Fuse from 'fuse.js'
const laws = require('./laws.json')

export function fuzzyMatch(text, individualWords, opts) {
  const options = {
    includeScore: true,
    isCaseSensitive: false,
    keys: ['Desc'],
    MAX_DELTA: 0.25,
    location: 25,
    threshold: 0.6,
    distance: 100,
    ...opts,
  };

  const fuse = new Fuse(laws, options)

  if (!individualWords) {
    return oldFuzzyMatch(text, fuse, options.MAX_DELTA);
  }

  const words = text.split(" ");
  const cumulativeResults = [];
  for (const word of words) {
    const wordResults = fuzzyMatchWord(word, fuse, options.MAX_DELTA)
    cumulativeResults.push(wordResults)
  }

  console.log(cumulativeResults)

  const uniqResults = [];
  for (const oneWordResults of cumulativeResults) {
    for (const res of oneWordResults) {
      if (uniqResults.findIndex((r) => res.item.Desc === r.item.Desc) === -1) {
        uniqResults.push({
          timesSeen: 0,
          avgScore: 0,
          totalScore: 0,
          ...res,
        })
      }
    }
  }

  for (const oneWordResults of cumulativeResults) {
    for (const res of oneWordResults) {
      const uniqResIndex = uniqResults.findIndex((r) => r.item.Desc === res.item.Desc)
      uniqResults[uniqResIndex].timesSeen += 1;
      uniqResults[uniqResIndex].totalScore += res.score;
    }
  }

  // calculate averages
  for (let i = 0; i < uniqResults.length; i++) {
    if (uniqResults[i].timesSeen < words.length - 1) {
      uniqResults.splice(i)
      i--;
      continue
    }
    uniqResults[i].avgScore = uniqResults[i].totalScore / uniqResults[i].timesSeen
  }

  return uniqResults.sort((a, b) => (a.avgScore > b.avgScore) ? 1 : -1);
}

function fuzzyMatchWord(word, fuse, maxDelta) {
  const results = fuse.search(word)

  if (results.length === 0) {
    return results;
  }

  var score1 = 0;
  var score2 = 0;
  for (var i = 1; i < results.length; i++) {
    score1 = results[0].score;
    score2 = results[i].score;
    let delta = Math.abs(score1 - score2);

    if (delta > maxDelta) {
      results.splice(i);
      i--;
    }
  }

  return results;
}

function oldFuzzyMatch(text, fuse, MAX_DELTA) {
  const results = fuse.search(text)

  if (results.length === 0) {
    return results;
  }

  var score1 = 0;
  var score2 = 0;
  for (var i = 1; i < results.length; i++) {
    score1 = results[0].score;
    score2 = results[i].score;
    let delta = Math.abs(score1 - score2);

    if (delta > MAX_DELTA) {
      results.splice(i);
      i--;
    }
  }

  return results;
}

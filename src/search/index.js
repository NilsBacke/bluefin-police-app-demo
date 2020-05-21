import Fuse from 'fuse.js'
const laws = require('./laws.json')

// export function fuzzyMatch(text, opts) {
//   const options = {
//     includeScore: true,
//     isCaseSensitive: false,
//     keys: ['Desc'],
//     MAX_DELTA: 0.25,
//     location: 25,
//     threshold: 0.6,
//     distance: 100,
//     ...opts,
//   };

//   const fuse = new Fuse(laws, options)

//   const results = fuse.search(text)

//   if (results.length === 0) {
//     return results;
//   }

//   var score1 = 0;
//   var score2 = 0;
//   for (var i = 1; i < results.length; i++) {
//     score1 = results[0].score;
//     score2 = results[i].score;
//     let delta = Math.abs(score1 - score2);

//     if (delta > options.MAX_DELTA) {
//       results.splice(i);
//       i--;
//     }
//   }

//   return results;
// }

export function fuzzyMatch(text, opts) {
  const results = [];
  for (const law of laws) {
    results.push({
      ...law,
      score: fuzzyMatchPhrase(text.toLowerCase().split(' ').sort().join(' '), law.Desc.toLowerCase().split(' ').sort().join(' '))
    })
  }

  return results.sort((a, b) => b.score - a.score)
}

export function fuzzyMatchPhrase(strA, strB) {
  var termFreqA = termFreqMap(strA);
  var termFreqB = termFreqMap(strB);

  var dict = {};
  addKeysToDict(termFreqA, dict);
  addKeysToDict(termFreqB, dict);

  var termFreqVecA = termFreqMapToVector(termFreqA, dict);
  var termFreqVecB = termFreqMapToVector(termFreqB, dict);

  return cosineSimilarity(termFreqVecA, termFreqVecB);
}

function termFreqMap(str) {
  var words = str.split(' ');
  var termFreq = {};
  words.forEach(function(w) {
      termFreq[w] = (termFreq[w] || 0) + 1;
  });
  return termFreq;
}

function addKeysToDict(map, dict) {
  for (var key in map) {
      dict[key] = true;
  }
}

function termFreqMapToVector(map, dict) {
  var termFreqVector = [];
  for (var term in dict) {
      termFreqVector.push(map[term] || 0);
  }
  return termFreqVector;
}

function vecDotProduct(vecA, vecB) {
  var product = 0;
  for (var i = 0; i < vecA.length; i++) {
      product += vecA[i] * vecB[i];
  }
  return product;
}

function vecMagnitude(vec) {
  var sum = 0;
  for (var i = 0; i < vec.length; i++) {
      sum += vec[i] * vec[i];
  }
  return Math.sqrt(sum);
}

function cosineSimilarity(vecA, vecB) {
  return vecDotProduct(vecA, vecB) / (vecMagnitude(vecA) * vecMagnitude(vecB));
}

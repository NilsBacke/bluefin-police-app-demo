const laws = require('./laws.json')

function buildKeywords() {
  const keywords = [
    ...laws.map((l) => l["Key Word"]),
    ...laws.map((l) => l["Direct Object"]),
    ...laws.map((l) => l["Verb"]),
  ].map((w) => w.toLowerCase());
  return keywords.filter((item, i) => keywords.indexOf(item) === i)
}

export function fuzzyMatch(text) {
  const results = [];
  const keywords = buildKeywords();

  // check if text contains a keyword
  const includedKeywords = [];
  const words = text.split(' ');
  for (const word of words) {
    if (keywords.includes(word.toLowerCase())) {
      includedKeywords.push(word.toLowerCase());
    }
  }

  console.log(includedKeywords)

  let lawsToSearch = laws;

  for (const kword of includedKeywords) {
    lawsToSearch = lawsToSearch.concat(laws.filter((l) => l["Verb"].toLowerCase() === kword.toLowerCase() ||
      l["Direct Object"].toLowerCase() === kword.toLowerCase() ||
      l["Key Word"].toLowerCase() === kword.toLowerCase())).filter((item, i) => lawsToSearch.indexOf(item) === i)
  }

  for (const law of lawsToSearch) {
    results.push({
      ...law,
      score: fuzzyMatchPhrase(text.toLowerCase().split(' ').sort().join(' '), law.Desc.toLowerCase().split(' ').sort().join(' '))
    })
  }

  return results.filter((a) => a.score !== 0).sort((a, b) => b.score - a.score)
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
  words.forEach(function (w) {
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

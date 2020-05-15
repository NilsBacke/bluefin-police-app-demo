export function filterSearchResults(results, MAX_DELTA = 0.25) {
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

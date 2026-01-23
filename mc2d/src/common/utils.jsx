export function countNumberOfAtoms(formula) {
  // split on capital letters to get element+number strings
  var elnum = formula.split(/(?=[A-Z])/);
  var num = 0;
  elnum.forEach((v) => {
    let match = v.match(/\d+/);
    let n = match == null ? 1 : parseInt(match[0]);
    num += n;
  });
  return num;
}

export function countNumberOfElements(formula) {
  // just count the number of capital letters
  let matches = formula.match(/[A-Z]/g);
  return matches ? matches.length : 0;
}

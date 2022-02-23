export default function useMaskInput() {
  const tokens = {
    "#": { pattern: /\d/ },
    X: { pattern: /[0-9a-zA-Z]/ },
    S: { pattern: /[a-zA-Z]/ },
    A: { pattern: /[a-zA-Z]/, transform: (v) => v.toLocaleUpperCase() },
    a: { pattern: /[a-zA-Z]/, transform: (v) => v.toLocaleLowerCase() },
    "!": { escape: true },
  };
  const maskit = (value, mask, masked = true) => {
    value = value || "";
    mask = mask || "";
    let iMask = 0;
    let iValue = 0;
    let output = "";
    while (iMask < mask.length && iValue < value.length) {
      let cMask = mask[iMask];
      let masker = tokens[cMask];
      let cValue = value[iValue];
      if (masker && !masker.escape) {
        if (masker.pattern.test(cValue)) {
          output += masker.transform ? masker.transform(cValue) : cValue;
          iMask++;
        }
        iValue++;
      } else {
        if (masker && masker.escape) {
          iMask++;
          cMask = mask[iMask];
        }
        if (masked) output += cMask;
        if (cValue === cMask) iValue++;
        iMask++;
      }
    }

    let restOutput = "";
    while (iMask < mask.length && masked) {
      let cMask = mask[iMask];
      if (tokens[cMask]) {
        restOutput = "";
        break;
      }
      restOutput += cMask;
      iMask++;
    }

    return output + restOutput;
  };

  return { maskit };
}

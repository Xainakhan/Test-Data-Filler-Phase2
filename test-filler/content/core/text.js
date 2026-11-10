(() => {
  // Lower-cases, splits camelCase / letter+digit, strips punctuation.
  // Keeps Urdu letters and combining marks.
  const normalize = (value) =>
    String(value ?? "")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([a-zA-Z])(\d)/g, "$1 $2")
      .toLowerCase()
      .replace(/[^\p{L}\p{M}\p{N}]+/gu, " ")
      .trim();

  const tokens = (value) => new Set(normalize(value).split(" ").filter(Boolean));

  // True if `word` (one or more words) appears as whole words inside `value`.
  const containsWord = (value, word) =>
    ` ${normalize(value)} `.includes(` ${normalize(word)} `);

  // True if every word of at least one hint is present in `value`.
  const matchesAny = (value, hints) => {
    const have = tokens(value);
    return hints.some((hint) =>
      normalize(hint)
        .split(" ")
        .every((word) => have.has(word))
    );
  };

  window.TF.text = { normalize, tokens, containsWord, matchesAny };
})();

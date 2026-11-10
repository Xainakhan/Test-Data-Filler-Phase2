(() => {
  const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
  // Only trust a placeholder that looks like a sample value (+92.., 03.., dd/mm/yyyy).
  const SHAPE_HINT = /^[+\d]|^[dmy]{2,4}[/.-][dmy]{2,4}/i;

  const startClass = (s) =>
    s[0] === "+" ? "+" : s[0] === "0" ? "0" : /\d/.test(s[0]) ? "d" : "x";

  const features = (s) => [startClass(s), s.includes("-"), s.includes(" "), s.includes("/")];

  const hintScore = (value, hint) => {
    const v = features(value);
    const h = features(hint);
    return v.filter((f, i) => f === h[i]).length;
  };

  // Prefer the candidate whose shape is closest to the placeholder.
  function orderByHint(candidates, placeholder) {
    const hint = (placeholder || "").trim();
    if (!hint || !SHAPE_HINT.test(hint)) return candidates;
    return [...candidates].sort((a, b) => hintScore(b, hint) - hintScore(a, hint));
  }

  const withinLength = (el, v) => !(el.maxLength >= 0) || v.length <= el.maxLength;

  function matchesPattern(el, v) {
    if (!el.pattern) return true;
    try {
      return new RegExp(`^(?:${el.pattern})$`).test(v);
    } catch {
      return true;
    }
  }

  function matchesType(el, v) {
    if (el.type === "number") return /^\d+$/.test(v);
    if (el.type === "date") return ISO_DATE.test(v);
    return true;
  }

  const fits = (el, v) => withinLength(el, v) && matchesPattern(el, v) && matchesType(el, v);

  const truncate = (el, v) => (el.maxLength >= 0 ? v.slice(0, el.maxLength) : v);

  function clampDate(el, v) {
    if (!ISO_DATE.test(v)) return v;
    if (el.min && v < el.min) return el.min;
    if (el.max && v > el.max) return el.max;
    return v;
  }

  /** Picks the best candidate value for this element's constraints. */
  function choose(el, candidates) {
    const pool = el.type === "date" ? candidates.map((v) => clampDate(el, v)) : candidates;
    const ordered = orderByHint(pool, el.placeholder);
    return ordered.find((v) => fits(el, v)) ?? truncate(el, ordered[0]);
  }

  function randomNumber(el) {
    const min = el.min !== "" ? Number(el.min) : 1;
    const max = el.max !== "" ? Number(el.max) : min + 99;
    const step = Number(el.step) > 0 ? Number(el.step) : 1;
    const steps = Math.max(0, Math.floor((max - min) / step));
    return String(min + TF.random.int(0, steps) * step);
  }

  TF.constraints = { choose, randomNumber };
})();

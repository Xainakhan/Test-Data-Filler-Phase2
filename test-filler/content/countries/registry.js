(() => {
  const { text, random } = TF;

  const generated = {}; // cache of fallback packs

  const fullPacks = () => Object.values(TF.countries);

  /** Pack for an ISO code: the full pack if there is one, else a generic one. */
  function get(code) {
    const key = String(code || "").toLowerCase();
    if (TF.countries[key]) return TF.countries[key];
    if (!(key in generated)) generated[key] = TF.fallbackPack(key);
    return generated[key];
  }

  const randomPack = () => random.pick(fullPacks());

  // ---- lookups used by auto-detection -------------------------------------

  let isoNames = null; // [{ code, name }] built once from Intl
  function allIsoNames() {
    if (isoNames) return isoNames;
    let display = null;
    try {
      display = new Intl.DisplayNames(["en"], { type: "region" });
    } catch {
      /* Intl.DisplayNames unavailable: only full packs can be matched by name */
    }
    isoNames = display
      ? Object.keys(TF.data.dialCodes).map((code) => ({ code, name: display.of(code) || "" }))
      : [];
    return isoNames;
  }

  // Short hints (PK, UAE) must equal the whole value; longer ones may appear inside it.
  function hintMatches(value, hint) {
    const h = text.normalize(hint);
    if (!h) return false;
    return h.length <= 3 ? value === h : text.matchesAny(value, [hint]);
  }

  /** "Pakistan", "United Arab Emirates (UAE)", "Germany" -> pack, or null. */
  function findByName(raw) {
    const value = text.normalize(raw);
    if (!value) return null;

    for (const pack of fullPacks()) {
      const { latin, native, aliases } = pack.country;
      if ([latin, native, ...aliases].some((hint) => hintMatches(value, hint))) return pack;
    }

    if (value.length === 2 && TF.data.dialCodes[value.toUpperCase()]) return get(value);

    let best = null;
    for (const { code, name } of allIsoNames()) {
      const normalized = text.normalize(name);
      if (normalized && text.matchesAny(value, [name]) && (!best || normalized.length > best.length)) {
        best = { code, length: normalized.length };
      }
    }
    return best ? get(best.code) : null;
  }

  function packForDial(dial) {
    const codes = Object.keys(TF.data.dialCodes).filter((c) => TF.data.dialCodes[c] === dial);
    if (!codes.length) return null;
    const full = codes.find((c) => TF.countries[c.toLowerCase()]);
    return get(full || TF.data.preferredByDial[dial] || codes[0]);
  }

  /** "+971 50 123 4567" or "Pakistan (+92)" -> pack, or null. */
  function findByDial(raw) {
    const match = /\+\s*(\d[\d\s-]*)/.exec(String(raw || ""));
    if (!match) return null;
    const digits = match[1].replace(/\D/g, "");
    for (const length of [3, 2, 1]) {
      if (digits.length < length) continue;
      const pack = packForDial(digits.slice(0, length));
      if (pack) return pack;
    }
    return null;
  }

  // Only countries with a full pack: .tv, .co, .me etc. are not country sites.
  function findByTld(hostname) {
    const label = String(hostname || "").toLowerCase().split(".").pop();
    return TF.countries[label === "uk" ? "gb" : label] || null;
  }

  TF.registry = { get, random: randomPack, findByName, findByDial, findByTld };
})();

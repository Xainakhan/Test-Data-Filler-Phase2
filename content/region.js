(() => {
  const { registry, dom, detect } = TF;

  // Strongest signal: a country field that already has a value.
  function fromCountryField(elements) {
    for (const el of elements) {
      if (detect.type(el) !== "country") continue;
      const pack = registry.findByName(dom.currentText(el));
      if (pack) return pack;
    }
    return null;
  }

  // Next: "+971..." in a phone field's value / placeholder or a dial-code select.
  function fromPhoneHints(elements) {
    for (const el of elements) {
      const type = detect.type(el);
      if (type !== "phone" && type !== "dialCode") continue;
      const pack = registry.findByDial(dom.currentText(el) || el.placeholder);
      if (pack) return pack;
    }
    return null;
  }

  const fromPage = (elements) =>
    fromCountryField(elements) ||
    fromPhoneHints(elements) ||
    registry.findByTld(location.hostname);

  /**
   * Chooses the country pack for this fill.
   * @param {{ country: string, fallbackCountry: string }} config
   * @param {Element[]} elements all fields on the page (used for detection)
   */
  function resolve({ country, fallbackCountry }, elements) {
    const fallback = registry.get(fallbackCountry) || registry.get("pk");
    if (country === "random") return registry.random();
    if (country !== "auto") return registry.get(country) || fallback;
    return fromPage(elements) || fallback;
  }

  TF.region = { resolve };
})();

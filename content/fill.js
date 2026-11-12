(() => {
  const { dom, detect, values, constraints, text, random } = TF;

  const shouldFill = (el, opts) => opts.overwrite || dom.isEmpty(el);

  // Each handler returns the element that was filled, or null.

  function fillText(el, ctx, opts) {
    const type = detect.type(el);
    if (!type || !shouldFill(el, opts)) return null;
    const candidates =
      type === "number" ? [constraints.randomNumber(el)] : values.candidates(type, ctx);
    if (!candidates.length) return null;
    dom.setValue(el, constraints.choose(el, candidates));
    return el;
  }

  function fillSelect(el, ctx, opts) {
    if (!shouldFill(el, opts)) return null;
    const options = Array.from(el.options).filter((o) => o.value !== "" && !o.disabled);
    if (!options.length) return null;
    const hints = values.optionHints(detect.type(el), ctx);
    const match = options.find((o) => text.matchesAny(`${o.text} ${o.value}`, hints));
    dom.setValue(el, (match ?? random.pick(options)).value);
    return el;
  }

  function radioGroup(radio) {
    if (!radio.name) return [radio];
    const root = radio.form ?? radio.getRootNode();
    return Array.from(root.querySelectorAll("input[type=radio]")).filter(
      (r) => r.name === radio.name
    );
  }

  function fillRadio(radio, ctx, opts, seenGroups) {
    const group = radioGroup(radio);
    if (seenGroups.has(group[0])) return null;
    seenGroups.add(group[0]);

    const usable = group.filter(dom.isFillable);
    if (!usable.length) return null;
    if (!opts.overwrite && group.some((r) => r.checked)) return null;

    const hints = values.optionHints(detect.type(radio), ctx);
    const match = usable.find((r) =>
      text.matchesAny(`${dom.labelText(r)} ${r.value}`, hints)
    );
    const chosen = match ?? random.pick(usable);
    chosen.click();
    return chosen;
  }

  // Only tick boxes that are required or look like terms / consent.
  function fillCheckbox(el) {
    const wanted = el.required || detect.type(el) === "consent";
    if (!wanted || el.checked) return null;
    el.click();
    return el;
  }

  const HANDLERS = {
    text: fillText,
    select: fillSelect,
    radio: fillRadio,
    checkbox: fillCheckbox,
  };

  /**
   * @param {Element[]} elements
   * @param {{ person: object, script: "latin" | "native" }} ctx
   * @param {{ overwrite: boolean, highlight: boolean }} opts
   */
  function run(elements, ctx, opts) {
    const seenGroups = new Set();
    for (const el of elements) {
      if (!dom.isFillable(el)) continue;
      const filled = HANDLERS[dom.kindOf(el)](el, ctx, opts, seenGroups);
      if (filled && opts.highlight) dom.highlight(filled);
    }
  }

  TF.fill = { run };
})();

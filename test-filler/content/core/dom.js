(() => {
  const FIELD_SELECTOR = "input, textarea, select";
  const TEXT_LIKE_TYPES = new Set([
    "text",
    "email",
    "tel",
    "password",
    "url",
    "number",
    "date",
  ]);

  // "text" | "select" | "radio" | "checkbox" | null (not fillable)
  function kindOf(el) {
    if (!el) return null;
    if (el.tagName === "SELECT") return "select";
    if (el.tagName === "TEXTAREA") return "text";
    if (el.tagName !== "INPUT") return null;
    const type = (el.type || "text").toLowerCase();
    if (type === "radio") return "radio";
    if (type === "checkbox") return "checkbox";
    return TEXT_LIKE_TYPES.has(type) ? "text" : null;
  }

  // All fields in the document, including inside open shadow roots.
  function collectFields(root = document, found = []) {
    root.querySelectorAll(FIELD_SELECTOR).forEach((el) => found.push(el));
    root.querySelectorAll("*").forEach((host) => {
      if (host.shadowRoot) collectFields(host.shadowRoot, found);
    });
    return found;
  }

  function deepActiveElement() {
    let active = document.activeElement;
    while (active && active.shadowRoot && active.shadowRoot.activeElement) {
      active = active.shadowRoot.activeElement;
    }
    return active;
  }

  function isFillable(el) {
    return (
      kindOf(el) !== null &&
      !el.disabled &&
      !el.readOnly &&
      el.getClientRects().length > 0
    );
  }

  function isEmpty(el) {
    switch (kindOf(el)) {
      case "select":
        return el.value === "" || el.selectedIndex <= 0;
      case "radio":
      case "checkbox":
        return !el.checked;
      default:
        return el.value.trim() === "";
    }
  }

  function labelText(el) {
    const labels = el.labels ? Array.from(el.labels, (l) => l.innerText) : [];
    const root = el.getRootNode();
    const labelledBy = (el.getAttribute("aria-labelledby") || "")
      .split(/\s+/)
      .map((id) => root.getElementById && root.getElementById(id))
      .filter(Boolean)
      .map((node) => node.innerText);
    return [...labels, ...labelledBy].join(" ");
  }

  // What the user would read in the field: selected option text, or the value.
  function currentText(el) {
    if (el.tagName === "SELECT") {
      const option = el.selectedOptions[0];
      // The first option of an untouched <select> is the browser default, not a choice.
      const chosen =
        option &&
        option.value !== "" &&
        (el.selectedIndex > 0 || option.defaultSelected);
      return chosen ? option.text : "";
    }
    return el.value || "";
  }

  // Native setter + events, so React / Vue controlled inputs notice the change.
  function setValue(el, value) {
    const setter = Object.getOwnPropertyDescriptor(
      Object.getPrototypeOf(el),
      "value",
    ).set;
    setter.call(el, value);
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function highlight(el) {
    const previous = el.style.outline;
    el.style.outline = "2px solid #1a9e5c";
    setTimeout(() => {
      el.style.outline = previous;
    }, 900);
  }

  window.TF.dom = {
    kindOf,
    collectFields,
    deepActiveElement,
    isFillable,
    isEmpty,
    labelText,
    currentText,
    setValue,
    highlight,
  };
})();

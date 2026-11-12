(() => {
  // Accepts "Name", ["Latin", "Native"] or { latin, native }.
  // A missing native form falls back to the Latin one.
  const toPair = (value) => {
    if (typeof value === "string") return { latin: value, native: value };
    if (Array.isArray(value)) return { latin: value[0], native: value[1] ?? value[0] };
    return { latin: value.latin, native: value.native ?? value.latin };
  };

  // A pair plus alternative spellings (used to match <select> options).
  const toPlace = (value) => ({ ...toPair(value), aliases: (value && value.aliases) || [] });

  TF.generic.toPair = toPair;
  TF.generic.toPlace = toPlace;
})();

(() => {
  const { int, digits } = TF.random;

  // Neutral international names; used for every country without a full pack.
  const NAMES = {
    male: ["Alex", "Daniel", "Michael", "David", "Chris", "Samuel", "Thomas", "Lucas"],
    female: ["Anna", "Maria", "Sophia", "Emma", "Julia", "Laura", "Elena", "Sarah"],
    last: ["Smith", "Garcia", "Muller", "Rossi", "Silva", "Novak", "Lee", "Kim"],
  };

  function countryName(iso) {
    try {
      return new Intl.DisplayNames(["en"], { type: "region" }).of(iso) || iso;
    } catch {
      return iso;
    }
  }

  /**
   * A plausible-looking pack for any ISO country: correct name and calling
   * code, generic everything else. Returns null for an unknown code.
   */
  function create(code) {
    const iso = code.toUpperCase();
    const dial = TF.data.dialCodes[iso];
    if (!dial) return null;

    const length = TF.data.nationalLengths[iso] ?? (dial === "1" ? 10 : 9);

    return TF.generic.pack.build({
      code: code.toLowerCase(),
      country: { latin: countryName(iso), aliases: [iso] },
      dial,
      names: NAMES,
      phone: {
        national: () => int(1, 9) + digits(length - 1),
        intlGroups: [3, length - 3],
        localGroups: [3, length - 3],
      },
      nationalId: () => {
        const id = digits(10);
        return { formatted: id, compact: id };
      },
      places: {
        postcodeLength: 5,
        cities: [{ name: "Capital City", region: "Central Region", postcode: "", areas: ["Downtown"] }],
      },
      companies: ["Example Trading Co", "Sample Services Ltd"],
    });
  }

  TF.fallbackPack = create;
})();

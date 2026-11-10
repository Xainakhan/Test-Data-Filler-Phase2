(() => {
  // Composes a country pack's person with the country-independent details.
  function create(pack) {
    const base = pack.createPerson();
    return {
      ...base,
      ...TF.generic.account(base),
      birthDate: TF.generic.dates.birthDate(),
      date: TF.generic.dates.recent(),
    };
  }

  TF.person = { create };
})();

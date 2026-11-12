(() => {
  const TF = (window.TF = window.TF || {});
  TF.countries = TF.countries || {}; // country packs, keyed by lowercase ISO code
  TF.generic = TF.generic || {}; //     country-independent building blocks
  TF.data = TF.data || {}; //           shared reference data
})();

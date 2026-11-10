(() => {
  const DEFAULTS = {
    country: "auto", 
    fallbackCountry: "pk",
    script: "latin", 
    overwrite: false, 
    highlight: true, 
  };

  const load = async () => {
    const stored = await chrome.storage.sync.get(DEFAULTS);
    return { ...DEFAULTS, ...stored };
  };

  const save = (values) => chrome.storage.sync.set(values);

  window.TF.settings = { DEFAULTS, load, save };
})();

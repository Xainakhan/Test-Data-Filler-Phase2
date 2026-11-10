(() => {
  const SCRIPTS = ["latin", "native"];

  const resolveScript = (setting) =>
    setting === "mixed" ? TF.random.pick(SCRIPTS) : setting;

  /**
   * Entry point, called by the popup / context menu / shortcut.
   * @param {"form" | "field"} mode
   */
  async function run(mode) {
    const config = await TF.settings.load();
    const fields = TF.dom.collectFields();

    const pack = TF.region.resolve(config, fields);
    const ctx = { person: TF.person.create(pack), script: resolveScript(config.script) };

    const single = mode === "field";
    TF.fill.run(single ? [TF.dom.deepActiveElement()] : fields, ctx, {
      overwrite: config.overwrite || single, // explicit "fill this field" always overwrites
      highlight: config.highlight,
    });
  }

  TF.run = run;
})();

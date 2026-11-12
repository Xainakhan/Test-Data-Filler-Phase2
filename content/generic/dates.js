(() => {
  const { int } = TF.random;

  const pad = (n) => String(n).padStart(2, "0");

  const format = (d) => ({
    iso: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    dmy: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`,
  });

  // Adult, 18 to 55 years old.
  const birthDate = () => {
    const year = new Date().getFullYear() - int(18, 55);
    return format(new Date(year, int(0, 11), int(1, 28)));
  };

  // Within 30 days of today.
  const recent = () => {
    const d = new Date();
    d.setDate(d.getDate() + int(-30, 30));
    return format(d);
  };

  TF.generic.dates = { birthDate, recent };
})();

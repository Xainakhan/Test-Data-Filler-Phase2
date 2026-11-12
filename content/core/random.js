(() => {
  const int = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const pick = (list) => list[int(0, list.length - 1)];

  const digits = (length) =>
    Array.from({ length }, () => int(0, 9)).join("");

  window.TF.random = { int, pick, digits };
})();

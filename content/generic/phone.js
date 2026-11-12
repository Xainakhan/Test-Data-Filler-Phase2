(() => {
  const group = (value, sizes, separator) => {
    if (!sizes) return value;
    let at = 0;
    return sizes
      .map((size) => {
        const part = value.slice(at, at + size);
        at += size;
        return part;
      })
      .join(separator);
  };

  /**
   * One mobile number in every format a form might ask for.
   * @param {object} spec
   * @param {string} spec.dial          country calling code, e.g. "92"
   * @param {string} spec.national      national number without trunk prefix
   * @param {string} [spec.trunk]       trunk prefix used locally, e.g. "0"
   * @param {number[]} [spec.intlGroups]  digit grouping of the national number
   * @param {number[]} [spec.localGroups] digit grouping of trunk + national
   */
  function build({ dial, national, trunk = "", intlGroups, localGroups }) {
    const local = trunk + national;
    return {
      intl: `+${dial}${national}`,
      intlSpaced: `+${dial} ${group(national, intlGroups, " ")}`,
      digits: `${dial}${national}`,
      local,
      localDashed: group(local, localGroups, "-"),
      national,
    };
  }

  TF.generic.phone = { build };
})();

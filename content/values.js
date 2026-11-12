(() => {
  const inScript = (pair, script) => (script === "native" ? pair.native : pair.latin);

  // Field type -> candidate values, most preferred first.
  // (constraints.js later picks the one that fits the element.)
  const CANDIDATES = {
    firstName: ({ person, script }) => [inScript(person.firstName, script)],
    lastName: ({ person, script }) => [inScript(person.lastName, script)],
    fullName: ({ person, script }) => [
      `${inScript(person.firstName, script)} ${inScript(person.lastName, script)}`,
    ],
    username: ({ person }) => [person.username],
    email: ({ person }) => [person.email],
    password: ({ person }) => [person.password],
    url: ({ person }) => [person.website],
    gender: ({ person }) => [person.gender],
    dialCode: ({ person }) => [`+${person.dial}`, person.dial],
    phone: ({ person: { phone } }) => [
      phone.intl, phone.local, phone.localDashed, phone.intlSpaced, phone.digits,
      phone.national,
    ],
    nationalId: ({ person }) => [person.nationalId.formatted, person.nationalId.compact],
    address: ({ person, script }) => [inScript(person.address.line, script)],
    city: ({ person, script }) => [inScript(person.address.city, script)],
    region: ({ person, script }) => [inScript(person.address.region, script)],
    postcode: ({ person }) => [person.address.postcode, person.address.postcode.replace(/\s/g, "")],
    country: ({ person, script }) => [inScript(person.country, script)],
    company: ({ person, script }) => [inScript(person.company, script)],
    message: ({ person, script }) => [inScript(person.message, script)],
    birthDate: ({ person }) => [person.birthDate.iso, person.birthDate.dmy],
    date: ({ person }) => [person.date.iso, person.date.dmy],
  };

  // Field type -> words to look for in <select> options and radio labels.
  const OPTION_HINTS = {
    gender: ({ person }) =>
      person.gender === "male"
        ? ["male", "man", "m", "مرد", "ذكر"]
        : ["female", "woman", "f", "عورت", "خاتون", "أنثى"],
    dialCode: ({ person }) => [person.dial, person.country.latin],
    city: ({ person }) => [person.address.city.latin, person.address.city.native],
    region: ({ person: { address } }) => [
      address.region.latin, address.region.native, ...address.region.aliases,
    ],
    country: ({ person: { country } }) => [country.latin, country.native, ...country.aliases],
  };

  TF.values = {
    candidates: (type, ctx) => (CANDIDATES[type] ? CANDIDATES[type](ctx) : []),
    optionHints: (type, ctx) => (OPTION_HINTS[type] ? OPTION_HINTS[type](ctx) : []),
  };
})();

(() => {
  const { pick, int, digits } = TF.random;
  const { toPair, toPlace } = TF.generic;

  const DEFAULT_MESSAGES = [
    "This is a test message for QA purposes.",
    "Please ignore this message, it is test data.",
    "Testing the form with sample data.",
  ];

  const defaultLine = ({ house, street, area }) =>
    toPair(`House ${house}, Street ${street}, ${area.latin}`);

  /**
   * Turns a declarative country spec into a "country pack":
   *   { code, country, dial, createPerson() }
   * See countries/pk/pack.js for a complete example.
   */
  function build(spec) {
    const names = TF.generic.names.create(spec.names);
    const country = toPlace(spec.country);
    const { places } = spec;

    const cities = places.cities.map((c) => ({
      name: toPair(c.name),
      region: toPlace(c.region),
      postcode: c.postcode,
      areas: c.areas.map(toPair),
    }));

    function createAddress() {
      const city = pick(cities);
      const area = pick(city.areas);
      const parts = { house: int(1, 450), street: int(1, 40), area };
      return {
        line: (places.line || defaultLine)(parts),
        area,
        city: city.name,
        region: city.region,
        postcode: places.postcode
          ? places.postcode(city)
          : city.postcode + digits(places.postcodeLength - city.postcode.length),
      };
    }

    function createPerson() {
      const first = names.firstName();
      const address = createAddress();
      return {
        gender: first.gender,
        firstName: first,
        lastName: names.lastName(),
        phone: TF.generic.phone.build({
          dial: spec.dial,
          national: spec.phone.national(),
          trunk: spec.phone.trunk,
          intlGroups: spec.phone.intlGroups,
          localGroups: spec.phone.localGroups,
        }),
        nationalId: spec.nationalId({ gender: first.gender, region: address.region.latin }),
        address,
        country,
        dial: spec.dial,
        company: toPair(pick(spec.companies)),
        message: toPair(pick(spec.messages || DEFAULT_MESSAGES)),
      };
    }

    return { code: spec.code, country, dial: spec.dial, createPerson };
  }

  // build + register, so the registry can find the pack by its code.
  function define(spec) {
    const pack = build(spec);
    TF.countries[spec.code] = pack;
    return pack;
  }

  TF.generic.pack = { build, define };
})();

(() => {
  const { pick, int, digits } = TF.random;

  const pad = (n, length) => String(n).padStart(length, "0");
  const STREETS = [
    "Maple Street", "Oak Avenue", "Cedar Road", "Pine Street", "Elm Street",
    "Washington Avenue", "Lake Drive", "Hill Road",
  ];
  const state = (latin, code) => ({ latin, aliases: [code] });
  const city = (name, region, postcode) => ({ name, region, postcode, areas: STREETS });

  TF.generic.pack.define({
    code: "us",
    country: { latin: "United States", aliases: ["US", "USA", "United States of America"] },
    dial: "1",

    names: {
      male: ["James", "John", "Michael", "David", "Daniel", "Matthew", "Andrew", "Joshua", "Ethan", "Ryan"],
      female: ["Mary", "Emily", "Sarah", "Jessica", "Olivia", "Emma", "Ashley", "Hannah", "Megan", "Laura"],
      last: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson", "Anderson", "Taylor"],
    },

    // 555-01XX is the range reserved for fictional use, so no real person gets called.
    phone: {
      national: () =>
        pick(["212", "415", "310", "305", "312", "206", "512", "617", "404", "202"]) +
        "555" + "01" + digits(2),
      intlGroups: [3, 3, 4],
      localGroups: [3, 3, 4],
    },

    // SSN: AAA-GG-SSSS without the ranges the SSA never issues. Format-valid only.
    nationalId: () => {
      let area;
      do {
        area = int(1, 899);
      } while (area === 666);
      const group = pad(int(1, 99), 2);
      const serial = pad(int(1, 9999), 4);
      return {
        formatted: `${pad(area, 3)}-${group}-${serial}`,
        compact: `${pad(area, 3)}${group}${serial}`,
      };
    },

    places: {
      postcodeLength: 5, // ZIP code
      line: ({ house, area }) => ({ latin: `${house} ${area.latin}`, native: `${house} ${area.latin}` }),
      cities: [
        city("New York", state("New York", "NY"), "100"),
        city("Los Angeles", state("California", "CA"), "900"),
        city("Chicago", state("Illinois", "IL"), "606"),
        city("Houston", state("Texas", "TX"), "770"),
        city("Phoenix", state("Arizona", "AZ"), "850"),
        city("Seattle", state("Washington", "WA"), "981"),
        city("Miami", state("Florida", "FL"), "331"),
        city("Boston", state("Massachusetts", "MA"), "021"),
        city("Denver", state("Colorado", "CO"), "802"),
      ],
    },

    companies: ["Maple Tech Solutions", "Liberty Trading Co", "Summit Software LLC", "Evergreen Services Inc"],
  });
})();

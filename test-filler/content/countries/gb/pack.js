(() => {
  const { pick, int, digits } = TF.random;

  const STREETS = [
    "High Street", "Church Road", "Station Road", "Park Lane", "Victoria Road",
    "Green Lane", "Mill Lane", "Kings Road",
  ];
  const region = (latin, aliases = []) => ({ latin, aliases });
  const city = (name, regionValue, postcode) => ({ name, region: regionValue, postcode, areas: STREETS });

  // Letters allowed in the last two characters of a postcode.
  const POSTCODE_LETTERS = "ABDEFGHJLNPQRSTUWXYZ";
  const NINO_FIRST = "ABCEGHJKLMNOPRSTWXYZ"; // no D F I Q U V
  const NINO_SECOND = "ABCEGHJKLMNPRSTWXYZ"; //  no D F I O Q U V
  const NINO_BANNED = new Set(["BG", "GB", "NK", "KN", "TN", "NT", "ZZ"]);

  const pickLetter = (letters) => letters[int(0, letters.length - 1)];

  TF.generic.pack.define({
    code: "gb",
    country: {
      latin: "United Kingdom",
      aliases: ["UK", "GB", "Great Britain", "United Kingdom of Great Britain and Northern Ireland"],
    },
    dial: "44",

    names: {
      male: ["Oliver", "George", "Harry", "Jack", "Charlie", "Thomas", "William", "Henry", "Oscar", "Alfie"],
      female: ["Olivia", "Amelia", "Isla", "Emily", "Poppy", "Ava", "Grace", "Lily", "Sophie", "Charlotte"],
      last: ["Smith", "Jones", "Taylor", "Brown", "Williams", "Wilson", "Evans", "Thomas", "Roberts", "Walker"],
    },

    // 07700 900xxx is the range Ofcom reserves for drama and tests.
    phone: {
      national: () => "7700900" + digits(3),
      trunk: "0",
      intlGroups: [4, 6],
      localGroups: [5, 6],
    },

    // National Insurance number, e.g. AB 12 34 56 C. Format-valid only.
    nationalId: () => {
      let prefix;
      do {
        prefix = pickLetter(NINO_FIRST) + pickLetter(NINO_SECOND);
      } while (NINO_BANNED.has(prefix));
      const number = digits(6);
      const suffix = pickLetter("ABCD");
      return {
        formatted: `${prefix} ${number.slice(0, 2)} ${number.slice(2, 4)} ${number.slice(4)} ${suffix}`,
        compact: `${prefix}${number}${suffix}`,
      };
    },

    places: {
      line: ({ house, area }) => ({ latin: `${house} ${area.latin}`, native: `${house} ${area.latin}` }),
      // e.g. "M1 4BT": area code + 1-2 digit district + space + digit + two letters
      postcode: (c) =>
        `${c.postcode}${int(1, 20)} ${int(0, 9)}${pickLetter(POSTCODE_LETTERS)}${pickLetter(POSTCODE_LETTERS)}`,
      cities: [
        city("London", region("Greater London", ["London"]), "SW"),
        city("Manchester", region("Greater Manchester"), "M"),
        city("Birmingham", region("West Midlands"), "B"),
        city("Edinburgh", region("Scotland"), "EH"),
        city("Glasgow", region("Scotland"), "G"),
        city("Cardiff", region("Wales"), "CF"),
        city("Leeds", region("West Yorkshire"), "LS"),
        city("Bristol", region("Bristol"), "BS"),
      ],
    },

    companies: ["Thames Tech Ltd", "Albion Trading Ltd", "Britannia Software Ltd", "Union Services Ltd"],
  });
})();

(() => {
  const { pick, int, digits } = TF.random;
  const { verhoeffCheckDigit } = TF.generic.checksums;

  const state = (latin, aliases = []) => ({ latin, aliases });

  TF.generic.pack.define({
    code: "in",
    country: { latin: "India", aliases: ["IN", "Republic of India", "Bharat"] },
    dial: "91",

    names: {
      male: ["Aarav", "Vivaan", "Arjun", "Rohan", "Amit", "Rahul", "Vikram", "Siddharth", "Karan", "Pranav"],
      female: ["Priya", "Ananya", "Neha", "Pooja", "Sneha", "Kavya", "Aditi", "Isha", "Riya", "Meera"],
      last: ["Sharma", "Verma", "Patel", "Singh", "Gupta", "Reddy", "Iyer", "Nair", "Mehta", "Kapoor"],
    },

    phone: {
      national: () => pick(["6", "7", "8", "9"]) + digits(9),
      intlGroups: [5, 5],
      localGroups: [5, 5],
    },

    // Aadhaar: 12 digits, first digit 2-9, Verhoeff check digit. Format-valid only.
    nationalId: () => {
      const payload = int(2, 9) + digits(10);
      const id = payload + verhoeffCheckDigit(payload);
      return { formatted: id.replace(/(\d{4})(?=\d)/g, "$1 "), compact: id };
    },

    places: {
      postcodeLength: 6, // PIN code
      line: ({ house, street, area }) => ({
        latin: `${house}, ${street}th Main Road, ${area.latin}`,
        native: `${house}, ${street}th Main Road, ${area.latin}`,
      }),
      cities: [
        { name: "Mumbai", region: state("Maharashtra", ["MH"]), postcode: "400", areas: ["Andheri", "Bandra", "Powai"] },
        { name: "Pune", region: state("Maharashtra", ["MH"]), postcode: "411", areas: ["Kothrud", "Baner"] },
        { name: "New Delhi", region: state("Delhi", ["NCT", "New Delhi"]), postcode: "110", areas: ["Dwarka", "Saket"] },
        { name: "Bengaluru", region: state("Karnataka", ["KA"]), postcode: "560", areas: ["Indiranagar", "Koramangala"] },
        { name: "Chennai", region: state("Tamil Nadu", ["TN"]), postcode: "600", areas: ["Adyar", "T Nagar"] },
        { name: "Hyderabad", region: state("Telangana", ["TS"]), postcode: "500", areas: ["Banjara Hills", "Madhapur"] },
        { name: "Kolkata", region: state("West Bengal", ["WB"]), postcode: "700", areas: ["Salt Lake", "Park Street"] },
        { name: "Ahmedabad", region: state("Gujarat", ["GJ"]), postcode: "380", areas: ["Navrangpura"] },
        { name: "Lucknow", region: state("Uttar Pradesh", ["UP"]), postcode: "226", areas: ["Gomti Nagar"] },
      ],
    },

    companies: [
      "Sharma Traders", "Bharat Tech Solutions", "Indus Software Services",
      "Lotus Enterprises", "Mumbai Trading Co",
    ],
  });
})();

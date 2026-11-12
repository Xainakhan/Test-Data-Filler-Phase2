(() => {
  const { pick, digits } = TF.random;
  const { male, female } = TF.data.arabicNames;
  const { luhnCheckDigit } = TF.generic.checksums;

  const RIYADH = { latin: "Riyadh", native: "الرياض", aliases: ["Ar Riyad", "Riyadh Province"] };
  const MAKKAH = { latin: "Makkah", native: "مكة المكرمة", aliases: ["Mecca", "Makkah Al Mukarramah"] };
  const MADINAH = { latin: "Madinah", native: "المدينة المنورة", aliases: ["Medina", "Al Madinah"] };
  const EASTERN = {
    latin: "Eastern Province", native: "المنطقة الشرقية", aliases: ["Ash Sharqiyah", "Eastern"],
  };

  TF.generic.pack.define({
    code: "sa",
    country: { latin: "Saudi Arabia", native: "المملكة العربية السعودية", aliases: ["KSA", "SA"] },
    dial: "966",

    names: {
      male,
      female,
      last: [
        ["Al Qahtani", "القحطاني"], ["Al Otaibi", "العتيبي"], ["Al Ghamdi", "الغامدي"],
        ["Al Harbi", "الحربي"], ["Al Dosari", "الدوسري"], ["Al Zahrani", "الزهراني"],
        ["Al Shehri", "الشهري"], ["Al Mutairi", "المطيري"], ["Al Anazi", "العنزي"],
      ],
    },

    phone: {
      national: () => pick(["50", "53", "54", "55", "56", "57", "58", "59"]) + digits(7),
      trunk: "0",
      intlGroups: [2, 3, 4],
      localGroups: [3, 3, 4],
    },

    // National ID (starts with 1) or Iqama (starts with 2): 10 digits, Luhn check digit.
    nationalId: () => {
      const payload = pick(["1", "2"]) + digits(8);
      const id = payload + luhnCheckDigit(payload);
      return { formatted: id, compact: id };
    },

    places: {
      postcodeLength: 5,
      line: ({ house, street, area }) => ({
        latin: `Building ${house}, Street ${street}, ${area.latin}`,
        native: `مبنى ${house}، شارع ${street}، ${area.native}`,
      }),
      cities: [
        {
          name: ["Riyadh", "الرياض"], region: RIYADH, postcode: "11",
          areas: [["Al Olaya", "العليا"], ["Al Malaz", "الملز"], ["Al Nakheel", "النخيل"], ["Hittin", "حطين"]],
        },
        {
          name: ["Jeddah", "جدة"], region: MAKKAH, postcode: "21",
          areas: [["Al Rawdah", "الروضة"], ["Al Hamra", "الحمراء"], ["Al Salamah", "السلامة"]],
        },
        {
          name: ["Makkah", "مكة المكرمة"], region: MAKKAH, postcode: "21",
          areas: [["Al Aziziyah", "العزيزية"]],
        },
        {
          name: ["Madinah", "المدينة المنورة"], region: MADINAH, postcode: "42",
          areas: [["Quba", "قباء"]],
        },
        {
          name: ["Dammam", "الدمام"], region: EASTERN, postcode: "31",
          areas: [["Al Faisaliyah", "الفيصلية"], ["Al Shati", "الشاطئ"]],
        },
        {
          name: ["Khobar", "الخبر"], region: EASTERN, postcode: "31",
          areas: [["Al Aqrabiyah", "العقربية"], ["Al Rakah", "الراكة"]],
        },
      ],
    },

    companies: [
      ["Najd Trading Company", "شركة نجد للتجارة"], ["Red Sea Technologies", "تقنيات البحر الأحمر"],
      ["Riyadh Solutions", "حلول الرياض"], ["Desert Falcon Services", "خدمات الصقر الصحراوي"],
      ["Arabian Star Enterprises", "مؤسسة النجمة العربية"],
    ],

    messages: [
      ["This is a test message for QA purposes.", "هذه رسالة اختبار لأغراض ضمان الجودة."],
      ["Please ignore this message, it is test data.", "يرجى تجاهل هذه الرسالة، فهي بيانات اختبار."],
      ["Testing the form with sample data.", "اختبار النموذج ببيانات تجريبية."],
    ],
  });
})();

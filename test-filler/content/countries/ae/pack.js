(() => {
  const { pick, int, digits } = TF.random;
  const { male, female } = TF.data.arabicNames;
  const { luhnCheckDigit } = TF.generic.checksums;

  const emirate = (latin, native, aliases, areas) => ({
    name: [latin, native],
    region: { latin, native, aliases },
    postcode: "",
    areas,
  });

  TF.generic.pack.define({
    code: "ae",
    country: { latin: "United Arab Emirates", native: "الإمارات العربية المتحدة", aliases: ["UAE", "AE"] },
    dial: "971",

    names: {
      male,
      female,
      last: [
        ["Al Mansoori", "المنصوري"], ["Al Hashimi", "الهاشمي"], ["Al Nuaimi", "النعيمي"],
        ["Al Ketbi", "الكتبي"], ["Al Shamsi", "الشامسي"], ["Al Falasi", "الفلاسي"],
        ["Al Suwaidi", "السويدي"], ["Al Mazrouei", "المزروعي"],
      ],
    },

    phone: {
      national: () => pick(["50", "52", "54", "55", "56", "58"]) + digits(7),
      trunk: "0",
      intlGroups: [2, 3, 4],
      localGroups: [3, 3, 4],
    },

    // Emirates ID: 784-YYYY-NNNNNNN-C, check digit by Luhn. Format-valid only.
    nationalId: () => {
      const year = int(1960, 2005);
      const serial = digits(7);
      const check = luhnCheckDigit(`784${year}${serial}`);
      return {
        formatted: `784-${year}-${serial}-${check}`,
        compact: `784${year}${serial}${check}`,
      };
    },

    places: {
      line: ({ house, street, area }) => ({
        latin: `Building ${house}, Street ${street}, ${area.latin}`,
        native: `مبنى ${house}، شارع ${street}، ${area.native}`,
      }),
      postcode: () => String(int(1, 99999)), // the UAE uses PO boxes, not postcodes
      cities: [
        emirate("Dubai", "دبي", ["Dubayy"], [
          ["Deira", "ديرة"], ["Jumeirah", "جميرا"], ["Business Bay", "الخليج التجاري"],
          ["Al Barsha", "البرشاء"], ["Dubai Marina", "دبي مارينا"],
        ]),
        emirate("Abu Dhabi", "أبوظبي", ["Abu Zaby"], [
          ["Khalidiyah", "الخالدية"], ["Al Reem Island", "جزيرة الريم"],
          ["Mussafah", "مصفح"], ["Corniche", "الكورنيش"],
        ]),
        emirate("Sharjah", "الشارقة", ["Ash Shariqah"], [
          ["Al Majaz", "المجاز"], ["Al Nahda", "النهدة"], ["Al Khan", "الخان"],
        ]),
        emirate("Ajman", "عجمان", [], [["Al Nuaimiya", "النعيمية"], ["Al Rashidiya", "الراشدية"]]),
        emirate("Umm Al Quwain", "أم القيوين", ["UAQ"], [["Al Salamah", "السلامة"]]),
        emirate("Ras Al Khaimah", "رأس الخيمة", ["RAK"], [["Al Nakheel", "النخيل"], ["Al Hamra", "الحمرا"]]),
        emirate("Fujairah", "الفجيرة", [], [["Al Faseel", "الفصيل"]]),
      ],
    },

    companies: [
      ["Al Noor Trading", "النور للتجارة"], ["Emirates Tech Solutions", "حلول الإمارات التقنية"],
      ["Gulf Star Enterprises", "مؤسسة نجمة الخليج"], ["Desert Rose Services", "خدمات وردة الصحراء"],
      ["Falcon Logistics", "الصقر للخدمات اللوجستية"],
    ],

    messages: [
      ["This is a test message for QA purposes.", "هذه رسالة اختبار لأغراض ضمان الجودة."],
      ["Please ignore this message, it is test data.", "يرجى تجاهل هذه الرسالة، فهي بيانات اختبار."],
      ["Testing the form with sample data.", "اختبار النموذج ببيانات تجريبية."],
    ],
  });
})();

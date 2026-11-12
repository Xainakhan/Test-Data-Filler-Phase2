(() => {
  const { pick, int, digits } = TF.random;

  const range = (from, to) =>
    Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

  // Jazz 300-309, Zong 310-319, Jazz/Warid 320-325, Ufone 330-337, Telenor 340-349
  const OPERATOR_CODES = [
    ...range(300, 309), ...range(310, 319), ...range(320, 325),
    ...range(330, 337), ...range(340, 349),
  ];

  // First digit of the CNIC area code, by province.
  const CNIC_REGION = {
    "Khyber Pakhtunkhwa": "1", Punjab: "3", Sindh: "4",
    Balochistan: "5", "Islamabad Capital Territory": "6",
  };

  const SINDH = { latin: "Sindh", native: "سندھ" };
  const PUNJAB = { latin: "Punjab", native: "پنجاب" };
  const ICT = {
    latin: "Islamabad Capital Territory", native: "اسلام آباد دارالحکومت",
    aliases: ["ICT", "Islamabad"],
  };
  const KP = { latin: "Khyber Pakhtunkhwa", native: "خیبر پختونخوا", aliases: ["KPK", "KP"] };
  const BALOCHISTAN = { latin: "Balochistan", native: "بلوچستان", aliases: ["Baluchistan"] };

  TF.generic.pack.define({
    code: "pk",
    country: { latin: "Pakistan", native: "پاکستان", aliases: ["PK", "PAK"] },
    dial: "92",

    names: {
      male: [
        ["Ahmed", "احمد"], ["Ali", "علی"], ["Hassan", "حسن"], ["Hussain", "حسین"],
        ["Usman", "عثمان"], ["Bilal", "بلال"], ["Hamza", "حمزہ"], ["Omar", "عمر"],
        ["Zain", "زین"], ["Faisal", "فیصل"], ["Imran", "عمران"], ["Kamran", "کامران"],
        ["Asad", "اسد"], ["Saad", "سعد"], ["Talha", "طلحہ"], ["Danish", "دانش"],
      ],
      female: [
        ["Ayesha", "عائشہ"], ["Fatima", "فاطمہ"], ["Zainab", "زینب"], ["Maryam", "مریم"],
        ["Hira", "حرا"], ["Sana", "ثنا"], ["Noor", "نور"], ["Iqra", "اقراء"],
        ["Amna", "آمنہ"], ["Sadia", "سعدیہ"], ["Bushra", "بشری"], ["Khadija", "خدیجہ"],
        ["Rabia", "رابعہ"], ["Laiba", "لائبہ"], ["Mehwish", "مہوش"], ["Anum", "انعم"],
      ],
      last: [
        ["Khan", "خان"], ["Malik", "ملک"], ["Sheikh", "شیخ"], ["Qureshi", "قریشی"],
        ["Siddiqui", "صدیقی"], ["Ansari", "انصاری"], ["Butt", "بٹ"], ["Chaudhry", "چوہدری"],
        ["Raza", "رضا"], ["Mirza", "مرزا"], ["Hashmi", "ہاشمی"], ["Baig", "بیگ"],
        ["Javed", "جاوید"], ["Akhtar", "اختر"], ["Abbasi", "عباسی"], ["Rizvi", "رضوی"],
      ],
    },

    phone: {
      national: () => pick(OPERATOR_CODES) + digits(7), // 3XX XXXXXXX
      trunk: "0",
      intlGroups: [3, 7],
      localGroups: [4, 7],
    },

    // Format-valid only. Not a real person's CNIC.
    nationalId: ({ gender, region }) => {
      const area = (CNIC_REGION[region] ?? String(int(1, 7))) + digits(4);
      const family = digits(7);
      const last = pick(gender === "male" ? [1, 3, 5, 7, 9] : [0, 2, 4, 6, 8]);
      return { formatted: `${area}-${family}-${last}`, compact: `${area}${family}${last}` };
    },

    places: {
      postcodeLength: 5,
      line: ({ house, street, area }) => ({
        latin: `House ${house}, Street ${street}, ${area.latin}`,
        native: `مکان ${house}، گلی ${street}، ${area.native}`,
      }),
      cities: [
        {
          name: ["Karachi", "کراچی"], region: SINDH, postcode: "74",
          areas: [
            ["Gulshan-e-Iqbal", "گلشن اقبال"], ["DHA", "ڈی ایچ اے"], ["Clifton", "کلفٹن"],
            ["North Nazimabad", "نارتھ ناظم آباد"], ["Saddar", "صدر"],
            ["Gulistan-e-Johar", "گلستان جوہر"],
          ],
        },
        {
          name: ["Lahore", "لاہور"], region: PUNJAB, postcode: "54",
          areas: [
            ["Gulberg", "گلبرگ"], ["DHA", "ڈی ایچ اے"], ["Johar Town", "جوہر ٹاؤن"],
            ["Model Town", "ماڈل ٹاؤن"], ["Bahria Town", "بحریہ ٹاؤن"],
          ],
        },
        {
          name: ["Islamabad", "اسلام آباد"], region: ICT, postcode: "44",
          areas: [
            ["F-10", "ایف-10"], ["G-11", "جی-11"], ["E-11", "ای-11"],
            ["I-8", "آئی-8"], ["Bahria Town", "بحریہ ٹاؤن"],
          ],
        },
        {
          name: ["Rawalpindi", "راولپنڈی"], region: PUNJAB, postcode: "46",
          areas: [
            ["Satellite Town", "سیٹلائٹ ٹاؤن"], ["Saddar", "صدر"],
            ["Chaklala", "چکلالہ"], ["Bahria Town", "بحریہ ٹاؤن"],
          ],
        },
        {
          name: ["Peshawar", "پشاور"], region: KP, postcode: "25",
          areas: [["University Town", "یونیورسٹی ٹاؤن"], ["Hayatabad", "حیات آباد"], ["Saddar", "صدر"]],
        },
        {
          name: ["Quetta", "کوئٹہ"], region: BALOCHISTAN, postcode: "87",
          areas: [["Satellite Town", "سیٹلائٹ ٹاؤن"], ["Jinnah Road", "جناح روڈ"]],
        },
        {
          name: ["Faisalabad", "فیصل آباد"], region: PUNJAB, postcode: "38",
          areas: [["Peoples Colony", "پیپلز کالونی"], ["Madina Town", "مدینہ ٹاؤن"]],
        },
        {
          name: ["Multan", "ملتان"], region: PUNJAB, postcode: "60",
          areas: [["Gulgasht Colony", "گلگشت کالونی"], ["Cantt", "کینٹ"]],
        },
      ],
    },

    companies: [
      ["Al-Noor Traders", "النور ٹریڈرز"], ["Karachi Tech Solutions", "کراچی ٹیک سولیوشنز"],
      ["Indus Software House", "انڈس سافٹ ویئر ہاؤس"], ["Pak Digital Services", "پاک ڈیجیٹل سروسز"],
      ["Lahore Trading Company", "لاہور ٹریڈنگ کمپنی"], ["Blue Star Enterprises", "بلیو اسٹار انٹرپرائزز"],
    ],

    messages: [
      ["This is a test message for QA purposes.", "یہ جانچ کے لیے ایک ٹیسٹ پیغام ہے۔"],
      ["Please ignore this message, it is test data.", "براہ کرم اس پیغام کو نظر انداز کریں، یہ ٹیسٹ ڈیٹا ہے۔"],
      ["Testing the form with sample Pakistani data.", "نمونہ ڈیٹا کے ساتھ فارم کی جانچ کی جا رہی ہے۔"],
    ],
  });
})();

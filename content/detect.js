(() => {
  const { dom, text } = TF;

  // Order matters: specific rules must come before generic ones
  // (e.g. "user name" before "name", "country code" before "country").
  const RULES = [
    { type: "email", autocomplete: ["email"],
      words: ["email", "e-mail", "mail", "ای میل", "ایمیل", "البريد", "البريد الإلكتروني"] },
    { type: "password", autocomplete: ["new-password", "current-password"],
      words: ["password", "passcode", "pwd", "پاس ورڈ", "كلمة المرور", "كلمة السر"] },
    { type: "dialCode", autocomplete: ["tel-country-code"],
      words: ["dial code", "country code", "phone code", "calling code", "isd code", "isd"] },
    { type: "phone", autocomplete: ["tel", "tel-national"],
      words: ["phone", "mobile", "cell", "telephone", "tel", "whatsapp", "contact number",
        "contact no", "فون", "موبائل", "رابطہ نمبر", "الهاتف", "هاتف", "الجوال", "جوال"] },
    { type: "nationalId", autocomplete: [],
      words: ["cnic", "nic", "national id", "id card", "identity card", "emirates id", "eid",
        "iqama", "aadhaar", "aadhar", "ssn", "social security", "nino", "national insurance",
        "شناختی کارڈ", "شناختی نمبر", "الهوية", "هوية", "رقم الهوية", "الإقامة", "الاقامة"] },
    { type: "gender", autocomplete: ["sex"],
      words: ["gender", "sex", "جنس", "الجنس"] },
    { type: "birthDate", autocomplete: ["bday"],
      words: ["birth", "birthday", "dob", "date of birth", "born", "تاریخ پیدائش", "تاريخ الميلاد"] },
    { type: "consent", autocomplete: [],
      words: ["terms", "agree", "accept", "consent", "privacy policy", "شرائط", "الشروط"] },
    { type: "username", autocomplete: ["username"],
      words: ["username", "user name", "login", "user id", "userid", "handle",
        "صارف نام", "اسم المستخدم"] },
    { type: "firstName", autocomplete: ["given-name"],
      words: ["first name", "firstname", "fname", "given name", "forename", "first",
        "پہلا نام", "الاسم الأول"] },
    { type: "lastName", autocomplete: ["family-name"],
      words: ["last name", "lastname", "lname", "surname", "family name",
        "آخری نام", "خاندانی نام", "اسم العائلة", "اللقب"] },
    { type: "company", autocomplete: ["organization"],
      words: ["company", "organization", "organisation", "business", "employer",
        "کمپنی", "ادارہ", "الشركة", "المؤسسة"] },
    { type: "city", autocomplete: ["address-level2"],
      words: ["city", "town", "شہر", "المدينة"] },
    { type: "region", autocomplete: ["address-level1"],
      words: ["province", "state", "region", "emirate", "county", "صوبہ", "المنطقة", "الإمارة"] },
    { type: "postcode", autocomplete: ["postal-code"],
      words: ["zip", "zipcode", "postal", "postcode", "post code", "pin code", "pincode",
        "po box", "p o box", "ڈاک", "الرمز البريدي", "صندوق البريد"] },
    { type: "country", autocomplete: ["country", "country-name"],
      words: ["country", "nation", "ملک", "الدولة", "البلد"] },
    { type: "address", autocomplete: ["street-address", "address-line1", "address-line2"],
      words: ["address", "street", "addr", "پتہ", "العنوان"] },
    { type: "url", autocomplete: ["url"],
      words: ["website", "url", "web site", "ویب سائٹ", "الموقع"] },
    { type: "fullName", autocomplete: ["name"],
      words: ["full name", "fullname", "name", "your name", "customer name", "contact name",
        "applicant", "نام", "پورا نام", "الاسم", "الاسم الكامل"] },
  ];

  const typeFromInputType = (el) =>
    ({ email: "email", password: "password", tel: "phone", url: "url" })[el.type] ?? null;

  function typeFromAutocomplete(el) {
    const tokens = (el.getAttribute("autocomplete") || "").toLowerCase().split(/\s+/);
    const rule = RULES.find((r) => r.autocomplete.some((a) => tokens.includes(a)));
    return rule ? rule.type : null;
  }

  function typeFromText(el) {
    const haystack = [
      el.name, el.id, el.placeholder, el.getAttribute("aria-label"),
      el.title, dom.labelText(el),
    ].filter(Boolean).join(" ");
    const rule = RULES.find((r) => r.words.some((w) => text.containsWord(haystack, w)));
    return rule ? rule.type : null;
  }

  function fallbackType(el) {
    if (el.tagName === "TEXTAREA") return "message";
    if (el.type === "number") return "number";
    return null;
  }

  /** Returns a field type such as "phone" or "nationalId", or null if unknown. */
  function type(el) {
    if (el.type === "date") {
      return typeFromText(el) === "birthDate" ? "birthDate" : "date";
    }
    return (
      typeFromInputType(el) ??
      typeFromAutocomplete(el) ??
      typeFromText(el) ??
      fallbackType(el)
    );
  }

  TF.detect = { type };
})();

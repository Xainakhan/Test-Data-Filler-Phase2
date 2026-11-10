# Test Data Filler

Chrome extension (Manifest V3, plain JavaScript, no build step) that fills web forms with
realistic **test** data: names, phones, national IDs, addresses, company, email, dates.

Full data packs: Pakistan, UAE, Saudi Arabia, India, United States, United Kingdom.
Every other country gets a generic pack (correct name and calling code, neutral data).

## Install

1. Open `chrome://extensions`, turn on **Developer mode**.
2. **Load unpacked** and pick this folder.
3. Pin the extension, open a form, click **Fill form** (or press `Alt+Shift+F`,
   or right-click a field > **Fill this field**).

## Country selection (Settings page)

- **Auto-detect** (default): from a country field that already has a value, then a `+971`-style
  phone placeholder / dial-code select, then the site's domain (`.pk`, `.ae`, `.sa`, `.in`, `.us`, `.uk`).
  If nothing is found, the **fallback country** is used.
- Or pick one country, or **Random**.

## How it is organised

```
background.js           context menu + shortcut
popup/, options/        UI
shared/injector.js      the one list of content files, in load order
shared/packs.js         which countries have a full pack
content/core/           namespace, random, text, settings, DOM helpers
content/generic/        country-independent parts: phone formats, names, checksums,
                        pack builder, email/username/password, dates
content/countries/      one folder per country (pack.js) + dial codes + fallback + registry
content/detect.js       element -> field type (never generates data)
content/region.js       chooses the country pack for a fill
content/values.js       field type -> candidate values from the person
content/constraints.js  picks the candidate that fits maxlength / pattern / placeholder
content/fill.js         writes values (never decides what a field is)
```

## Add a country

1. Copy `content/countries/gb/pack.js` to `content/countries/<code>/pack.js` and edit the data
   (names, phone generator, national ID generator, cities, company names).
2. Add `{ code, name }` to `shared/packs.js`.

That is all: injection, settings dropdown and auto-detection pick it up.

## Notes

- Generated IDs (CNIC, Emirates ID, Iqama, Aadhaar, SSN, NINO) are format-valid, not real.
- US phone numbers use the reserved 555-01XX range, UK mobiles the Ofcom drama range 07700 900xxx.
- No network requests; everything is generated locally.
- Use on test / staging systems only.

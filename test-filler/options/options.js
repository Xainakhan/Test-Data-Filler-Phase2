import { PACKS } from "../shared/packs.js";

const { settings } = TF;

const FIELDS = ["country", "fallbackCountry", "script", "overwrite", "highlight"];
const el = Object.fromEntries(FIELDS.map((id) => [id, document.getElementById(id)]));
const statusEl = document.getElementById("status");

const option = (value, label) => new Option(label, value);

function fillCountryLists() {
  el.country.append(
    option("auto", "Auto-detect from the page"),
    option("random", "Random"),
    ...PACKS.map(({ code, name }) => option(code, name))
  );
  el.fallbackCountry.append(...PACKS.map(({ code, name }) => option(code, name)));
}

function readForm() {
  return {
    country: el.country.value,
    fallbackCountry: el.fallbackCountry.value,
    script: el.script.value,
    overwrite: el.overwrite.checked,
    highlight: el.highlight.checked,
  };
}

function writeForm(values) {
  el.country.value = values.country;
  el.fallbackCountry.value = values.fallbackCountry;
  el.script.value = values.script;
  el.overwrite.checked = values.overwrite;
  el.highlight.checked = values.highlight;
}

async function onChange() {
  await settings.save(readForm());
  statusEl.textContent = "Saved.";
  setTimeout(() => (statusEl.textContent = ""), 1200);
}

async function init() {
  fillCountryLists();
  writeForm(await settings.load());
  FIELDS.forEach((id) => el[id].addEventListener("change", onChange));
}

init();

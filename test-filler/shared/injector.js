import { PACKS } from "./packs.js";

// Single place that knows which content files exist and in what order.
// Used by the popup, the context menu and the keyboard shortcut.
export const CONTENT_FILES = [
  "content/core/namespace.js",
  "content/core/random.js",
  "content/core/text.js",
  "content/core/settings.js",
  "content/core/dom.js",

  "content/generic/pair.js",
  "content/generic/checksums.js",
  "content/generic/phone.js",
  "content/generic/names.js",
  "content/generic/account.js",
  "content/generic/dates.js",
  "content/generic/pack.js",

  "content/countries/data/dial-codes.js",
  "content/countries/data/arabic-names.js",
  ...PACKS.map(({ code }) => `content/countries/${code}/pack.js`),
  "content/countries/fallback.js",
  "content/countries/registry.js",

  "content/detect.js",
  "content/region.js",
  "content/person.js",
  "content/constraints.js",
  "content/values.js",
  "content/fill.js",
  "content/content.js",
];

/**
 * @param {number} tabId
 * @param {"form" | "field"} mode  "form" = whole page, "field" = focused field
 * @param {number} [frameId]       limit to one frame (used by "fill this field")
 */
export async function fillTab(tabId, mode = "form", frameId) {
  const target =
    frameId === undefined
      ? { tabId, allFrames: true }
      : { tabId, frameIds: [frameId] };

  await chrome.scripting.executeScript({ target, files: CONTENT_FILES });
  await chrome.scripting.executeScript({
    target,
    func: (m) => window.TF && window.TF.run(m),
    args: [mode],
  });
}

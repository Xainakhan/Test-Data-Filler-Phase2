import { fillTab } from "./shared/injector.js";

const MENU = { FIELD: "tf-fill-field", FORM: "tf-fill-form" };

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU.FIELD,
    title: "Fill this field",
    contexts: ["editable"],
  });
  chrome.contextMenus.create({
    id: MENU.FORM,
    title: "Fill whole form",
    contexts: ["page", "editable"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  try {
    if (info.menuItemId === MENU.FIELD) await fillTab(tab.id, "field", info.frameId);
    if (info.menuItemId === MENU.FORM) await fillTab(tab.id, "form");
  } catch (error) {
    console.warn("PK Test Filler:", error.message);
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "fill-form") return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  try {
    await fillTab(tab.id, "form");
  } catch (error) {
    console.warn("PK Test Filler:", error.message);
  }
});

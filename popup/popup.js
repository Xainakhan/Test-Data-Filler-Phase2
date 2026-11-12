import { fillTab } from "../shared/injector.js";

const statusEl = document.getElementById("status");

async function onFill() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    await fillTab(tab.id, "form");
    statusEl.textContent = "Done.";
  } catch (error) {
    statusEl.textContent = "Can't fill this page.";
    console.warn("PK Test Filler:", error.message);
  }
}

document.getElementById("fill").addEventListener("click", onFill);
document
  .getElementById("settings")
  .addEventListener("click", () => chrome.runtime.openOptionsPage());

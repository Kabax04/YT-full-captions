const DEFAULTS = { enabled: true, linesPerCaption: 1 };
const enabledEl = document.getElementById("enabled");
const linesEl = document.getElementById("linesPerCaption");

browser.storage.local.get(DEFAULTS).then((s) => {
  enabledEl.checked = s.enabled;
  linesEl.value = String(s.linesPerCaption);
});

enabledEl.addEventListener("change", () => {
  browser.storage.local.set({ enabled: enabledEl.checked });
});

linesEl.addEventListener("change", () => {
  browser.storage.local.set({ linesPerCaption: Number(linesEl.value) });
});

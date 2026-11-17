/* global ytfcTransform */

const DEFAULTS = { enabled: true, linesPerCaption: 1 };
let settings = { ...DEFAULTS };

browser.storage.local.get(DEFAULTS).then((s) => {
  settings = { ...DEFAULTS, ...s };
});

browser.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  for (const [key, { newValue }] of Object.entries(changes)) {
    settings[key] = newValue;
  }
});

function isAutoCaptionJson(url) {
  let u;
  try {
    u = new URL(url);
  } catch (e) {
    return false;
  }
  const p = u.searchParams;
  return p.get("kind") === "asr" && (p.get("fmt") || "") === "json3";
}

function onTimedText(details) {
  if (!settings.enabled || !isAutoCaptionJson(details.url)) return {};

  const filter = browser.webRequest.filterResponseData(details.requestId);
  const chunks = [];

  filter.ondata = (event) => chunks.push(new Uint8Array(event.data));

  filter.onstop = () => {
    let total = 0;
    for (const c of chunks) total += c.length;
    const raw = new Uint8Array(total);
    let offset = 0;
    for (const c of chunks) {
      raw.set(c, offset);
      offset += c.length;
    }

    let output = raw;
    try {
      const data = JSON.parse(new TextDecoder("utf-8").decode(raw));
      const result = ytfcTransform(data, settings.linesPerCaption);
      if (result) output = new TextEncoder().encode(JSON.stringify(result));
    } catch (e) {
      console.warn("[YouTube Full Captions] could not transform captions:", e);
    }

    filter.write(output);
    filter.close();
  };

  filter.onerror = () => {
    console.warn("[YouTube Full Captions] filter error:", filter.error);
  };

  return {};
}

browser.webRequest.onBeforeRequest.addListener(
  onTimedText,
  {
    urls: [
      "*://*.youtube.com/api/timedtext*",
      "*://*.youtube-nocookie.com/api/timedtext*",
    ],
  },
  ["blocking"]
);

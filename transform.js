/*
 * Converts YouTube auto-generated (ASR) captions in json3 format from
 * word-by-word "roll-up" captions into ordinary "pop-on" captions where
 * the whole line appears at once.
 *
 * ASR json3 looks roughly like this:
 *   { "id": 1, "wpWinPosId": 1, "wsWinStyleId": 1, ... }          <- window definition
 *   { "tStartMs": 160, "dDurationMs": 4400, "wWinId": 1,
 *     "segs": [ { "utf8": "so" }, { "utf8": " today", "tOffsetMs": 400 }, ... ] }
 *   { "tStartMs": 2950, "wWinId": 1, "aAppend": 1, "segs": [ { "utf8": "\n" } ] }
 *   ...
 *
 * Each word has its own tOffsetMs, which makes the player reveal it word by
 * word. We merge every line into a single segment without offsets and drop
 * the roll-up window, so the player renders it like normal subtitles.
 */

function ytfcCollectLines(data) {
  const lines = [];
  for (const ev of data.events || []) {
    if (!ev.segs || ev.aAppend) continue;
    const text = ev.segs
      .map((s) => s.utf8 || "")
      .join("")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) continue;
    const start = ev.tStartMs || 0;
    lines.push({ start, end: start + (ev.dDurationMs || 0), text });
  }
  lines.sort((a, b) => a.start - b.start);

  // In roll-up mode a line stays on screen while the next one is spoken.
  // Cut each line off when the next line begins.
  for (let i = 0; i < lines.length - 1; i++) {
    const next = lines[i + 1];
    if (next.start < lines[i].end) lines[i].end = next.start;
  }
  return lines.filter((l) => l.end > l.start);
}

function ytfcTransform(data, linesPerCaption) {
  const n = Math.max(1, Math.min(3, linesPerCaption | 0 || 1));
  const lines = ytfcCollectLines(data);
  if (!lines.length) return null;

  const events = [];
  for (let i = 0; i < lines.length; i += n) {
    const group = lines.slice(i, i + n);
    const start = group[0].start;
    const end = group[group.length - 1].end;
    events.push({
      tStartMs: start,
      dDurationMs: end - start,
      segs: [{ utf8: group.map((l) => l.text).join("\n") }],
    });
  }

  const out = { wireMagic: data.wireMagic || "pb3", events };
  if (data.pens) out.pens = data.pens;
  return out;
}

if (typeof module !== "undefined") {
  module.exports = { ytfcTransform, ytfcCollectLines };
}

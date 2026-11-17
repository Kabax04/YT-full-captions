# YT Full Captions

A Firefox extension that shows YouTube's **auto-generated captions line by line**, the way regular subtitles appear, instead of one word at a time.

## How it works

YouTube loads auto-generated captions from `/api/timedtext?kind=asr&fmt=json3`. In that format every word has its own timestamp (`tOffsetMs`) and the text sits in a "roll-up" window, which is why the player reveals the words one by one.

The extension uses `webRequest.filterResponseData` to rewrite the response before the player gets it:

- all the words in a line are merged into a single segment with no per-word offsets
- the roll-up window is removed, so the text is shown as regular "pop-on" captions
- each line stays on screen from when it starts until the next line begins
- you can choose 1, 2 or 3 lines per caption in the popup

Manually created captions are left unchanged.

## Installation

### Temporary (for testing)

1. Open `about:debugging#/runtime/this-firefox` in Firefox
2. Click **Load Temporary Add-on…**
3. Select `manifest.json` in this folder

The add-on is removed when Firefox closes.

### Permanent

Zip the folder and sign it through [addons.mozilla.org](https://addons.mozilla.org/developers/) (you can choose "unlisted"), or use Firefox Developer Edition / Nightly with `xpinstall.signatures.required` set to `false`.

## Usage

Turn on captions on a video with auto-generated captions. Click the toolbar icon to turn the extension on or off or change the number of lines. Changes apply the next time captions load: toggle captions off and on with `C`, or reload the page.

# YouTube Full Captions

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

### Install the signed release (recommended)

1. Go to the [latest release](https://github.com/Kabax04/YT-full-captions/releases/latest)
2. Download the `.xpi` file (signed by Mozilla)
3. Open it in Firefox, or drag it into a Firefox window, and click **Add**

The add-on stays installed across restarts.

### Load from source (for development)

1. Clone or download this repository
2. Open `about:debugging#/runtime/this-firefox` in Firefox
3. Click **Load Temporary Add-on…**
4. Select `manifest.json` in this folder

The add-on is removed when Firefox closes.

### Releasing a new version

Bump `"version"` in `manifest.json`, zip the folder (for example `git archive --format=zip -o youtube-full-captions.zip HEAD`) and submit it as a new version on [addons.mozilla.org](https://addons.mozilla.org/developers/) ("On your own" distribution). Attach the signed `.xpi` to a new GitHub release.

## Usage

Turn on captions on a video with auto-generated captions. Click the toolbar icon to turn the extension on or off or change the number of lines. Changes apply the next time captions load: toggle captions off and on with `C`, or reload the page.

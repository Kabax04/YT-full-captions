# YT Full Captions

Firefox-utvidelse som viser YouTubes **autogenererte undertekster linje for linje**, slik vanlige undertekster vises, i stedet for ett og ett ord.

## Hvordan det virker

YouTube henter autogenererte undertekster fra `/api/timedtext?kind=asr&fmt=json3`. I det formatet har hvert ord sin egen tidsstempel (`tOffsetMs`), og teksten ligger i et «roll-up»-vindu. Det er derfor spilleren viser ordene ett etter ett.

Utvidelsen bruker `webRequest.filterResponseData` til å skrive om svaret før spilleren får det:

- alle ordene i en linje slås sammen til ett segment uten tidsforskyvning
- roll-up-vinduet fjernes, så teksten vises som vanlige «pop-on»-undertekster
- hver linje vises fra den starter til neste linje begynner
- du kan velge 1, 2 eller 3 linjer per tekst i popup-menyen

Manuelle undertekster blir ikke endret.

## Installasjon

### Midlertidig (for testing)

1. Åpne `about:debugging#/runtime/this-firefox` i Firefox
2. Klikk **Last inn midlertidig tillegg…**
3. Velg `manifest.json` i denne mappen

Tillegget blir borte når Firefox lukkes.

### Permanent

Pakk mappen som zip og signer den gjennom [addons.mozilla.org](https://addons.mozilla.org/developers/) (kan velges som «unlisted»), eller bruk Firefox Developer Edition / Nightly med `xpinstall.signatures.required` satt til `false`.

## Bruk

Slå på tekstingen på en video med autogenererte undertekster. Klikk på ikonet i verktøylinjen for å slå utvidelsen av/på eller endre antall linjer. Endringer gjelder neste gang tekstingen lastes: slå tekstingen av og på med `C`, eller last siden på nytt.

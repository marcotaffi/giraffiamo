# data/photoeditors — i generatori di immagini

Un file YAML per configurazione di generazione immagini. Caricati da
`PhotoEditorsManager` (taffitools) quando uno step di tipo `photoeditor`
(`data/steps/`) li referenzia col campo `photoEditor:`.

## Campi

| campo             | obbl. | descrizione                                                     |
|-------------------|-------|-----------------------------------------------------------------|
| `name`            | sì    | nome della configurazione; per convenzione uguale al nome del file |
| `model`           | sì    | modello: `gpt-image-1` \| `gpt-image-1-mini` \| `gpt-image-1.5` \| `gpt-image-2` \| `chatgpt-image-latest` |
| `description`     | no    | descrizione per gli umani                                       |
| `size`            | no    | `1024x1024` \| `1536x1024` \| `1024x1536` \| `auto`             |
| `quality`         | no    | `low` \| `medium` \| `high` \| `auto` (attenzione: high costa ~4x medium) |
| `useReferences`   | no    | se `true`, le immagini DINAMICHE dell'input (foto inviate in chat, immagini degli articoli) vengono passate come riferimenti via images.edit |
| `referenceImages` | no    | riferimenti STATICI di stile, sempre usati quando dichiarati: percorsi relativi a `data/` (di norma `referenceimages/...`) oppure URL http(s) |

Limite: massimo 16 immagini totali per generazione (statiche + dinamiche).

## Esempio

```yaml
name: cover_giraffiamo
description: "Cover orizzontali per gli articoli, nello stile giraffiamo"
model: gpt-image-1-mini
size: 1536x1024
quality: medium
useReferences: false
referenceImages:
  - referenceimages/stile-giraffiamo-1.png
```

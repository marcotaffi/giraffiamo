# data/services — servizi e canali di pubblicazione

Un file YAML per servizio. Caricati da `ServiceConfigManager` (taffitools) e
creati con `ServiceFactory.create("firma")` nel main del bot, oppure messi a
disposizione dell'AI come tool (elencandoli in `toolNames` dell'agente).

La **firma** identifica il servizio e per convenzione è composta da
`servizio_destinazione` (es. `ghost_giraffiamo`): se i campi `servizio`,
`destinazione`, `azione` non sono indicati vengono ricavati dalla firma.

## Campi

| campo             | obbl. | descrizione                                                     |
|-------------------|-------|-----------------------------------------------------------------|
| `firma`           | sì    | firma del servizio; per convenzione uguale al nome del file     |
| `servizio`        | sì    | tipo di servizio (es. `ghost`, `wordpress`, `mail`, `proceduratool`…) |
| `destinazione`    | no    | destinazione (es. il nome del sito): usata per costruire le firme chiamabili dall'AI |
| `azione`          | no    | eventuale azione specifica                                      |
| `cosafa`          | no    | descrizione (usata per i servizi di tipo procedura, la legge l'AI) |
| `procedura`       | no    | procedura di `data/procedure/` che genera i contenuti eseguiti dalla `run` (dal bot o dal canale) |
| `classificazione` | no    | se il servizio è un canale automatico: gli interessi (vedi sotto) |
| `opzioni`         | no    | oggetto libero con le impostazioni del servizio specifico       |

### opzioni (dipendono dal tipo di servizio; esempio Ghost)

- `sito`: url del sito di destinazione
- `basic_auth`: **nome della variabile in .env** con le credenziali (mai la credenziale in chiaro)
- `status`: es. `draft` / `published`
- `postTypes`: tipi di contenuto ammessi
- `categoryMapping`: mappa categoria → id sul sito (`"*"` come default)

### classificazione (canale automatico collegato al taffiserver)

```yaml
classificazione:
  includi:
    - categories: ["cnv"]        # o hooks: [...]
      type: "feeds"              # feeds | tags | news | urls
      flusso: "RaggruppaSimili"  # RaggruppaSimili | Instant
```

## Esempio completo

```yaml
firma: "ghost_giraffiamo"
servizio: "ghost"
destinazione: "giraffiamo"
procedura: "ripubblica"
opzioni:
  sito: "https://giraffiamo.ghost.io"
  basic_auth: "GIRAFFIAMO_GHOST"
  status: "draft"
  categoryMapping:
    "*": "1"
classificazione:
  includi:
    - categories: ["cnv"]
      type: "feeds"
      flusso: "RaggruppaSimili"
```

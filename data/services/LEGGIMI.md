# data/services — servizi e canali di pubblicazione

Un file YAML per servizio. Caricati da `ServiceConfigManager` (taffitools) e
creati con `ServiceFactory.create("firma")` nel main del bot, oppure messi a
disposizione dell'AI come tool (elencandoli in `toolNames` dell'agente).

L'**id** del servizio è il **nome del file** (senza `.yml`): è unico e identifica il servizio nel
registro del bot. Si usa nei `toolNames` degli agenti e, con `ServiceFactory.create("id")`, nel main
del bot. I file con `_` davanti sono bozze e vengono ignorati.

Il main del bot non crea più i servizi a mano: chiama `await bot.aggiungiServiziDaFile(credenziali)` e
vengono caricati tutti i file con `registraNelBot: true` (non spenti con `attivaServizio: false`, non
con `_` davanti). Se uno non parte il bot non parte e l'errore li elenca tutti. Negli step (`firma:`) e
nelle opzioni dei servizi che chiamano altri servizi (es. `pubblicazione` di bozze) si scrive l'id del
servizio, o `id_azione`: `ripubblica_giraffiamo_invia`, `sendmail_marco`. Il formato storico
`servizio_destinazione_azione` funziona ancora ma nel log compare un avviso.

Nei `toolNames` di un agente ogni voce è un id (tutte le azioni del servizio esposte all'AI) oppure
`id_azione` (una sola azione di quel servizio). I servizi standard della libreria
(`taffitools/data/services`: `gestoredate_now_readClock`, `scraper_url_download`,
`segnalaerrore_run_segnala`, `websearch_italia_low`) si elencano senza avere un file nel bot; un file
del bot con lo stesso nome li sovrascrive. Creare un servizio senza file (ricavandolo dalla firma
`servizio_destinazione_azione`) funziona ancora ma è deprecato e nel log compare un avviso.

## Campi

| campo             | obbl. | descrizione                                                     |
|-------------------|-------|-----------------------------------------------------------------|
| `firma`           | sì    | firma del servizio (formato storico `servizio_destinazione_azione`); per convenzione uguale al nome del file. L'identità resta il nome del file |
| `servizio`        | sì    | tipo di servizio (es. `ghost`, `wordpress`, `mail`, `proceduratool`…) |
| `destinazione`    | no    | destinazione (es. il nome del sito): usata per costruire le firme chiamabili dall'AI |
| `azione`          | no    | eventuale azione specifica                                      |
| `attivaServizio`  | no    | `false` = servizio spento: non viene creato (default `true`)     |
| `registraNelBot`  | no    | `true` = il bot lo carica da solo all'avvio (`bot.aggiungiServiziDaFile`): lo crea, lo avvia e lo aggiunge al suo registro, come canale (se la classe è un canale: riceve i feed) o come servizio semplice richiamabile dagli step `servizio` delle procedure. Default `false`: un servizio che serve solo agli agenti non va istanziato anche nel bot. **Quali agenti possono usare un servizio lo decidono sempre i `toolNames` dei loro file** |
| `azioni`          | no    | esposizione all'AI azione per azione: `azioni: { post: { esponiAllAI: false } }`. `esponiAllAI: false` = l'azione non è un tool per il modello ma resta chiamabile da procedure (step `servizio`) e dal codice. Se manca vale il default della classe |
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

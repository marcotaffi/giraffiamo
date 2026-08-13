# data/azioniesterne — azioni eseguibili da chiamate esterne

Un file YAML per azione permessa. Caricati da `AzioniEsterneManager` (taffitools)
e usati da `BotIooo.eseguiAzioneEsterna` per decidere se una richiesta arrivata
dal webserver (endpoint pubblico `POST /azioni/esegui`, vedi `webserver/src/webserver.ts`)
può davvero essere eseguita — es. un form pubblico che imposta le label di un
membro Ghost.

**Il chiamante nomina solo l'azione**, cioè la `firma` qui sotto:

```json
{ "bot": "bot-giraffiamo", "azione": "ghost_giraffiamo_modificamembro", "parametri": { ... }, "segreto": "..." }
```

Che dietro ci sia un singolo metodo di canale o un'intera procedura lo decide
questo file, e può cambiare senza toccare chi chiama (il form vive su un sito,
non in questo repo, e si aggiorna con un deploy separato).

Qualunque azione **non** dichiarata qui è vietata per default: l'assenza di un
file equivale a "non permesso", non a "permesso senza restrizioni". Il controllo
qui è quello **autorevole**: un controllo più a monte sull'endpoint HTTP (secret
condiviso, origin, rate limit) è solo un filtro aggiuntivo, non lo sostituisce.

## Campi

| campo       | obbl. | descrizione                                                                  |
|-------------|-------|------------------------------------------------------------------------------|
| `firma`     | sì    | nome dell'azione, **è la chiave con cui viene invocata**; per convenzione uguale al nome del file |
| `bot`       | sì    | **botId** del bot che la esegue (es. `bot-giraffiamo`, non `giraffiamo`)      |
| `procedura` | \*    | procedura di `data/procedure/` da eseguire (es. `iscrizione_preferenze`)      |
| `canale`    | \*    | firma del canale, la stessa di `data/services/*.yml` (es. `ghost_giraffiamo`) |
| `metodo`    | \*    | metodo da chiamare sul canale (es. `modificaMembro`)                          |
| `modo`      | no    | `sincrono` (default) oppure `asincrono` — vedi sotto                          |
| `segreto`   | no    | **nome della variabile in .env** con il segreto richiesto (mai il segreto in chiaro) |
| `parametri` | sì    | parametri ammessi, per nome (vedi sotto)                                      |

\* **o** `procedura`, **o** `canale`+`metodo`: sono alternativi, uno dei due è
obbligatorio. Un file che li dichiara entrambi (o nessuno) viene scartato al
caricamento con un errore nei log, non al primo chiamante che ci finisce contro.

Quale scegliere: `canale`+`metodo` per un'azione che è e resterà una singola
chiamata; `procedura` appena servono più passi, o anche subito, se è probabile
che ne servano (convertire dopo è facile, ma la procedura è il posto naturale
dove aggiungere il secondo passo).

### `modo`: quanto può durare

- `sincrono` (default): la richiesta HTTP resta aperta e riceve l'esito. Adatto
  a ciò che sta comodamente nei **15 secondi** del relay.
- `asincrono`: il bot conferma subito la presa in carico, il chiamante riceve
  `202 {requestId, stato:"in_corso"}` e ritira l'esito con
  `GET /azioni/esito?id=<requestId>`. **Obbligatorio** per le procedure che
  chiamano l'AI, mandano mail o toccano più canali: in `sincrono` andrebbero in
  timeout mentre il lavoro prosegue, e la persona vedrebbe fallire un'azione
  riuscita.

Due dettagli dell'asincrono: la validazione (segreto, parametri) resta immediata
e sincrona — un errore lì torna subito, non diventa un esito da ritirare — e un
secondo invio identico mentre il primo è ancora in corso viene rifiutato.

### parametri

Ogni voce descrive un parametro ammesso:

```yaml
parametri:
  <nomeParametro>:
    tipo: string | number | boolean | array   # obbligatorio
    obbligatorio: true | false                 # default: false
    valoriAmmessi: [...]                       # opzionale: whitelist. Per "array" si applica a ogni elemento
```

Un parametro **non elencato qui viene sempre rifiutato**, anche se il metodo o la
procedura lo accetterebbero. Un valore fuori da `valoriAmmessi` (se presente)
viene rifiutato. I parametri validati arrivano alla procedura come dati
strutturati, che gli step leggono (vedi `Ghost.aggiornaMembro`).

## Esempio con procedura

```yaml
firma: ghost_giraffiamo_modificamembro
bot: bot-giraffiamo
procedura: iscrizione_preferenze
modo: sincrono
segreto: GHOST_GIRAFFIAMO_MODIFICAMEMBRO_SEGRETO
parametri:
  email:
    tipo: string
    obbligatorio: true
  labels:
    tipo: array
    obbligatorio: true
    valoriAmmessi: ["Regione Lombardia", "Firenze", "Provenienza: Passaparola"]
```

## Esempio con metodo diretto

```yaml
firma: ghost_giraffiamo_modificamembro
bot: bot-giraffiamo
canale: ghost_giraffiamo
metodo: modificaMembro
parametri:
  email:
    tipo: string
    obbligatorio: true
```

## Forma vecchia del payload (in via di dismissione)

Un chiamante non ancora aggiornato può ancora mandare `{canale, metodo}` invece
di `{azione}`: viene risolto sul permesso la cui `firma` corrisponde a
`<canale>_<metodo>`, e nei log compare un avviso di deprecazione. Funziona anche
per le azioni già convertite a procedura, proprio perché la corrispondenza è sul
nome e non sui campi. Da togliere quando il form manda `azione`.

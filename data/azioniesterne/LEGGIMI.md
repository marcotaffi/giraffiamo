# data/azioniesterne — azioni eseguibili da chiamate esterne

Un file YAML per azione permessa. Caricati da `AzioniEsterneManager` (taffitools)
e usati da `BotIooo.eseguiAzioneEsterna` per decidere se una richiesta arrivata
dal webserver (endpoint pubblico `POST /azioni/esegui`, vedi `webserver/src/webserver.ts`)
può davvero chiamare un metodo di un canale — es. un form pubblico che imposta
le label di un membro Ghost.

Qualunque combinazione bot+canale+metodo **non** dichiarata qui è vietata per
default: l'assenza di un file equivale a "non permesso", non a "permesso senza
restrizioni". Il controllo qui è quello **autorevole**: un controllo più a monte
sull'endpoint HTTP (secret condiviso, origin, rate limit) è solo un filtro
aggiuntivo più grezzo, non lo sostituisce.

## Campi

| campo      | obbl. | descrizione                                                                 |
|------------|-------|------------------------------------------------------------------------------|
| `firma`    | sì    | nome dell'azione; per convenzione uguale al nome del file                    |
| `bot`      | sì    | **botId** del bot che deve possedere il canale (es. `bot-giraffiamo`, non `giraffiamo`) |
| `canale`   | sì    | firma del canale, la stessa di `data/services/*.yml` (es. `ghost_giraffiamo`) |
| `metodo`   | sì    | nome del metodo da chiamare sul canale (es. `modificaMembro`)                |
| `segreto`  | no    | **nome della variabile in .env** con il segreto richiesto (mai il segreto in chiaro) |
| `parametri`| sì    | parametri ammessi per il metodo, per nome (vedi sotto)                       |

### parametri

Ogni voce descrive un parametro ammesso:

```yaml
parametri:
  <nomeParametro>:
    tipo: string | number | boolean | array   # obbligatorio
    obbligatorio: true | false                 # default: false
    valoriAmmessi: [...]                       # opzionale: whitelist. Per "array" si applica a ogni elemento
```

Un parametro **non elencato qui viene sempre rifiutato**, anche se il metodo lo
accetterebbe. Un valore fuori da `valoriAmmessi` (se presente) viene rifiutato.

## Esempio completo

```yaml
firma: ghost_giraffiamo_modificamembro
bot: bot-giraffiamo
canale: ghost_giraffiamo
metodo: modificaMembro
segreto: GHOST_GIRAFFIAMO_MODIFICAMEMBRO_SEGRETO
parametri:
  email:
    tipo: string
    obbligatorio: true
  labels:
    tipo: array
    obbligatorio: true
    valoriAmmessi: ["Regione Lombardia", "Regione Veneto", "Firenze", "Provenienza: Passaparola", "Applicazione: A scuola"]
```

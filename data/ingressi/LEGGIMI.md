# data/ingressi — procedure che partono da sole

Un file YAML per ingresso: collega una **sorgente** (da cui nascono elementi) a una **procedura** di
`data/procedure`, con una cadenza. L'**id** è il **nome del file** (senza `.yml`). I file con `_`
davanti sono bozze e vengono ignorati.

**Spento di default.** Il gestore parte solo se nel `.env` del bot c'è `INGRESSI=on`; senza, questa
cartella non viene nemmeno letta. Se un file non è valido il bot non parte e l'errore li elenca tutti.
Descrizione completa, garanzie e limiti: `taffitools/docs/ingressi.md`.

## Campi

```yaml
sorgente: orologio              # "orologio", o una sorgente registrata (dalla fase F3: azioni dei servizi)
quando: "0 9 1 * *"             # cron a 5 campi: qui, il primo del mese alle 9
fuso: Europe/Rome               # opzionale, default Europe/Rome
recuperaEntro: 3d               # opzionale: se il bot era spento alla scadenza, la recupera entro
                                # questo tempo (30s, 15m, 3h, 2d), una volta sola. Default: non recupera
procedura: promemoria_preferenze
modo: perElemento               # perElemento (default) | tutti (una sola esecuzione con la lista)
consegna: almenoUnaVolta        # almenoUnaVolta (default) | unaVolta — vedi sotto
timeout: 900                    # secondi, opzionale
parametri: {}                   # passati alla sorgente e, per l'orologio, ai dati del tick
suErrore: sendmail_marco        # opzionale: servizio da avvisare se fallisce (default: quello del main)
attivaIngresso: true            # false = spento senza cancellare il file
```

`consegna: unaVolta` — l'elemento è segnato come servito PRIMA di eseguirlo: mai due volte, neanche
con un crash a metà; se fallisce finisce in dead-letter. Per ciò che non si deve ripetere (mail).
`consegna: almenoUnaVolta` — lo si segna DOPO l'esito ok: se fallisce lo si rilegge alla scadenza
successiva (e gli altri, già serviti, si saltano). Per ciò che si può ripetere senza danni.

## Prova su dev (kit pronto)

`_prova.yml` + `data/procedure/_prova_ingressi.yml` (il `_` la tiene fuori dai comandi Telegram, che
elencano tutte le procedure): ogni 3 minuti una mail di prova a Marco, con i passi
di notifica che il flusso automatico già usa (nessuna AI, nessuna scrittura su Ghost).

1. Rinomina `_prova.yml` in `prova.yml`, metti `INGRESSI=on` nel `.env` di giraffiamo, riavvia.
2. Nel log (`/srv/log/giraffiamo.log`, troncato a ogni riavvio) cerca `Gestore degli ingressi avviato`,
   poi a ogni scadenza `[prova@...] Ingresso: parto` e `Ingresso concluso: 1 letti, 1 eseguiti`. Arriva
   una mail con oggetto "Giraffiamo ha pubblicato: PROVA ingressi ... [TEST per marco@taffi.it]".
3. Riavvio a metà: spegni il bot dopo una scadenza e riaccendilo prima della successiva → nessuna mail in
   più. Spegnilo oltre una scadenza (entro 10 minuti) e riaccendilo → UNA sola mail di recupero.
4. A prova finita rimetti il `_` davanti a `prova.yml` (o cancellalo) e riavvia.

`_esempio.yml` mostra solo il formato. Un `INGRESSI=on` con file non validi ferma il bot all'avvio, con
l'elenco di tutti i file sbagliati: è voluto.

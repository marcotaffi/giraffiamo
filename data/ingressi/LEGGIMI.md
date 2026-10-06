# data/ingressi — procedure che partono da sole

Un file YAML per ingresso: collega una **sorgente** (da cui nascono elementi) a una **procedura** di
`data/procedure`, con una cadenza. L'**id** è il **nome del file** (senza `.yml`). I file con `_`
davanti sono bozze e vengono ignorati.

**Spento di default.** Il gestore parte solo se nel `.env` del bot c'è `INGRESSI=on`; senza, questa
cartella non viene nemmeno letta. Se un file non è valido il bot non parte e l'errore li elenca tutti.
Descrizione completa, garanzie e limiti: `taffitools/docs/ingressi.md`.

## Campi

```yaml
sorgente: orologio              # "orologio", o l'id_azione di un servizio del bot (es. ghost_giraffiamo_elencaMembri)
quando: "0 9 1 * *"             # cron a 5 campi: qui, il primo del mese alle 9
fuso: Europe/Rome               # opzionale, default Europe/Rome
recuperaEntro: 3d               # opzionale: se il bot era spento alla scadenza, la recupera entro
                                # questo tempo (30s, 15m, 3h, 2d), una volta sola. Default: non recupera
procedura: promemoria_preferenze
modo: perElemento               # perElemento (default) | tutti (una sola esecuzione con la lista)
consegna: almenoUnaVolta        # almenoUnaVolta (default) | unaVolta — vedi sotto
ripetiOgniScadenza: false       # true = la sorgente ripresenta gli STESSI elementi a ogni scadenza (es. i
                                # membri Ghost): i già serviti si azzerano a ogni scadenza
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

## Promemoria delle preferenze (F3, inerte)

`_promemoria_preferenze.yml` + `data/procedure/_promemoria_preferenze.yml` + i servizi `sendmail_generic` e
`componimessaggio_promemoriapreferenze`: il primo di ogni mese alle 9 una mail a ogni membro Ghost SENZA
label (che non ha compilato il form delle preferenze). Prima di accenderlo:

1. **Compila `linkPreferenze`** in `services/componimessaggio_promemoriapreferenze.yml` e riscrivi il testo
   (è una bozza). Finché il link è vuoto non parte nessuna mail: il servizio rifiuta di comporre un messaggio
   con un campo vuoto.
2. **Decidi `filtro: "subscribed:true"`** nei parametri: esclude chi si è disiscritto dalla newsletter su Ghost.
   Togli la riga se le mail di servizio devono arrivare a tutti.
3. Prova su dev: lì SendMail manda tutto a marco@taffi.it con oggetto "[TEST per ...]" e l'elenco è limitato a
   3 membri. Rinomina in `promemoria_preferenze.yml`, `INGRESSI=on`, riavvia, attendi la scadenza (per vederla
   subito cambia `quando` in `"*/3 * * * *"`).

La procedura ha il `_` davanti perché in giraffiamo ogni procedura di `data/procedure` diventa un comando
Telegram, e questa manda mail vere a molte persone.

`_esempio.yml` mostra solo il formato. Un `INGRESSI=on` con file non validi ferma il bot all'avvio, con
l'elenco di tutti i file sbagliati: è voluto.

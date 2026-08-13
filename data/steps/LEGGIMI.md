# data/steps — i passi delle procedure

Un file YAML per step. Caricati da `StepManager` (taffitools) quando una
procedura (`data/procedure/`) li elenca fra i suoi `tasks`.

## Campi

| campo         | obbl. | descrizione                                                        |
|---------------|-------|--------------------------------------------------------------------|
| `name`        | sì    | nome dello step; per convenzione uguale al nome del file           |
| `type`        | sì    | cosa fa lo step: `prompt` \| `servizio` \| `photoeditor` \| `script` |
| `description` | no    | descrizione per gli umani                                          |
| `prompt`      | per type `prompt` | nome del prompt da caricare da `data/prompts/`         |
| `agentName`   | per type `prompt` | agente di `data/agents/` che esegue la chiamata AI     |
| `firma`       | per type `servizio` | firma del servizio da chiamare (vedi `data/services/`) |
| `photoEditor` | per type `photoeditor` | nome della configurazione in `data/photoeditors/` |

## Esempio (step di tipo prompt)

```yaml
name: ripubblica
type: prompt
description: "Scrivi un rilancio dell'articolo"
prompt: ripubblica        # prompts/ripubblica.yml
agentName: ripubblica     # agents/ripubblica.yml
```

## Esempio (step di tipo photoeditor)

```yaml
name: genera_cover
type: photoeditor
photoEditor: cover_giraffiamo   # photoeditors/cover_giraffiamo.yml
```

## Esempio (step di tipo servizio)

Esegue un canale/servizio **vivo del bot** — quello già avviato con le sue
credenziali, non un'istanza nuova. È il modo per mettere in una procedura un
passo deterministico (scrivere su Ghost, mandare una mail) accanto agli step di
prompt.

```yaml
name: ghost_aggiorna_membro
type: servizio
firma: ghost_giraffiamo_aggiornaMembro   # servizio_destinazione_azione
```

La `firma` si legge come `servizio_destinazione_azione`: le prime due parti
identificano il canale (le stesse di `data/services/ghost_giraffiamo.yml`),
l'ultima è il metodo da chiamarci sopra.

Il metodo deve avere la forma `(contenuto: ContenutoGenerico) => ContenutoGenerico`:
prende i dati dal contenuto in ingresso e restituisce il risultato nello stesso
formato, così può stare in mezzo a una sequenza. Un metodo con parametri
tipizzati (es. `Ghost.modificaMembro`) non è chiamabile direttamente da uno step:
serve una variante conforme (es. `Ghost.aggiornaMembro`, che fa da traduttore).

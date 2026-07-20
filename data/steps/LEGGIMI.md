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

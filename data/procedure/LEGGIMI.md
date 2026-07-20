# data/procedure — le pipeline e i comandi del bot

Un file YAML per procedura. Caricate da `ProcedureManager` (taffitools).

Una procedura è una pipeline di task (di solito step di `data/steps/`)
eseguiti secondo il tipo scelto. Le procedure sono usate:

- **come comandi del bot**: ogni file attivo (senza `_` iniziale) viene
  registrato come comando (`/nomefile`) su Telegram e dichiarato al gateway
  della chat web, che lo mostra nel menu del widget. All'invocazione il bot
  carica il **prompt omonimo** da `data/prompts/`: per un comando funzionante
  servono entrambi i file;
- **dai servizi/canali** (`data/services/`), che nel campo `procedura:`
  indicano quale pipeline genera i contenuti da pubblicare.

## Campi

| campo         | obbl. | descrizione                                                        |
|---------------|-------|--------------------------------------------------------------------|
| `name`        | sì    | nome della procedura; per convenzione uguale al nome del file      |
| `type`        | sì    | come eseguire i task: `sequenziale` (uno dopo l'altro), `step` (singolo passo), `orchestratore` (decide l'AI), `macchinaastati` |
| `tasks`       | no    | elenco ordinato di task: ognuno con `name` (nome del file da caricare) e `type` (di norma `step`; può essere a sua volta una procedura) |
| `description` | no    | descrizione per gli umani                                          |
| `stateful`    | no    | se `true` la conversazione AI mantiene lo stato fra i task         |

## Esempio

```yaml
name: ripubblica
description: ripubblica eventi e notizie su giraffiamo.it facendone sintesi
type: sequenziale
tasks:
  - name: ripubblica          # steps/ripubblica.yml
    type: step
  - name: genera_titoli_ghost
    type: step
  - name: formatta_ghost
    type: step
```

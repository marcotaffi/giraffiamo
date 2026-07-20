# data/prompts — i testi dei prompt

Un file YAML per prompt. Caricati da `PromptManager` (taffitools). Sono usati
in due modi:

1. **dai comandi del bot**: quando l'utente invoca `/nomecomando` (registrato
   dai file di `data/procedure/`), il bot carica il prompt **omonimo** da qui
   e lo usa come testo del messaggio verso l'AI. Un comando senza il prompt
   con lo stesso nome fallisce;
2. **dagli step di tipo `prompt`** (`data/steps/`), che indicano nel campo
   `prompt:` il nome di un file di questa cartella.

## Campi

| campo         | obbl. | descrizione                                                       |
|---------------|-------|-------------------------------------------------------------------|
| `name`        | sì    | nome del prompt; per convenzione uguale al nome del file          |
| `prompt`      | sì    | il testo del prompt (usa `|` per il multilinea YAML)              |
| `description` | no    | descrizione per gli umani                                         |
| `type`        | no    | tipo di risposta attesa (es. `text`, `json_object`)               |
| `params`      | no    | parametri del modello che sovrascrivono quelli dell'agente per questa chiamata (`model`, `temperature`, …) |

## Esempio

```yaml
name: ripubblica
prompt: |
  Agisci come caporedattore per scrivere il testo di un rilancio
  dell'evento o della notizia data...
```

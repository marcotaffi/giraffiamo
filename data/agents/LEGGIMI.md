# data/agents — gli agenti AI

Un file YAML per agente. Il nome dell'agente passato a `new BotIooo(aiManager, "nome")`
o richiesto da uno step (`agentName:`) deve corrispondere a un file qui.
Caricati da `AgentsManager` (taffitools).

## Campi

| campo              | obbl. | descrizione                                                              |
|--------------------|-------|--------------------------------------------------------------------------|
| `agentName`        | sì    | nome dell'agente; per convenzione uguale al nome del file                |
| `apiClient`        | sì    | `clientName` di un file in `data/apiclients/`                            |
| `agentDescription` | no    | descrizione per gli umani                                                |
| `params`           | no    | parametri di default del modello (sovrascrivibili dai singoli prompt): `model`, `type` (es. `text`), `temperature`, `top_p`, `max_output_tokens`… |
| `instructions`     | no    | elenco di **snippet** (nomi di file .md in `data/snippets/`, senza estensione) concatenati come istruzioni di sistema |
| `toolNames`        | no    | elenco dei tool/servizi che l'AI può chiamare (firme dei servizi, es. `gestoredate_now_readClock`, `websearch_italia_low`, `ghost_giraffiamo`) |
| `vectoreStores`    | no    | id dei vector store di cui l'agente vede i file                          |
| `assistant_id`     | no    | id assistente/prompt del provider, se si usa un assistente remoto        |

## Esempio

```yaml
agentName: giraffiamo
agentDescription: "Avatar telegram di Giraffiamo"
apiClient: gpt-response-dev
params:
  model: gpt-4o-mini
  type: text
  temperature: 0.70
  max_output_tokens: 6000
instructions:
  - giraffiamoinstructions
toolNames:
  - gestoredate_now_readClock
  - websearch_italia_low
  - ghost_giraffiamo
```

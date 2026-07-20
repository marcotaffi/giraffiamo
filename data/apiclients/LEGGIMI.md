# data/apiclients — i client verso i provider AI

Un file YAML per client API. Gli agenti (`data/agents/`) li referenziano col
campo `apiClient`. Caricati da `AIApiClientsConfigManager` (taffitools).

La chiave API **non va scritta qui**: si indica il nome della variabile
d'ambiente che la contiene (`apiKeyEnvVar`), definita nel `.env` del bot.

## Campi

| campo               | obbl. | descrizione                                                      |
|---------------------|-------|------------------------------------------------------------------|
| `clientName`        | sì    | nome del client; per convenzione uguale al nome del file         |
| `apiType`           | sì    | tipo di API, es. `chatgpt-respond` (Responses API), `chatgpt-assistants`, `image-generator` |
| `apiKeyEnvVar`      | sì    | nome della variabile in `.env` con la chiave (es. `OPENAI_API_KEY`) |
| `providerType`      | sì    | provider, es. `openai`                                           |
| `clientDescription` | no    | descrizione per gli umani                                        |

## Esempio

```yaml
clientName: gpt-response-dev
clientDescription: ChatGPT response API
apiType: chatgpt-respond
apiKeyEnvVar: OPENAI_API_KEY
providerType: openai
```

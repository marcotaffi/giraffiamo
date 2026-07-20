# data/snippets — pezzi di testo riusabili

File Markdown con porzioni di istruzioni riusabili. Gli agenti
(`data/agents/`) li richiamano per nome (senza estensione) nel campo
`instructions:`; i testi vengono concatenati e usati come istruzioni di
sistema dell'agente.

Convenzioni:

- un file per argomento, con nomi parlanti che raggruppano per prefisso:
  `instructions_<ruolo>.md`, `comelavorare_<fase>.md`, `formato_<formato>.md`,
  `esempi_<tema>.md`, `tools_<ruolo>.md`, `lunghezza_<tipo>.md`…
- il contenuto è testo libero in Markdown: nessun campo obbligatorio;
- questo file inizia con `_` per non comparire nell'elenco degli snippet
  disponibili (la convenzione vale per qualunque bozza da disattivare).

Esempio d'uso in un agente:

```yaml
instructions:
  - giraffiamoinstructions
  - fogliodistile
  - formato_markdown
```

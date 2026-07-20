# Cartella data/ — configurazioni del bot

Tutte le configurazioni del bot vivono qui, lette da taffitools all'avvio.
Ogni sottocartella ha il proprio `LEGGIMI.md` con i campi possibili.

Regole valide in tutte le sottocartelle:

- il percorso `data/` è relativo alla cartella di lancio del processo
  (`process.cwd()`): avvia il bot dalla radice del progetto;
- un file il cui nome inizia con `_` è **disattivato** (escluso dagli elenchi,
  ma caricabile se referenziato esplicitamente): comodo per tenere bozze;
- il nome del file (senza estensione) è il nome dell'oggetto configurato
  (agente, prompt, comando…);
- formati: `.yml` per le configurazioni, `.md` per i testi (snippets).

| cartella           | contenuto                                                        |
|--------------------|------------------------------------------------------------------|
| `agents/`          | gli agenti AI: modello, parametri, instructions, tool            |
| `apiclients/`      | i client verso i provider AI (tipo API + variabile .env della chiave) |
| `prompts/`         | i testi dei prompt; i comandi del bot caricano il prompt omonimo |
| `procedure/`       | pipeline multi-step; ogni file attivo diventa un comando del bot |
| `steps/`           | i singoli passi richiamati dalle procedure                       |
| `services/`        | servizi/canali di pubblicazione (Ghost, WordPress, mail…)        |
| `snippets/`        | pezzi di testo .md riusabili nelle instructions degli agenti     |
| `photoeditors/`    | configurazioni dei generatori di immagini                        |
| `referenceimages/` | immagini di riferimento di stile per i generatori                |

Guida completa passo passo: `libraries/taffitools/docs/configurare-bot-e-siti.md`.

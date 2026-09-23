# Immagini di riferimento per la generazione

Qui stanno i PNG/JPG usati come riferimenti di STILE dai generatori di immagini: vengono
passati al modello insieme al prompt, perché le nuove immagini somiglino a queste.

Si dichiarano nei file `data/photoeditors/*.yml`, con percorsi relativi a `data/`. Si può
indicare un singolo file, un URL http(s) oppure una CARTELLA, che vale per tutte le immagini
`.png/.jpg/.jpeg/.webp` che contiene:

```yaml
referenceImages:
  - referenceimages/simboli
```

Massimo 16 immagini per generazione (statiche + dinamiche), come da limite di OpenAI
`images.edit` per i modelli GPT-image. Ogni riferimento costa token in ingresso, quindi
meglio poche immagini davvero rappresentative che l'intero archivio.

## simboli/

Stile della casa per le cover di giraffiamo.it, usato da `photoeditors/cover_giraffiamo.yml`:
illustrazione ad acquerello e matita su fondo avorio, colori pastello molto tenui e
desaturati (verde salvia, sabbia, ocra), contrasto bassissimo, scena bucolica dentro un tondo
centrale incorniciato da rametti, margini laterali vuoti. Formato 1200x630.
La descrizione testuale completa, quella che viene davvero inviata al modello, sta in
`data/prompts/stile_cover_giraffiamo.yml`.

Per cambiare lo stile delle cover basta aggiungere o togliere file da questa cartella: non
serve toccare nessuno yml.

## eventi/

Stile per il lancio degli EVENTI, usato da `photoeditors/cover_eventi_giraffiamo.yml`: sei
medaglioni circolari disposti su tre colonne e due righe, incisione monocroma color seppia su
fondo avorio, ogni cerchio con un rametto di foglie. Lo schema è sempre lo stesso e cambiano
solo i sei simboli, scelti dall'art director in base all'evento (un emblema per medaglione,
mai una scenetta con più figure).
La descrizione completa sta in `prompts/stile_cover_eventi_giraffiamo.yml`.

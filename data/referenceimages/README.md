# Immagini di riferimento per la generazione

Metti qui i PNG/JPG usati come riferimenti statici di stile dai generatori di immagini.
Si dichiarano nei file `data/photoeditors/*.yml` con percorsi relativi a `data/`:

```yaml
referenceImages:
  - referenceimages/stile-giraffiamo-1.png
```

Massimo 16 immagini totali per generazione (statiche + dinamiche), come da limite di
OpenAI images.edit per i modelli GPT-image.

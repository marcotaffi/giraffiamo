
# Output richiesto

Se tool in errore: ritorna stringa vuota "".
Se tool ok: restituisci oggetto JSON valido.
Non inserire mai testo aggiuntivo, commenti, spiegazioni.

## Struttura dell’oggetto

L’oggetto deve contenere esattamente i seguenti campi:

- title  
- excerpt  
- postType  
- date (solo se lancio di evento)  
- place (solo le lancio di evento) 
- yoast_title  
- yoast_metadesc  
- text  
- author 
- image 

## Regole di compilazione dei campi

- title: titolo principale dell’articolo restituito dal tool.
- excerpt: sottotitolo dell’articolo se presente nel tool; altrimenti stringa vuota "".
- postType:
  - usa "eventi" se il contenuto è un testo di lancio di un evento;
  - usa "posts" in tutti gli altri casi (articoli, comunicati stampa).
- date:
  - solo se postType === "eventi" → usa event_dateAndTime;
  - altrimenti → stringa vuota "".
- place:
  - solo se postType === "eventi" → usa place_of_event;
  - altrimenti → stringa vuota "".
- yoast_title: titolo SEO restituito dal tool.
- yoast_metadesc: meta description restituita dal tool.
- text: articolo completo in formato HTML.
- author: sempre "7".
- image: URL immagine originale

## Vincoli
- Non modificare, riscrivere o integrare autonomamente i contenuti prodotti dal tool.
- non aggiungere commenti, contenuti esterni, conclusioni.
- Non aggiungere campi diversi da quelli indicati.
- Non omettere nessuno dei campi richiesti.
- Tutti i campi devono essere sempre presenti nell’output.
- Se un valore non è disponibile, usa stringa vuota "".

# Formato atteso in uscita
## Formattazione dei campi titolo
  - testo semplice, senza tag HTML, con iniziale maiuscola e punto finale.

## Formattazione articolo
  - html semplice
  - L'articolo deve citare l'eventuale fonte web: se link noto, inserisci alla fine dell'articolo il codice seguente: 

```html  
<div class="MainButtonBlockContainer PulsanteLeft">
					  <a class="MainButton MainButtonDark" href="LINK_ARTICOLO_ORIGINALE" target="_blank">Leggi l’articolo originale su semprenews.it<i class="fa-solid fa-arrow-right"></i></a>
				</div>
```




                

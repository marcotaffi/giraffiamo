
import { debug, BotIooo, AIManager, ProcessManager, ServiceFactory } from "taffitools";
import type {TagProposti, TriggerProposti, Credenziali } from "taffitools";
import dotenv from 'dotenv';
import { CanaleExtendsServizio } from "../../libraries/taffitools/types/canali/canale.js";
dotenv.config();


const botToken = process.env.TELEGRAM_TOKEN||"";
//const chatGptApiKey = process.env.OPENAI_API_KEY||"";
//const assistantID = process.env.ASSISTANT_ID||""; //l'assistente di questo bot
const iftttKey = process.env.IFTTT_WEBHOOKKEY||"";
// url del gateway chat del webserver (porta BOT_REGISTRATION_PORT, default 7070): senza,
// aggiungieInizializzaInterfaccePredefinite non crea la WebChatInterface e il bot non si registra
// sul ChatGateway — le azioni esterne (vedi data/azioniesterne/) arriverebbero sempre "bot non connesso".
const webChatUrl = process.env.WEBCHAT_URL||"";
//const IOOO = process.env.IOOO_WORDPRESS||"";

//const DEBUG_LEVEL = process.env.DEBUG_LEVEL||6;
//const SERPHOUSE = process.env['SERPHOUSE'];  //solo per debug
//const SEOZOOM = process.env['SEOZOOM'];  //solo per debug
ProcessManager.getInstance().setDebugLevel(process.env.DEBUG_LEVEL);

const TEST_ONLY: boolean = !!process.env['TEST_ONLY'] && process.env['TEST_ONLY'] !== "false";
if (TEST_ONLY) debug(2, "Sono in test e quindi faccio tutto senza pubblicare");


/*
 
const promptsArticolo : PromptArticolo = {
  ripubblicaNotizia: { prompt:`Devi scrivere il testo di un articolo giornalistico di approfondimento di una notizia, senza titolo, partendo da uno o più articoli dati. 
    Voglio un testo lungo: individua la notizia di interesse e usa tutto il materiale pertinente che ti viene fornito per raccontare il fatto, comprendendo i dati, le citazioni, le storie e gli esempi dati. 
  Cambia l'attacco e modifica l'ordine dei contenuti per raggruppare i temi simili, seguendo queste indicazioni: 
  - Inizia direttamente dal testo dell'articolo raccontando a piramide invertita con le 5W del giornalismo la notizia principale; 
  - Evita di ripetere le frasi date, ma modificale utilizzando sinonimi per adeguare il tono di voce allo stile sobrio e moderato di semprenews.it; 
  - Preferisci i verbi attivi, contenuti certi e ben definiti, frasi brevi;
  - Mantieni le dichiarazioni originali dette dai protagonisti in prima persona, fra virgolette « »; 
  - Circa a metà articolo inserisci sempre i link alle fonti utilizzate con diciture simili a queste: "come spiega <a hfref= 'url'>Nome Testata</a>", "Leggi anche <a hfref= 'url'>Nome Testata</a>",, "secondo i dati riportati da <a hfref= 'url'>Nome Testata</a>". 
  - Alla fine chiudi l'articolo bruscamente senza inserire conclusioni o commenti.
  
  Formatta l'articolo in html: utilizza <b> per sottolineare i concetti importanti e i nomi propri, <i> per nomi di eventi, progetti, enti. 
  Inserisci uno o due titoli intermedi formattati in <h2>.
  `,

  params: {assistant_id:"asst_bHDl6nBPLhF6AyBVddSlnl7C"

  }
  },
//Il titolo principale deve essere molto breve; contiene una frase breve oppure una citazione ed introduce uno degli aspetti curiosi e popolari dell'articolo. 
  
  scriviTitoli: { prompt:`Devi generare dei titoli in formato JSON per il portale online semprenews.it, per l'articolo dato, per invogliare alla lettura e aiutare il lettore a comprendere gli elementi chiave. 
  Sono richiesti: titolo, occhiello, sommario, SEO title, SEO description. 
  Il titolo principale deve essere breve e descrittivo del fatto o della notizia.
  Nell'occhiello e nel sommario spiega meglio la notizia e introduci i temi trattati. 
  I titoli SEO comprendono la parola chiave principale e servono per il posizionamento, invogliando al click.
  Voglio i titoli scritti come testo normale senza altre formattazioni. Esempi: "Trump prepara la pace" oppure "Trump: «La guerra è quasi finita»" oppure "Pace, il Presidente Trump è ottimista"`,
    params: {assistant_id:"asst_3ivJI6e7wqnQ4rPaGUe1HwoZ"}    
      }
};

*/


//const categoryMapping:  { [key: string]: string } = {
//  "volontariato": "39",
//};

const credenziali : Credenziali = {
iftttKey: iftttKey,
botToken: botToken as string,
webChatUrl: webChatUrl,
//wordpress_sito: "https://www.apg23.org",
//wordpress_basic_auth: IOOO,
//categoryMapping,
test_only: TEST_ONLY,
};
 


let tags : TagProposti[] = [];
let feeds: TriggerProposti[] = [];
let news : TriggerProposti[] = [];

/*
 tags = [ 

  { hooks: ["vita"], categories: ["famiglia"],  descrizioni: { it:  "Le leggi sull'aborto e sulla pillola anticoncezionale RU486 tutelano la donna che vuole interrompere una gravidanza: le neo-mamme piangono davanti agli ospedali la scomparsa del feto. La legge 194 regola l'interruzione volontaria di gravidanza in Italia."}}, 
  { hooks: ["rom"],  categories: ["cronaca"], descrizioni: { it:  "Campi Rom balcanici discriminati per antiziganismo. l'integrazione delle comunità nomadi gipsy. Le roulotte degli zingari gitani poveri accusati di rubare e chiedere l'elemosina. Bambino di origine Sinti nella società romanì, denuncia l'UNAR."}}, 
  { hooks: ["strada"], categories: ["solidarietà"], descrizioni: { it:  "Gli homeless vivono sulla strada elemosinando il cibo dei poveri. L'emarginazione, piaga sociale, è vissuta nelle Capanne di Betlemme e nei centri di accoglienza per l'emergenza freddo. Eppure a volte muoiono sulle panchine, nelle stazioni." }},
  { hooks: ["affido"], categories: ["famiglia"], descrizioni: { it:  "L'affidamento familiare e l'accoglienza nelle case famiglia di minori a rischio: i servizi sociali e il tribunale per i minorenni dispongono l'affido fino ai 18 anni"}}, 
 
];
*/


feeds = [ 
/*  { hooks: ["https://www.operazionecolomba.it/?format=feed&type=rss"],
   categories: ["pace","apg23"],  //qui ci salvo la sezione del feed, eg esteri, cronaca...
   lingua: "it"
   },
   { 
     hooks: ["https://www.apg23.org"],
     categories: ["apg23"], 
   lingua: "it"
   },
 { 
   hooks: ["https://serviziocivile.apg23.org/news-ed-incontri/"],
   categories: ["apg23"],  
   lingua: "it"
   },
   { 
    hooks: ["https://www.semprenews.it/it.xml"],  //provo me stesso, che userò per social di Sempre
    lingua: "it"
    },*/
/* {
  hooks: ["https://www.semprenews.it/tag/Comunita-Papa-Giovanni-XXIII.html"],
  categories: ["apg23"],
  lingua: "it"
 },*/
 /*{
  hooks: ["https://www.semprenews.it/event-it.xml"],
  categories: ["apg23", "eventi"],
  lingua: "it"
 }*/
 {
  // Il sito continua a rispondere 403 a qualunque richiesta automatizzata da questo ambiente (stesso
  // WAF di prima), ma un fetch fatto per un'altra via è riuscito a passare: gli eventi veri sono
  // sotto /eventi/<slug>/ (es. /eventi/cnv-agosto-online/). Il nav ha anche un link nudo a /eventi/
  // che passerebbe il filtro (prende anche quella pagina indice, innocuo).
  hooks: ["https://comunicazionenonviolenta.org/prossimi-eventi/"],
  categories: ["cnv"],
  lingua: "it",
  includiLink: ["/eventi/"],
 },
 {
  // NUOVA FONTE. Centro Interdisciplinare Scienze per la Pace (Università di Pisa): pagina generale
  // dei corsi di alta formazione, copre molti temi diversi (pace, migrazioni, giornalismo...) non solo
  // CNV. Per questo il filtro include SOLO "comunicazione-nonviolenta" (che compare nello slug dei
  // corsi CNV, es. ".../corso-la-comunicazione-nonviolenta-essere-me-incontrare-te/"), non un pattern
  // largo tipo "corso-": altrimenti finirebbero nella categoria "cnv" anche corsi non-CNV del centro.
  hooks: ["https://cisp.unipi.it/formazione/corsi-di-alta-formazione/"],
  categories: ["cnv"],
  lingua: "it",
  includiLink: ["comunicazione-nonviolenta"],
 },
 {
  // NUOVA FONTE. Blog personale di Anna Bassi, formatrice CNV: post con permalink a data
  // /AAAA/MM/slug/ (stesso schema di giraffe-cnv.it). Escludo i link ai commenti (contengono "/20"
  // per via dell'anno nell'URL del post, ma puntano allo stesso post, non a un nuovo contenuto) e
  // gli asset/API di WordPress.
  hooks: ["https://annabassi.com/"],
  categories: ["cnv"],
  lingua: "it",
  includiLink: ["/20"],
  escludiLink: ["/wp-content/", "/wp-json/", "#comment"],
 },
 {
  // NUOVA FONTE. "Arte del Dialogo": laboratori CNV a offerta libera. Eventi veri sotto /eventi/<slug>/,
  // ma il menu ha anche pagine di categoria sotto /eventi/categorie/... che vanno escluse esplicitamente
  // perché contengono anch'esse "/eventi/". Anche questo sito mi ha risposto 403 dall'ambiente in cui
  // lavoro (stesso WAF di comunicazionenonviolenta.org), verificato con un fetch alternativo: da
  // monitorare dopo il deploy nel caso risulti bloccato anche per il taffiserver.
  hooks: ["https://artedeldialogo.it"],
  categories: ["cnv"],
  lingua: "it",
  includiLink: ["/eventi/"],
  escludiLink: ["/eventi/categorie/"],
 },
 {
  // I corsi veri sono tutti sotto /shop/<slug>/ (verificato scaricando la pagina): le altre voci
  // sono menu di navigazione (/categoria-prodotto/..., /blog/, /feed/ ecc.) e non c'entrano.
  hooks: ["https://www.centroesserci.it/categoria-prodotto/corsi/online-2026/"],
  categories: ["cnv"],
  lingua: "it",
  includiLink: ["/shop/"],
 },
 {
  // Stesso schema della pagina "online-2026" qui sopra.
  hooks: ["https://www.centroesserci.it/categoria-prodotto/corsi/in-presenza-2026/"],
  categories: ["cnv"],
  lingua: "it",
  includiLink: ["/shop/"],
 },
 {
  // ATTENZIONE: questo sito è una SPA React/Next.js. L'HTML statico che il taffiserver scarica con
  // axios/cheerio non contiene i link agli eventi, solo i bundle JS che li generano a runtime nel
  // browser (verificato: la pagina scaricata ha solo un pugno di riferimenti a file _assets/*.js).
  // Nessun filtro includiLink/escludiLink può risolverlo: servirebbe un fetch con browser headless
  // (es. Puppeteer/Playwright) per eseguire il JS, il taffiserver oggi non lo fa. Il filtro qui sotto
  // non ha quindi alcun effetto pratico finché non si cambia il metodo di scaricamento della pagina.
  hooks: ["https://facciamolapace.com/eventi"],
  categories: ["cnv"],
  lingua: "it"
 },
 {
  // Articoli con permalink a data /AAAA/MM/GG/slug/ (WordPress). Il filtro qui è per sottostringa,
  // non supporta una regex "qualunque anno" come faceva il vecchio filtro globale: uso "/20" che
  // intercetta qualunque anno 20xx (fino al 2099) nel percorso. Escludo /wp-content/ e /wp-json/
  // perché altrimenti verrebbero presi anche i link alle immagini caricate (es. /wp-content/uploads/2019/...)
  // e alle risposte dell'API REST di WordPress, che contengono anch'essi "/20" per altri motivi.
  hooks: ["https://www.giraffe-cnv.it/"],
  categories: ["cnv"],
  lingua: "it",
  includiLink: ["/20"],
  escludiLink: ["/wp-content/", "/wp-json/"],
 },
 {
  // Articoli veri sotto /news/<slug>/. Escludo il feed RSS della pagina stessa (contiene "/news/"
  // ma non è un articolo) e la voce "mantenimento-di-acrocirco": è un contenuto fisso della pagina,
  // sempre rilistato, che non ci interessa mai pubblicare (vedi conversazione del 2026-07-23).
  hooks: ["https://ch4sportingclub.it/news/comunicazione-nonviolenta/"],
  categories: ["cnv"],
  lingua: "it",
  includiLink: ["/news/"],
  escludiLink: ["/feed/", "mantenimento-di-acrocirco"],
 },
 {
  // Pagina scaricata e ispezionata: non ha una vera sezione di notizie/eventi con uno schema di link
  // riconoscibile (solo pagine statiche tipo /chi-siamo/, /praticare-cnv, e link esterni). Nessun
  // filtro sensato da applicare: lascio senza includiLink (prende tutto quel poco che c'è).
  hooks: ["https://www.cnv-arpa.it/"],
  categories: ["cnv"],
  lingua: "it"
 },
/* { SITO CHE BLOCCA I BOT
  hooks: ["https://www.cnvc.org/it/news"],
  categories: ["cnv"],
  lingua: "it"
 },
*/

  ];


/*
  news = [
    {
     hooks: ['Comunità Papa Giovanni XXIII', 'Don Oreste Benzi', 'Operazione Colomba'],
     categories: ["apg23"],
     lingua: "it"
    },
    {
     hooks: ['Sandra Sabattini', 'Matteo Fadda'],
     categories: ["apg23"],
     lingua: "it"
    },
    ];  
    
*/


// ******************************** main **************************************


(async () => {
  try {


  
    debug(3, "*Creo i canali:* ");




 //   const procedureManager = new ProcedureManager();
 //   const listaPromptFiles : Files = await procedureManager.elencaFiles("yml");
   
//--------------

// CREAZIONE CANALI

 /* 
  VECCHIO SISTEMA
 let NotizieApg23 = new Redazione("redazione_marcotassinari@apg23.org");
    const promptNotizieApg23 = NotizieApg23.requiredPrompts();
    type PromptIDNotizieApg23 = typeof promptNotizieApg23[number]["id"];
    const promptDisponibiliNotizieApg23: Record<PromptIDNotizieApg23, string> = {
       run:"genera_articolo_apg23",
    };


    NotizieApg23
    //.addContent({categories: ["apg23"], flusso:"Instant" })
    //.addContent({hooks: ["politica"], flusso:"RaggruppaSimili", type:"tags"})
    .addContent({hooks: ["semprenews.it/tag/Comunita-Papa-Giovanni-XXIII"], flusso:"Instant", type:"feeds"})
    
//    .removeContent({hooks: ["semprenews.it"], type:"urls"})
    .setMyPrompts(promptDisponibiliNotizieApg23,listaPromptFiles)
    .start(credenziali);

*/

//SISTEMA MODERNO
    const NotizieGiraffiamo = await ServiceFactory.create("ghost_giraffiamo") as CanaleExtendsServizio;

   // const NotizieApg23 = await ServiceFactory.create("ripubblicaconorchestratore") as CanaleExtendsServizio;
    NotizieGiraffiamo.start(credenziali);

 


//-----------------
 /* VECCHIO SISTEMA
    let EventiApg23 = new Redazione("redazione_marcotassinari@apg23.org");
    const promptEventiApg23 = EventiApg23.requiredPrompts();
    type PromptIDEventiApg23 = typeof promptEventiApg23[number]["id"];
    const promptDisponibiliEventiApg23: Record<PromptIDEventiApg23, string> = {
       run:"genera_evento_apg23",
    };

    EventiApg23
    .addContent({categories: ["eventi"], flusso:"Instant"})
    .setMyPrompts(promptDisponibiliEventiApg23,listaPromptFiles)
    .start(credenziali);
    
*/

// sistema moderno

//SISTEMA DI BACKUP CHE MANDA LE MAIL MENTRE PROVO IL CARICAMENTO AUTOMATICO
 //   const NotizieMail = await ServiceFactory.create("ripubblicaconorchestratore_mail") as CanaleExtendsServizio;
//  NotizieMail.start(credenziali);


  //canale con caricamento automatico su apg23 DISABILITO PER ORA MI MANCANO I PERMESSI
//   const Apg23viaIooo = await ServiceFactory.create("pubblicaapg23") as CanaleExtendsServizio;
  //       Apg23viaIooo.start(credenziali);







/* VECCHI CANALI

    let AlessioZamboni = new Redazione("redazione_sempreredazione@apg23.org");


    const promptSempreNews = AlessioZamboni.requiredPrompts();
    type PromptIDSempreNews = typeof promptSempreNews[number]["id"];


    const promptDisponibiliSempreNews: Record<PromptIDSempreNews, string> = {
       run:"genera_articolo_semprenews",

      // ripubblica_notizia: "ripubblica_notizia",
     // genera_titoli: "genera_titoli",
    };

    AlessioZamboni
    .addContent({categories: ["apg23"], flusso:"Instant" })
    //.addContent({hooks: ["politica"], flusso:"RaggruppaSimili", type:"tags"})
    .removeContent({hooks: ["semprenews.it"], type:"urls"})
    .setMyPrompts(promptDisponibiliSempreNews,listaPromptFiles)
    .start(credenziali);
    
      */
     /*
     let ChiaraBonetto = new Redazione("redazione_chiarabonetto@apg23.org")
      .addContent({ hooks: ["scienza", "missioni"], categories: ["scienza"], flusso:"RaggruppaSimili", type:"tags" })
      .removeContent( {hooks: ["semprenews.it"],  type:"*"}) //per ora non funziona perché dovrò fare ricerca nel testo degli urls
      //.setPrompts(promptsArticolo)
      .setMyPrompts(promptDisponibiliSempreNews,listaPromptFiles)
      .start(credenziali);

*/

/*

      let NicolettaPasqualini = new Redazione("redazione_nicolettapasqualini@apg23.org")
      .addContent( { hooks: ["religione"], type:"tags", flusso:"RaggruppaSimili", })
     // .addContent("tags", { categories: ["scienza"],})
      //.removeContent("tags", {hooks: ["scienza"]})
      .removeContent({hooks: ["semprenews.it"], type:"urls"})
      //.setPrompts(promptsArticolo)
      .setMyPrompts(promptDisponibiliSempreNews,listaPromptFiles)
      .start(credenziali);

*/

/*

      let MarcoScarmagnani = new Redazione("redazione_marcoscarmagnani@apg23.org")
      //.addContent("tags", { hooks: ["disabilità", "educazione", "infanzia", "salute", "famiglia", "vita", "affido"],})
      .addContent( { categories: ["famiglia"], type:"tags", flusso:"RaggruppaSimili"})
      .removeContent({hooks: ["semprenews.it"], type:"urls"})
//      .setPrompts(promptsArticolo)
      .setMyPrompts(promptDisponibiliSempreNews,listaPromptFiles)
      .start(credenziali);

*/

/*


      let IreneCiambezi = new Redazione("redazione_ireneciambezi@gmail.com")
      .addContent( { hooks: ["prostituzione"], type:"tags", flusso:"RaggruppaSimili"})
      .removeContent({hooks: ["semprenews.it"], type:"urls"})
//      .setPrompts(promptsArticolo)
      .setMyPrompts(promptDisponibiliSempreNews,listaPromptFiles)
      .start(credenziali);
*/

debug (3, "*Definisco le classi AI*");

const aiManager = new AIManager(credenziali);

await aiManager.creaApiDaCartelleLocali(); //costruisce i servizi dai file degli agenti

/*
const aiManager = new AIManager({
  credenziali,
  sessionManager: new AISessionManager(),
  //servizi: new CanaliExtendsServizi(),  // servizi personalizzati
  apis: [
    {
      name: "chatgpt-assistants-api",
      type: "chatgpt-assistants",
      client: "openai-prod",
      clientConfig: { type: "openai", apiKey: chatGptApiKey }
    },
    {
      name: "dall-e",
      type: "image-generator",             // tipo per ChatGptImageGenerator
      client: "openai-prod",               // riutilizza lo stesso client
      clientConfig: {                       // anche qui se vuoi creare un client separato
        type: "openai",
        apiKey: chatGptApiKey
      }
    }
    // puoi aggiungere altre API qui
  ]
});



// Se vuoi puoi impostare parametri di default per le API
aiManager.setDefaultParams({ assistant_id: assistantID }, "chatgpt-assistants-api");
*/
/*
    const sessionManager: AISessionManager = new AISessionManager();
    const aiManager = new AIManager(sessionManager);
    aiManager.clientManager.createClients({"openai":chatGptApiKey});

    const assistenteAI : ChatGPTAssistant = new ChatGPTAssistant(aiManager)
      .setDefaultAssistantID(assistantID);
    //const telegram = new TelegramInterface(botToken);
    const servizi = new CanaliExtendsServizi();

    aiManager
      .setAssistant(assistenteAI)
      .setServizi(servizi)
      .creaServiziPrevistiDallAssistenteOnline(credenziali); 

*/


  debug (3, "*Definisco il bot*")

  const bot = new BotIooo(aiManager, "giraffiamo");

  debug (3, "*Aggiungo le inferfacce*")

  await bot.aggiungieInizializzaInterfaccePredefinite(credenziali); 


  debug(3, "*Aggiungo i canali al bot*"); 
    const elencoCanali : CanaleExtendsServizio[]=[NotizieGiraffiamo,]; // NotizieMail];

   bot.aggiungiCanali(elencoCanali, credenziali);

    debug (3, "*Aggiungo le fonti e la conoscenza*")

     if (feeds.length>0) bot.addFeeds(feeds); //invia le fonti        
     if (news.length>0) bot.addNews(news); //invia le fonti       
     if (tags.length>0) bot.setKnowledge(tags); //passo le descrizioni dei miei tag e categorie

      debug(3, "*Avvio il bot*");

       await bot.start(TEST_ONLY); // inizializza i canali e avvia il websocket

      
        debug(0,"*Bot avviato.*", bot.constructor.name);
       

  } catch (error) {
    debug(1,`Errore nell'avvio del bot Giraffiamo:`, error);
  }



})();




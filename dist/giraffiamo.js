import { debug, BotIooo, AIManager, ProcessManager, ServiceFactory } from "taffitools";
import dotenv from 'dotenv';
dotenv.config();
const botToken = process.env.TELEGRAM_TOKEN || "";
//const chatGptApiKey = process.env.OPENAI_API_KEY||"";
//const assistantID = process.env.ASSISTANT_ID||""; //l'assistente di questo bot
const iftttKey = process.env.IFTTT_WEBHOOKKEY || "";
// (2026-09-18) Servono per il provider "gmail" di sendmail (vedi taffitools/src/servizi/
// mailservice.ts) — ora il default, IFTTT non è attivo. Da impostare in .env prima che l'invio
// mail funzioni davvero: stesso schema di marcotassinaribot/src/marcotassinaribot.ts.
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const googleRefreshToken = process.env.GOOGLE_REFRESH_TOKEN || "";
// url del gateway chat del webserver (porta BOT_REGISTRATION_PORT, default 7070): senza,
// aggiungieInizializzaInterfaccePredefinite non crea la WebChatInterface e il bot non si registra
// sul ChatGateway — le azioni esterne (vedi data/azioniesterne/) arriverebbero sempre "bot non connesso".
const webChatUrl = process.env.WEBCHAT_URL || "";
//const IOOO = process.env.IOOO_WORDPRESS||"";
//const DEBUG_LEVEL = process.env.DEBUG_LEVEL||6;
//const SERPHOUSE = process.env['SERPHOUSE'];  //solo per debug
//const SEOZOOM = process.env['SEOZOOM'];  //solo per debug
ProcessManager.getInstance().setDebugLevel(process.env.DEBUG_LEVEL);
const TEST_ONLY = !!process.env['TEST_ONLY'] && process.env['TEST_ONLY'] !== "false";
if (TEST_ONLY)
    debug(2, "Sono in test e quindi faccio tutto senza pubblicare");
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
const credenziali = {
    iftttKey: iftttKey,
    botToken: botToken,
    webChatUrl: webChatUrl,
    googleClientId: googleClientId,
    googleClientSecret: googleClientSecret,
    googleRefreshToken: googleRefreshToken,
    //wordpress_sito: "https://www.apg23.org",
    //wordpress_basic_auth: IOOO,
    //categoryMapping,
    test_only: TEST_ONLY,
};
let tags = [];
let feeds = [];
let news = [];
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
        // AGGIORNATO (2026-09-07): passato dallo scraping HTML di /prossimi-eventi/ (con filtro
        // includiLink) al feed RSS dedicato agli eventi, che esiste ed è pulito — verificato con curl:
        // /eventi/feed/ risponde 200 application/rss+xml con voci reali (title = "...- Eventi"). Un
        // hook che punta a un feed RSS/Atom valido salta del tutto lo scraping+filtro HTML lato
        // taffiserver (vedi commento su Trigger.includiLink in tipimarco.ts): niente più bisogno di
        // indovinare pattern di URL.
        // AGGIORNATO (2026-09-14): il sito ha iniziato a rispondere 403 al controllo giornaliero da
        // produzione (verificato nei log di taffiserver, 12 e 13 settembre, stesso orario ~16:58,
        // mentre le altre fonti nello stesso ciclo scaricano regolarmente) — sembra un rate-limit/anti-bot
        // lato loro, non un problema nostro. Intervallo allungato a 4 giorni (contro il default di 24h)
        // per ridurre la pressione sul loro sito; gli eventi CNV vengono di norma pubblicati con largo
        // anticipo, quindi non serve controllare più spesso. Regolare qui se il blocco persiste o rientra.
        hooks: ["https://comunicazionenonviolenta.org/eventi/feed/"],
        categories: ["cnv"],
        lingua: "it",
        intervalloControllo: 4 * 24 * 60 * 60 * 1000, // 4 giorni
    },
    {
        // NUOVA FONTE. Centro Interdisciplinare Scienze per la Pace (Università di Pisa): pagina generale
        // dei corsi di alta formazione, copre molti temi diversi (pace, migrazioni, giornalismo...) non solo
        // CNV. Per questo il filtro include SOLO "comunicazione-nonviolenta" (che compare nello slug dei
        // corsi CNV, es. ".../corso-la-comunicazione-nonviolenta-essere-me-incontrare-te/"), non un pattern
        // largo tipo "corso-": altrimenti finirebbero nella categoria "cnv" anche corsi non-CNV del centro.
        // Controllato (2026-09-07) se esistesse un feed RSS più mirato: il /feed/ generale del sito è
        // troppo ampio (stesso problema di temi misti), e /formazione/corsi-di-alta-formazione/feed/
        // non è un feed di contenuti ma il feed dei COMMENTI a quella pagina (vuoto) — comportamento
        // di default di WordPress per le pagine statiche. Resta quindi lo scraping HTML con filtro.
        hooks: ["https://cisp.unipi.it/formazione/corsi-di-alta-formazione/"],
        categories: ["cnv"],
        lingua: "it",
        includiLink: ["comunicazione-nonviolenta"],
    },
    {
        // AGGIORNATO (2026-09-07): passato allo scraping HTML del feed RSS di WordPress, verificato
        // pulito e attivo (curl: /feed/ → 200 application/rss+xml, voci reali tipo "Coltivare la CNV").
        hooks: ["https://annabassi.com/feed/"],
        categories: ["cnv"],
        lingua: "it",
    },
    {
        // AGGIORNATO (2026-09-07): il sito rispondeva 403 solo dall'ambiente di test usato per il primo
        // controllo, non dal taffiserver in produzione (verificato dopo il deploy, come segnalato qui).
        // Passato inoltre dallo scraping HTML con filtro al feed RSS dedicato, verificato pulito e attivo.
        hooks: ["https://artedeldialogo.it/feed/"],
        categories: ["cnv"],
        lingua: "it",
    },
    {
        // AGGIORNATO (2026-09-07): passato dallo scraping HTML (filtro /shop/) al feed RSS di questa
        // categoria WooCommerce specifica, verificato pulito e scoperto per caso: esiste ed è ricco
        // (curl: .../online-2026/feed/ → 200 application/rss+xml, 60KB, voci tipo "Ottobre-Dicembre",
        // "6-8 Ottobre" — niente contenuti di altre categorie del sito).
        hooks: ["https://www.centroesserci.it/categoria-prodotto/corsi/online-2026/feed/"],
        categories: ["cnv"],
        lingua: "it",
    },
    {
        // Stesso schema della categoria "online-2026" qui sopra: feed RSS dedicato, non il /feed/
        // generico del sito.
        hooks: ["https://www.centroesserci.it/categoria-prodotto/corsi/in-presenza-2026/feed/"],
        categories: ["cnv"],
        lingua: "it",
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
        // Il sito ha cambiato schema di permalink nel tempo: i post più vecchi restano sotto
        // /AAAA/MM/GG/slug/ (dove "includiLink: ['/20']" li prendeva), ma i contenuti più recenti —
        // eventi compresi, es. /parlare-pace-trieste/ — usano ora uno slug pulito senza data, che quel
        // filtro non intercettava più: verificato scaricando la home, ci sono entrambi gli schemi
        // mescolati. Passo da un filtro "prendi solo se" a "prendi tutto tranne le pagine di servizio":
        // AGGIORNATO (2026-09-07): il /feed/ che qui sotto veniva escluso come "pagina di servizio"
        // durante lo scraping HTML è in realtà il modo giusto per leggere questo sito: verificato
        // pulito e attivo (curl: /feed/ → 200 application/rss+xml, voci reali tipo "Il potere che
        // cambia la classe"). Passo il feed stesso come hook, niente più bisogno di indovinare schemi
        // di permalink che cambiano nel tempo.
        hooks: ["https://www.giraffe-cnv.it/feed/"],
        categories: ["cnv"],
        lingua: "it",
    },
    {
        // Articoli veri sotto /news/<slug>/. Escludo il feed RSS della pagina stessa (contiene "/news/"
        // ma non è un articolo) e la voce "mantenimento-di-acrocirco": è un contenuto fisso della pagina,
        // sempre rilistato, che non ci interessa mai pubblicare (vedi conversazione del 2026-07-23).
        // Controllato (2026-09-07): il /feed/ generale del sito è troppo ampio (centro sportivo, non
        // solo CNV), e .../comunicazione-nonviolenta/feed/ è il feed dei COMMENTI a quella pagina
        // (vuoto), non un feed di contenuti — stesso comportamento di default WordPress visto su
        // cisp.unipi.it. Resta lo scraping HTML con filtro.
        hooks: ["https://ch4sportingclub.it/news/comunicazione-nonviolenta/"],
        categories: ["cnv"],
        lingua: "it",
        includiLink: ["/news/"],
        escludiLink: ["/feed/", "mantenimento-di-acrocirco"],
    },
    {
        // AGGIORNATO (2026-09-07): la homepage non aveva una sezione news/eventi riconoscibile via
        // link, ma il sito ha comunque un feed RSS valido (curl: /feed/ → 200 application/rss+xml,
        // voci come "Coltivare la pace"). Passo il feed come hook invece della homepage.
        hooks: ["https://www.cnv-arpa.it/feed/"],
        categories: ["cnv"],
        lingua: "it"
    },
    {
        // NUOVA FONTE (2026-09-07). ArtoRise: laboratori/workshop di CNV (area Milano). Eventi veri
        // sotto /project/<slug>/, la pagina indice è /events/. Il sito ha un /feed/ RSS valido, ma
        // copre il blog generale (clima, geopolitica, attualità...), non solo i laboratori CNV:
        // verificato coi titoli restituiti, niente a che vedere con CNV nella maggior parte dei casi.
        // Meglio lo scraping mirato di /events/ col filtro qui sotto.
        hooks: ["https://www.artorise.org/events/"],
        categories: ["cnv"],
        lingua: "it",
        includiLink: ["/project/"],
    },
    {
        // NUOVA FONTE (2026-09-07). Giovanna Castoldi, formatrice CNV certificata (compare anche tra
        // gli eventi di comunicazionenonviolenta.org, es. "AD.AGIO CON..."). Il dominio non ha un
        // /feed/ generico (risponde con l'HTML della home, feed disattivato lì), ma la sezione /cnv/
        // sì: verificato pulito e attivo (curl: /cnv/feed/ → 200 application/rss+xml, voce reale "Un
        // Viaggio nella Trasformazione dei Conflitti"). Un solo hook copre sia corsi che laboratori
        // pratici, niente bisogno di due voci separate con includiLink diversi.
        hooks: ["https://www.giovannacastoldi.it/cnv/feed/"],
        categories: ["cnv"],
        lingua: "it",
    },
    {
        // NUOVA FONTE (2026-09-07). Giacomo Poleschi, formatore CNV certificato, collabora con Centro
        // Esserci (Reggio Emilia, già fonte esistente sopra). Pagina eventi: /wp/eventi-workshop/.
        // Il sito ha un /wp/feed/ RSS valido ma vuoto (0 voci, canale attivo: "Formazione,
        // Facilitazione, Mediazione CNV" — probabilmente aggiorna solo la pagina statica eventi, non
        // pubblica sul blog): niente da guadagnare passando al feed. Schema URL delle singole pagine
        // evento non verificato con certezza: nessun filtro includiLink per ora, da restringere dopo
        // il primo giro reale se produce link fuori tema.
        hooks: ["https://www.giacomopoleschi.com/wp/eventi-workshop/"],
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
        const NotizieGiraffiamo = await ServiceFactory.create("ghost_giraffiamo");
        // const NotizieApg23 = await ServiceFactory.create("ripubblicaconorchestratore") as CanaleExtendsServizio;
        NotizieGiraffiamo.start(credenziali);
        //-----------------
        // ripubblica_giraffiamo: stesso canale Ghost (stesso sito, stesse credenziali, stessa azione
        // run/post), richiamato tramite il canale generico CanaleFlusso invece che come metodo fisso
        // della sottoclasse Ghost — vedi taffitools/src/canali/canaleflusso.ts e data/services/
        // ripubblica_giraffiamo.yml. Dal 2026-09-15 (Tappa 3, cutover completato) è IL publisher
        // automatico reale per il CNV di giraffiamo.it: NotizieGiraffiamo (sopra) resta avviato e
        // richiamabile da chat, ma non riceve più traffico dal feed (classificazione disattivata in
        // ghost_giraffiamo.yml) per evitare pubblicazioni doppie. Chiamabile anche da chat, con tre
        // azioni separate: "scrivi"/"invia" (singoli step) e "principale" (pipeline completa, scrive e
        // pubblica per davvero senza conferma — la stessa che gira già dal feed).
        const ripubblicaGiraffiamoFlusso = await ServiceFactory.create("ripubblica_giraffiamo");
        ripubblicaGiraffiamoFlusso.start(credenziali);
        // (2026-09-18) Notifica a marco@taffi.it a ogni pubblicazione automatica dal feed (vedi gli step
        // componi_notifica_marco/invia_notifica_marco in coda a data/procedure/ripubblica_pubblica.yml).
        // Non sono canali (non ricevono feed, non sono AI-callable): vanno registrati con
        // bot.aggiungiServizi, non con bot.aggiungiCanali — stesso schema di marcotassinaribot/src/
        // marcotassinaribot.ts (sendmailLuccitelli/componiMessaggioLuccitelli).
        const componiNotificaMarco = await ServiceFactory.create("componimessaggio_notificamarco");
        componiNotificaMarco.start(credenziali);
        const sendmailMarco = await ServiceFactory.create("sendmail_marco@taffi.it_send");
        sendmailMarco.start(credenziali);
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
        debug(3, "*Definisco le classi AI*");
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
        debug(3, "*Definisco il bot*");
        const bot = new BotIooo(aiManager, "giraffiamo");
        debug(3, "*Aggiungo le inferfacce*");
        await bot.aggiungieInizializzaInterfaccePredefinite(credenziali);
        debug(3, "*Aggiungo i canali al bot*");
        const elencoCanali = [NotizieGiraffiamo, ripubblicaGiraffiamoFlusso]; // NotizieMail];
        bot.aggiungiCanali(elencoCanali, credenziali);
        bot.aggiungiServizi([componiNotificaMarco, sendmailMarco]);
        debug(3, "*Aggiungo le fonti e la conoscenza*");
        if (feeds.length > 0)
            bot.addFeeds(feeds); //invia le fonti
        if (news.length > 0)
            bot.addNews(news); //invia le fonti
        if (tags.length > 0)
            bot.setKnowledge(tags); //passo le descrizioni dei miei tag e categorie
        // Incremento 1 del modello di permessi (taffiserver/README.md): anagrafica in
        // taffiserver/data/bot/bot-giraffiamo.yml. Se GIRAFFIAMO_TAFFISERVER_SEGRETO non è
        // impostato, il bot si registra comunque, senza verifica (comportamento invariato).
        if (process.env.GIRAFFIAMO_TAFFISERVER_SEGRETO)
            bot.setSegreto(process.env.GIRAFFIAMO_TAFFISERVER_SEGRETO);
        debug(3, "*Avvio il bot*");
        await bot.start(TEST_ONLY); // inizializza i canali e avvia il websocket
        debug(0, "*Bot avviato.*", bot.constructor.name);
    }
    catch (error) {
        debug(1, `Errore nell'avvio del bot Giraffiamo:`, error);
    }
})();

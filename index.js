require('dotenv').config();

const PORT = process.env.PORT || 3000;
const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = mongoose.connection
const app = express();
mongoose.connect(process.env.DB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})


// Connectie maken met de database
db.once('open', () => {
  console.log('Connectie met de database')
})


// Aangeven waar de statische files zich bevinden  
app.use(express.static('static'));


// Hiermee zorgen we ervoor dat we data kunnen versturen naar de DB uit de formulieren
app.use(bodyParser.urlencoded({
  extended: false
}))


// Template engine opgeven
app.engine('hbs', hbs({
  extname: 'hbs'
}));
app.set('view engine', 'hbs');


// Mongoose db schema aanmaken voor de werkzoekende
const gebruikersSchema = new mongoose.Schema({
  voornaam: {
    type: String,
    required: true
  },
  achternaam: {
    type: String,
    required: true
  },
  leeftijd: {
    type: Number,
    required: true
  },
  werkzoekendeEmail: {
    type: String,
    required: true
  },
  werkzoekendePortfolio: {
    type: String,
    required: false
  },
  werkzoekendeCv: {
    // https://stackoverflow.com/questions/54151409/what-is-the-field-type-for-a-file-in-a-mongodb-schema-model
    // https://mongoosejs.com/docs/schematypes.html
    type: Buffer,
    required: true
  },
  werkzoekendeWoonplaats: {
    type: String,
    required: true
  },
  biografie: {
    type: String,
    required: true
  },
  opleidingRichting: {
    type: String,
    required: true
  },
  schoolNaam: {
    type: String,
    required: true
  },
  opleidingsniveau: {
    type: String,
    required: true
  },
  leerjaar: {
    type: Number,
    required: true
  },
  skills: {
    type: Array,
    required: true
  },
  functie: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  dienstverband: {
    type: String,
    required: true
  }
});


// Mongoose db schema aanmaken voor de vacatures
const vacaturesSchema = new mongoose.Schema({
  bedrijfsnaam: {
    type: String,
    required: true
  },
  straatnaam: {
    type: String,
    required: true
  },
  huisnummer: {
    type: Number,
    required: true
  },
  plaatsnaam: {
    type: String,
    required: true
  },
  postcode: {
    type: String,
    required: true
  },
  bedrijfWebsite: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  vacatureNaam: {
    type: String,
    required: true
  },
  dienstverband: {
    type: String,
    required: true
  },
  vacatureOmschrijving: {
    type: String,
    required: true
  },
  opleidingsniveau: {
    type: String,
    required: true
  },
  competenties: {
    type: Array,
    required: true
  },
  skills: {
    type: Array,
    required: true
  },
  aanbod: {
    type: String,
    required: true
  },
  contactpersoonVoornaam: {
    type: String,
    required: true
  },
  contactpersoonAchternaam: {
    type: String,
    required: true
  },
  contactpersoonEmail: {
    type: String,
    required: true
  },
  contactpersoonNummer: {
    type: String,
    required: true
  },
  contactpersoonLinkedIn: {
    type: String,
    required: false
  },
});


// De database schema's stoppen in een variabele
const vacatureCollection = mongoose.model('vacature', vacaturesSchema);
const gebruikersCollection = mongoose.model('gebruikers', gebruikersSchema);


// Homepagina route -get
app.get('/', async (req, res) => {
  res.render('home', {
    paginaClass: "home",
    title: "JobDone",
  })
});


////////////////////// WERKZOEKENDE /////////////////////

// Werkzoekende resultaten route - get
app.get('/werkzoekende', async (req, res) => {

  //met lean() zetten we het om naar mongodb objecten
  const gebruikers = await gebruikersCollection.find({}).lean()
  res.render('werkzoekende', {
    title: "Werkzoekende",
    paginaClass: "resultaten",
    footertekst: "Vacature plaatsen",
    footerlink: "/vacaturesToevoegen",
    results: gebruikers.length,
    gebruikers,
  });
});


// Werkzoekende resultaten route - post - om data vanuit het formulier te versturen
app.post('/werkzoekende', async (req, res) => {

  // variabelen aanmaken, filter opties
  const dienstverbandFilter = req.body.dienstverbandFilter
  const opleidingsniveauFilter = req.body.opleidingsniveauFilter

  // leeg object aanmaken, standaard wordt er naar alle resultaten gezocht
  let query = {}

  // if else checkt waarop er wordt gefilterd (of er wordt gefiltert), past query steeds aan
  if (dienstverbandFilter === 'Alle' && opleidingsniveauFilter === 'Alle') {
    query = {}
  } else if (opleidingsniveauFilter === 'Alle') {
    query = {
      dienstverband: dienstverbandFilter
    }
  } else if (dienstverbandFilter === 'Alle') {
    query = {
      opleidingsniveau: opleidingsniveauFilter
    }
  } else {
    query = {
      opleidingsniveau: opleidingsniveauFilter,
      dienstverband: dienstverbandFilter
    }
  }

  // query gebruiken, om in de db te zoeken
  // met lean() zetten we het om naar mongodb objecten
  const gebruikers = await gebruikersCollection.find(query).lean()

  res.render('werkzoekende', {
    title: "Werkzoekende",
    paginaClass: "resultaten",
    footertekst: "Vacature plaatsen",
    footerlink: "/vacaturesToevoegen",
    results: gebruikers.length,
    gebruikers,
    opleidingsniveauFilter,
    dienstverbandFilter
  })
})


///////////////// WERKZOEKENDE TOEVOEGEN //////////////

// Werkzoekedende toevoegen route - get
app.get('/werkzoekendeToevoegen', (req, res) => {
  res.render('werkzoekendeToevoegen', {
    paginaClass: "werkzoekende-toevoegen",
    footertekst: "Terug naar vacatures",
    footerlink: "/vacatures",
    title: "Werkzoekende aanmaken"
  });
});


// Werkzoekedende toevoegen route - post
app.post('/werkzoekendeToevoegen', async (req, res) => {

  // create wordt gebruikt om nieuwe documenten aan te maken
  const gebruikers = await gebruikersCollection.create({
    "voornaam": req.body.voornaam,
    "achternaam": req.body.achternaam,
    "leeftijd": req.body.leeftijd,
    "werkzoekendeEmail": req.body.werkzoekendeEmail,
    "werkzoekendePortfolio": req.body.werkzoekendePortfolio,
    "werkzoekendeCv": req.body.werkzoekendeCv,
    "werkzoekendeWoonplaats": req.body.werkzoekendeWoonplaats,
    "biografie": req.body.biografie,
    "opleidingRichting": req.body.opleidingRichting,
    "schoolNaam": req.body.schoolNaam,
    "opleidingsniveau": req.body.opleidingsniveau,
    "leerjaar": req.body.leerjaar,
    "skills": req.body.skills,
    "functie": req.body.functie,
    "branch": req.body.branch,
    "dienstverband": req.body.dienstverband
  })

  res.render('werkzoekendeIngevuldeGegevens', {
    title: req.body.voornaam + " je bent toegevoegd!",
    paginaClass: "werkzoekende-toevoegen",
    footertekst: "Terug naar vacatures",
    footerlink: "/vacatures",

    //.toObject is nodig om de data op te halen voor de ingevulde gegevens pagina
    gebruikers: gebruikers.toObject()
  })
});



////////////////////// VACATURES /////////////////////////

// Vacature resultaten route - get
app.get('/vacatures', async (req, res) => {
  vacatures = await vacatureCollection.find({}).lean()
  res.render('vacatures', {
    title: "Vacatures",
    paginaClass: "resultaten",
    footertekst: "Werkzoekende aanmaken",
    footerlink: "/werkzoekendeToevoegen",
    results: vacatures.length,
    vacatures,
  });
});


// Vacature resultaten route - post - om data vanuit het formulier te versturen
app.post('/vacatures', async (req, res) => {

  // variabelen aanmaken, filter opties
  const branchFilter = req.body.branchFilter
  const dienstverbandFilter = req.body.dienstverbandFilter

  // leeg object aanmaken, standaard. Zoekt naar alles
  let query = {}

  // if else checkt waarop er wordt gefilterd, past query aan
  if (branchFilter === 'Alle' && dienstverbandFilter === 'Alle') {
    query = {}
  } else if (dienstverbandFilter === 'Alle') {
    query = {
      branch: branchFilter
    }
  } else if (branchFilter === 'Alle') {
    query = {
      dienstverband: dienstverbandFilter
    }
  } else {
    query = {
      dienstverband: dienstverbandFilter,
      branch: branchFilter
    }
  }

  // query gebruiken, om in de db te zoeken
  // lean, omzetten naar json, anders is het een mongodb object
  const vacatures = await vacatureCollection.find(query).lean()

  res.render('vacatures', {
    title: "Vacatures",
    paginaClass: "resultaten",
    results: vacatures.length,
    footertekst: "Werkzoekende aanmaken",
    footerlink: "/werkzoekendeToevoegen",
    vacatures,
    dienstverbandFilter,
    branchFilter
  })
})


// Vacature toevoegen route - get
app.get('/vacaturesToevoegen', (req, res) => {
  let vacature = {}
  res.render('vacaturesToevoegen', {
    paginaClass: "werkzoekende-toevoegen",
    footertekst: "Terug naar werkzoekende",
    footerlink: "/werkzoekende",
    title: "Vacature plaatsen",
    vacature
  });
});


// Vacature pagina route - post
app.post('/vacaturesToevoegen', async (req, res) => {

  // create wordt gebruikt om nieuwe documenten aan te maken
  const vacatures = await vacatureCollection.create({
    "vacatureNaam": req.body.vacatureNaam,
    "bedrijfsnaam": req.body.bedrijfsnaam,
    "straatnaam": req.body.straatnaam,
    "huisnummer": req.body.huisnummer,
    "plaatsnaam": req.body.plaatsnaam,
    "postcode": req.body.postcode,
    "bedrijfWebsite": req.body.bedrijfWebsite,
    "dienstverband": req.body.dienstverband,
    "branch": req.body.branch,
    "vacatureOmschrijving": req.body.vacatureOmschrijving,
    "opleidingsniveau": req.body.opleidingsniveau,
    "competenties": req.body.competenties,
    "skills": req.body.skills,
    "aanbod": req.body.aanbod,
    "contactpersoonVoornaam": req.body.contactpersoonVoornaam,
    "contactpersoonAchternaam": req.body.contactpersoonAchternaam,
    "contactpersoonEmail": req.body.contactpersoonEmail,
    "contactpersoonNummer": req.body.contactpersoonNummer,
    "contactpersoonLinkedIn": req.body.contactpersoonLinkedIn
  })

  res.render('vacaturesIngevuldeGegevens', {
    title: req.body.vacatureNaam + " is toegevoegd!",
    paginaClass: "werkzoekende-toevoegen",

    //.toObject is nodig om de data op te halen voor de ingevulde gegevens pagina
    vacatures: vacatures.toObject()
  })
});


// 404 route
// https://www.geeksforgeeks.org/express-js-res-status-function/
app.use(function (req, res, next) {
  res.status(404).render('404');
});


// Geeft de port terug die gebruikt wordt
app.listen(PORT, () => {
  console.log(`Gebruikte poort: ${PORT}!`)
})
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
  console.log('Connected to MongoDB')
})


// Aangeven waar de statishce files zich bevinden  
app.use(express.static('static'));


// Hiermee zorgen we ervoor dat we data kunnen versturen naar de DB
app.use(bodyParser.urlencoded({
  extended: false
}))


// Template engine opgeven
app.engine('hbs', hbs({
  extname: 'hbs'
}));
app.set('view engine', 'hbs');


// Database gebruikers schema maken
const gebruikersSchema = new mongoose.Schema({
  voornaam: {
    type: String,
    required: false
  },
  achternaam: {
    type: String,
    required: false
  },
  biografie: {
    type: String,
    required: false
  },
  opleidingRichting: {
    type: String,
    required: false
  },
  schoolNaam: {
    type: String,
    required: false
  },
  opleidingsniveau: {
    type: String,
    required: false
  },
  leerjaar: {
    type: Number,
    required: false
  },
  functie: {
    type: String,
    required: false
  },
  branch: {
    type: String,
    required: false
  },
  dienstverband: {
    type: String,
    required: false
  }
});


// Database vacature schema maken
const vacaturesSchema = new mongoose.Schema({
  bedrijfsnaam: {
    type: String,
    required: false
  },
  straatnaam: {
    type: String,
    required: false
  },
  huisnummer: {
    type: String,
    required: false
  },
  plaatsnaam: {
    type: String,
    required: false
  },
  postcode: {
    type: String,
    required: false
  },
  bedrijfWebsite: {
    type: String,
    required: false
  },
  branch: {
    type: String,
    required: false
  },
  vacatureOmschrijving: {
    type: String,
    required: false
  },
  opleidingsniveau: {
    type: String,
    required: false
  },
  competenties: {
    type: String,
    required: false
  },
  skills: {
    type: String,
    required: false
  },
  aanbod: {
    type: String,
    required: false
  },
  contactpersoonVoornaam: {
    type: String,
    required: false
  },
  contactpersoonAchternaam: {
    type: String,
    required: false
  },
  contactpersoonEmail: {
    type: String,
    required: false
  },
  contactpersoonNummer: {
    type: String,
    required: false
  },
  contactpersoonLinkedIn: {
    type: String,
    required: false
  },
});


// De database schema's stoppen in een variabele
const vacatureCollection = mongoose.model('vacature', vacaturesSchema);
const gebruikersModel = mongoose.model('gebruikers', gebruikersSchema);
// const vacaturesModel = mongoose.model('vacature', vacaturesSchema);
// const gebruikersCollection = mongoose.model('gebruikers', gebruikersSchema);


// Homepagina route -get
app.get('/', async (req, res) => { //checkNotAuthenticated
  res.render('home', {
    paginaClass: "home",
    title: "JobDone",
  })
});


////////////////////// WERKZOEKENDE /////////////////////

// Werkzoekende resultaten route - get
app.get('/werkzoekende', async (req, res) => { //checkAuthenticated
  let gebruikers = {}
  gebruikers = await db.collection('gebruikers').find({}, {}).toArray();
  res.render('werkzoekende', {
    title: "Werkzoekende",
    paginaClass: "resultaten",
    footertekst: "Vacatures toevoegen",
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

  // leeg object aanmaken, standaard. Zoekt naar alles
  let query = {}

  // if else checkt waarop er wordt gefilterd, past query aan
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
  // lean, omzetten naar json, anders is het een mongodb object
  const gebruikers = await gebruikersModel.find(query).lean()

  res.render('werkzoekende', {
    title: "Werkzoekende",
    paginaClass: "resultaten",
    footertekst: "Vacatures toevoegen",
    footerlink: "/vacaturesToevoegen",
    results: gebruikers.length,
    gebruikers,
    opleidingsniveauFilter,
    dienstverbandFilter
  })
})


////////////////////// VACATURES /////////////////////////

// Vacature resultaten route - get
app.get('/vacatures', async (req, res) => { //checkAuthenticated
  let vacatures = {}
  vacatures = await db.collection('vacatures').find({}, {}).toArray();
  res.render('vacatures', {
    title: "Vacatures",
    paginaClass: "resultaten",
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
    vacatures,
    dienstverbandFilter,
    branchFilter
  })
})


// Werkzoekedende toevoegen route - get
app.get('/werkzoekendeToevoegen', (req, res) => { // gebruikersModel
  let gebruikers = {}
  res.render('werkzoekendeToevoegen', {
    paginaClass: "werkzoekende-toevoegen",
    footertekst: "Terug naar werkzoekende",
    footerlink: "/werkzoekende",
    title: "Gebruiker Toevoegen",
    gebruikers
  });
});


// Werkzoekedende toevoegen route - post - ik haal data op het formulier door de req.body te gebruiken
app.post('/werkzoekendeToevoegen', async (req, res) => {
  const gebruikers = {
    "voornaam": req.body.voornaam,
    "achternaam": req.body.achternaam,
    "biografie": req.body.biografie,
    "opleidingRichting": req.body.opleidingRichting,
    "schoolNaam": req.body.schoolNaam,
    "opleidingsniveau": req.body.opleidingsniveau,
    "leerjaar": req.body.leerjaar,
    "kwaliteiten": req.body.kwaliteiten,
    "functie": req.body.functie,
    "branch": req.body.branch,
    "dienstverband": req.body.dienstverband
  };
  await db.collection('gebruikers').insertOne(gebruikers);
  res.render('werkzoekendeIngevuldeGegevens', {
    title: req.body.naam + " je bent toegevoegd!",
    paginaClass: "werkzoekende-toevoegen",
    footertekst: "Terug naar werkzoekende",
    footerlink: "/werkzoekende",
    gebruikers
  })
});


// Vacature toevoegen route - post - ik haal data op het formulier door de req.body te gebruiken
app.get('/vacaturesToevoegen', (req, res) => { //checkAuthenticated
  let vacature = {}
  res.render('vacaturesToevoegen', {
    paginaClass: "werkzoekende-toevoegen",
    footertekst: "Terug naar werkzoekende",
    footerlink: "/werkzoekende",
    title: "Vacature Toevoegen",
    vacature
  });
});

// Reultaten pagina route - post - ik haal data op het formulier door de req.body te gebruiken
app.post('/vacaturesToevoegen', async (req, res) => {
  const vacatures = {
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
  };
  await db.collection('vacatures').insertOne(vacatures);
  res.render('vacaturesIngevuldeGegevens', {
    title: req.body.vacatureNaam + " is toegevoegd!",
    paginaClass: "werkzoekende-toevoegen",
    // footertekst: "hoi",
    // footerlink: "/werkzoekende",
    vacatures
  })
});


// 404 route
app.use(function (req, res, next) {
  res.status(404).send("Sorry ik heb niks kunnen vinden");
});

// Geeft de port terug die gebruikt wordt
app.listen(PORT, () => {
  console.log(`Gebruikte poort: ${PORT}!`)
})
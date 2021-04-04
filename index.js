require('dotenv').config();

const PORT = process.env.PORT || 3000;
const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
// const slug = require('slug')
const mongoose = require('mongoose');
const db = mongoose.connection
const app = express();
// const {
//   MongoClient
// } = require('mongodb');

mongoose.connect(process.env.DB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

db.once('open', () => {
  console.log('Connected to MongoDB')
})

// Aangeven waar onze statishce files zich bevinden  
app.use(express.static('static'));

// Hiermee zorgen we ervoor dat we data kunnen versturen naar de DB
app.use(bodyParser.urlencoded({
  extended: false
}))

// Template engine opgeven
app.engine('hbs', hbs({extname: 'hbs'}));
app.set('view engine', 'hbs');

const gebruikersSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false
  },
  naam: {
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

const gebruikersCollection = mongoose.model('gebruikers', gebruikersSchema);




const vacaturesSchema = new mongoose.Schema({
  id: {
    type: String,
    required: false
  },
  vacatureNaam: {
    type: String,
    required: false
  },
  bedrijfsnaam: {
    type: String,
    required: false
  },
  plaatsnaam: {
    type: String,
    required: false
  },
  dienstverband: {
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
});

const vacatureCollection = mongoose.model('vacature', vacaturesSchema);

























// Homepagina route -get
app.get('/' ,async (req, res) => {
  res.render('home', {
    paginaClass: "home",
    title: "JobDone",
  })
});


/////////////////////// WERKZOEKENDE /////////////////////

// Reultaten pagina route - get
app.get('/werkzoekende', async (req, res) => {
  let gebruikers = {}
  gebruikers = await db.collection('gebruikers').find({}, {
  }).toArray();
  res.render('werkzoekende', {
    title: "Werkzoekende",
    paginaClass: "resultaten",
    footertekst: "Vacatures toevoegen",
    footerlink: "/vacaturesToevoegen",
    results: gebruikers.length,
    gebruikers,
  });
});

// Reultaten pagina route - post - om data vanuit het formulier te versturen
app.post('/werkzoekende', async (req, res) => {

  // variabelen aan, filter opties
  const branchFilter = req.body.branchFilter
  const opleidingsniveauFilter = req.body.opleidingsniveauFilter

  // lege object aan, standaard. Zoekt naar alles
  let query = {}

  // if else checkt waarop er wordt gefilterd, past query aan
  if (branchFilter === 'Alle' && opleidingsniveauFilter === 'Alle') {
    query = {}
  } else if (opleidingsniveauFilter === 'Alle') {
    query = { branch: branchFilter }
  } else if (branchFilter === 'Alle') {
    query = { opleidingsniveau: opleidingsniveauFilter }
  } else {
    query = { 
      opleidingsniveau: opleidingsniveauFilter,
      branch: branchFilter
    }
  }

  // query gebruiken, om in de db te zoeken
  // lean, omzetten naar json, anders is het een mongodb object
  const gebruikers = await gebruikersCollection.find(query).lean()

  res.render('werkzoekende', {
    title: "Werkzoekende",
    paginaClass: "resultaten",
    footertekst: "Vacatures toevoegen",
    footerlink: "/vacaturesToevoegen",
    results: gebruikers.length,
    gebruikers,
    opleidingsniveauFilter,
    branchFilter
  })
})


////////////////////// VACATURES /////////////////////////

// Reultaten pagina route - get
app.get('/vacatures', async (req, res) => {
  let vacatures = {}
  vacatures = await db.collection('vacatures').find({}, {
  }).toArray();
  res.render('vacatures', {
    title: "Vacatures",
    paginaClass: "resultaten",
    results: vacatures.length,
    vacatures,
  });
});

// Reultaten pagina route - post - om data vanuit het formulier te versturen
app.post('/vacatures', async (req, res) => {

  // variabelen aan, filter opties
  const dienstverbandFilter = req.body.dienstverbandFilter
  const opleidingsniveauFilter = req.body.opleidingsniveauFilter

  // lege object aan, standaard. Zoekt naar alles
  let query = {}

  // if else checkt waarop er wordt gefilterd, past query aan
  if (dienstverbandFilter === 'Alle' && opleidingsniveauFilter === 'Alle') {
    query = {}
  } else if (opleidingsniveauFilter === 'Alle') {
    query = { dienstverband: dienstverbandFilter }
  } else if ( dienstverbandFilter === 'Alle') {
    query = { opleidingsniveau: opleidingsniveauFilter }
  } else {
    query = { 
      opleidingsniveau: opleidingsniveauFilter,
      dienstverband: dienstverbandFilter
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
    opleidingsniveauFilter,
    dienstverbandFilter
  })
})






















// Toevoegen pagina route - get
app.get('/werkzoekendeToevoegen', (req, res) => {
  let gebruikers = {}
  res.render('werkzoekendeToevoegen', {
    paginaClass: "werkzoekende-toevoegen",
    footertekst: "Terug naar werkzoekende",
    footerlink: "/werkzoekende",
    title: "Gebruiker Toevoegen",
    gebruikers
  });
});

// Reultaten pagina route - post - ik haal data op het formulier door de req.body te gebruiken
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




app.get('/vacaturesToevoegen', (req, res) => {
  let vacature = {}
  res.render('vacaturesToevoegen', {
    paginaClass: "werkzoekende-toevoegen",
    footertekst: "hoi",
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
    "plaatsnaam": req.body.plaatsnaam,
    "dienstverband": req.body.dienstverband,
    "branch": req.body.branch,
    "vacatureOmschrijving": req.body.vacatureOmschrijving,
    "opleidingsniveau": req.body.opleidingsniveau,
    "competenties": req.body.competenties,
    "skills": req.body.skills,
    "aanbod": req.body.aanbod
  };
  await db.collection('vacatures').insertOne(vacatures);
  res.render('vacaturesIngevuldeGegevens', {
    title: req.body.vacatureNaam + " is toegevoegd!",
    paginaClass: "werkzoekende-toevoegen",
    footertekst: "hoi",
    footerlink: "/werkzoekende",
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
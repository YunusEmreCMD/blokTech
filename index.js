require('dotenv').config();

const PORT = process.env.PORT || 3000;
const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
// const slug = require('slug')
const flash = require('connect-flash');
const session = require('express-session');
const bcrypt = require('bcryptjs'); 
const mongoose = require('mongoose');
const db = mongoose.connection
const app = express();
const passport = require('passport')
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
app.engine('hbs', hbs({
  extname: 'hbs'
}));
app.set('view engine', 'hbs');


app.use(session({
  secret: 'geheim',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser((user, done) =>{
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id,(err, user) => {
    done(err, user);
  });
});


// Authenticate check

// function checkAuthenticated (req, res, next) {
//   if(req.isAuthenticated()){
//   return next()
//   }
//   res.redirect('/')
//   };

// function checkNotAuthenticated (req, res, next) {
//   if(req.isAuthenticated()){
//   res.redirect('/resultaten');
//   };
//   next();
// };

//Flash
app.use(flash());



const gebruikersSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
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

const vacaturesSchema = new mongoose.Schema({
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
// const gebruikersCollection = mongoose.model('gebruikers', gebruikersSchema);
const gebruikersModel = mongoose.model('gebruikers', gebruikersSchema);


// Homepagina route -get
app.get('/', async (req, res) => { //checkNotAuthenticated
  res.render('home', {
    paginaClass: "home",
    title: "JobDone",
  })
});




////////////////////////// REGISTREREN

app.get('/registreren', (req, res) => { //checkNotAuthenticated
  res.render('registreren', {
    title: "Registreren"
  })
});


app.post('/registreren', async (req, res) => {
  const {
    email,
    password
  } = req.body;
  let errors = [];

  //Controleer benodigden velden
  if (!email || !password) {
    errors.push({
      message: 'please invullen'
    });
  }

  //Wachtwoord lengte instellen
  if (password.length < 6) {
    errors.push({
      message: 'Wachtwoord te kort'
    })
  }

  await gebruikersModel.findOne({
      email: email
    })
    .then(user => {
      if (user) {
        //Gebruiker bestaat
        errors.push({
          message: "Email al in gebruik"
        });
      }
    });

  if (errors.length) {
    console.log(errors);
    res.render('registreren', {
      errors,
      email,
      password
    })
  } else {
    const newUser = new gebruikersModel({
      email,
      password
    });
    newUser.save()
      .then(user => {
        req.flash('succes_msg', 'geregistreerd');
        res.redirect('/');
      })
      .catch(err => console.log(err));
}}); 



/////////////////////////// INLOGGEN ////////////////////


app.get('/login', (req, res) => {
  const errors = req.flash();
  res.render('login', { errors })
});


// Login handle
app.post('/login', (req, res, next) => {
  passport.use(
    new localStrategy({ usernameField: 'email' }, (email, password, done)=>{
      // Match user
      gebruikersModel.findOne({ email: email})
      .then(user => {
        if(!user){
          return done(null, false, {message: 'Email bestaat nog niet'})
        }
  
        // Match Password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if(err) throw err;
          if(isMatch){
          req.session.user = user
            return done(null, user);
          } else{
            return done(null, false, {message:'Wachtwoord fout'})
          }
        });
      })
      .catch(err => console.log(err));
    })
  );
  passport.authenticate('local', {
    successRedirect:'/werkzoekende',
    failureRedirect: '/',
    failureFlash: true
  })(req, res, next);
});


















/////////////////////// WERKZOEKENDE /////////////////////

// Reultaten pagina route - get
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
    query = {
      branch: branchFilter
    }
  } else if (branchFilter === 'Alle') {
    query = {
      opleidingsniveau: opleidingsniveauFilter
    }
  } else {
    query = {
      opleidingsniveau: opleidingsniveauFilter,
      branch: branchFilter
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
    branchFilter
  })
})


////////////////////// VACATURES /////////////////////////

// Reultaten pagina route - get
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
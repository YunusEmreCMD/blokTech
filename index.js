const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const dotenv = require('dotenv').config();
const port = 3000;


// Array voor dynamische content

// const gebruikers = [
//   {naam: "Yunus Emre Alkan", soortGebruiker: "Werkzoekende", opleidingsniveau: "Hbo", leerjaar: 2, functie: "Creative designer", dienstverband: "Stage"},
//   {naam: "Ali", soortGebruiker: "Werkzoekende", opleidingsniveau: "Universiteit", leerjaar: 3, functie: "Architect", dienstverband: "Stage"},
//   {naam: "Lisa", soortGebruiker: "Werkzoekende", opleidingsniveau: "Mbo", leerjaar: 1, functie: "Apotheek assistente", dienstverband: "Part-time"}
// ]

// DB Connectie testen
console.log(process.env.TESTVAR);

app.use(express.static('static'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/gebruikers', (req,res) => {
    res.render('lijstMetGebruikers', {title: "Dit zijn alle gebruikers", gebruikers});
});
app.get('/gebruikers-kaart', (req,res) => {
  const gebruiker = gebruikers[0];
  res.render('lijstMetGebruikersKaart', {title: "Dit zijn alle gebruikers", gebruiker});
});
// app.get('/movies/:movieId', (req,res) => {
//   res.send(`<h1>Detailpage of movie ${req.params.movieId} </h1>`);
// });
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

app.listen(3000, () => {
  console.log(`Express web app on localhost:3000`);
});
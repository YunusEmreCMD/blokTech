const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const port = 3000

const gebruikers = [
  {naam: "Yunus Emre Alkan", soortGebruiker: "Werkzoekende", opleidingsniveau: "Hbo", leerjaar: 2, functie: "Creative designer", gewenstDienstverband: "stage"},
  {naam: "Ali", soortGebruiker: "Werkzoekende", opleidingsniveau: "Universiteit", leerjaar: 3, functie: "Architect", gewenstDienstverband: "stage"},
  {naam: "Lisa", soortGebruiker: "Werkzoekende", opleidingsniveau: "Mbo", leerjaar: 1, functie: "Apotheek assistente", gewenstDienstverband: "part-time"},
]

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
  res.render('lijstMetGebruikersKaart', {title: "Dit zijn alle gebruikers", gebruikers});
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
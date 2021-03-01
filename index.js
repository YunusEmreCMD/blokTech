const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const port = 3000

const movies = [
  {title: "The Hulk", genre: "Action", jaartal: 1980},
  {title: "Spiderman", genre: "Drama", jaartal: 2012},
  {title: "Spongebob", genre: "Comedy", jaartal: 2021}
]

app.use(express.static('static'));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/handlebars', (req,res) => {
  res.render('home');
});
app.get('/movies', (req,res) => {
    res.render('listOfMovies', {title: "lijst van films", movies});
});
app.get('/movies/:movieId', (req,res) => {
  res.send(`<h1>Detailpage of movie ${req.params.movieId} </h1>`);
});
app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!");
});

app.listen(3000, () => {
  console.log(`Express web app on localhost:3000`);
});
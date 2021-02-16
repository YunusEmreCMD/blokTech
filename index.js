const express = require('express');
const app = express();
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.get('/movies', (req,res) => {
    res.send('A list of movies');
});
app.get('/movies/:movieId', (req,res) => {
  res.send(`<h1>Detailpage of movie ${req.params.movieId} </h1>`);
});

app.listen(3000, () => {
  console.log(`Express web app on localhost:3000`);
});
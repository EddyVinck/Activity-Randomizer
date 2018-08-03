const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

app.use('/static', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/google-sheets-tutorial', (req, res) => {
  res.render('google-sheet-tutorial');
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

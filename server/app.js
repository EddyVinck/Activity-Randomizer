const path = require('path');
const express = require('express');
const port = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

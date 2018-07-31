const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const port = process.env.PORT || 3000;

const app = express();

// https://stackoverflow.com/questions/41423727/handlebars-registerhelper-serverside-with-expressjs

// Use module.exports in helpers or else it breaks
// Try making the layouts ./layouts/default instead of layouts/default
app.engine(
  'hbs',
  exphbs({
    extname: '.hbs',
    partialsDir: 'views/partials/',
    layoutsDir: 'views/layouts',
    helpers: {
      breadcrumbs: () => 1,
      'current-year': () => 2,
    },
  })
);

// const helpers = require('require-all')('./views/helpers');

// Object.keys(helpers).forEach((name) => {
//   instance.registerHelper(name, helpers[name])
// })

// console.log(JSON.stringify(helpers, null, 2));

app.set('view engine', 'hbs');
// exphbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('index.hbs');
});

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});

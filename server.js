// connect packages to server
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');

// connect helper functions to server
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });

//connect to default port
const app = express();
const PORT = process.env.PORT || 3001;

// connect to sequelize via an env file
const sequelize = require("./config/connection");
const SequelizeStore = require('connect-session-sequelize')(session.Store);

//create and use session
const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize
    })
};
app.use(session(sess));

//initialize handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// connect to routes in controllers folder
app.use(require('./controllers/'));

// initialize and connect to server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});

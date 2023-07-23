import express from 'express';
import expressLayout from 'express-ejs-layouts';
import connectDB from './server/config/db.js';
import main from './server/routes/main.js'
import admin from './server/routes/admin.js'
import isActiveRoute from './server/helpers/routeHelpers.js'

import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import * as dotenv from 'dotenv';
dotenv.config();


const app = express();
const PORT = 5000 || process.env.PORT;

// Connect to DB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));

app.use(express.static('public'));

//Middleware 
// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute; 

app.use('/', main)
app.use('/', admin)

app.listen(PORT, ()=> {
    console.log(`App listening on port ${PORT}`);
})
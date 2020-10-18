const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

// config
app.set('PORT', process.env.PORT || '3000');

// middlewares
app.use(cors())
   .use(express.json())
   .use(express.urlencoded({extended: false}))
   .use(morgan('dev'));


// API'S
const router = require('./rest/index');
app.use(router);


// Init server
app.listen(app.get('PORT'), () => console.log(`listen on port ${app.get('PORT')}`));
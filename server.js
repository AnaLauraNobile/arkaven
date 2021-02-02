const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
// eslint-disable-next-line no-unused-vars
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

const MONGODB_URI = 'mongodb+srv://kuinoso:.m0ng0db.@arkaven.gmizn.mongodb.net/arkaven?retryWrites=true&w=majority';

const routes = require('./routes/api');

mongoose.connect(MONGODB_URI || 'mongodb://localhost/arkaven', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose is conected!');
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// HTTP request logger
app.use(morgan('tiny'));

app.use('/api', routes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.listen(PORT, console.log(`Server is starting at port ${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const port = process.env.PORT || 5000;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const dbKey = require('./config/keys').mongoURI;

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const event = require('./routes/api/events');

const business = require('./routes/api/businesses');

const lokals = require('./routes/api/lokals')

mongoose.set('useFindAndModify', false);
mongoose
  .connect(dbKey, { useNewUrlParser: true, useCreateIndex: true})
  .then(() => console.log("MongoDB Atlas connected"))
  .catch(err => console.log(err));
  
// Use middleware: Passport and perform configuration
app.use(passport.initialize());
require('./config/passport')(passport);

// Use End user Routes
app.use('/api/users', users);
app.use('/api/profile', profile);

app.use('/api/business', business);
app.use('/api/event', event);

// Admin API
app.use('/api/lokals', lokals);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Running on PORT:${port}`));
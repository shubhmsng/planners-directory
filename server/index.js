const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const MongoDBService = require('./mongoDBService');
const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.JWT_SECRET;


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);


app.get('/api/admin', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  let data = {};
  await MongoDBService.getAdminData().then(res => {
    data = res;
  });
  res.send(data);
});

app.post('/api/users/login', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { email, password } = req.body;
  MongoDBService.getUser(email, password, res);
});

app.get('/api/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.getProfile(user.email, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.get('/api/planner/packages', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.getPackages(user.email, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
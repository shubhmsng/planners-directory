const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const MongoDBService = require('./mongoDBService');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

AWS.config.update({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey
});

var s3 = new AWS.S3();
const accessTokenSecret = process.env.JWT_SECRET;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      console.log(file);
      cb(null, Date.now().toString());
    }
  })
});

app.get('/api/admin', async (req, res) => {
  let data = {};
  await MongoDBService.getAdminData().then(res => {
    data = res;
  });
  res.send(data);
});

app.post('/api/users/login', (req, res) => {
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

app.post('/api/location/countries/continent', (req, res) => {
  if (req.body.continent) {
    MongoDBService.getCountries(req.body.continent, res);
  } else {
    res.send([]);
  }
});

app.post('/api/location/countries/states', (req, res) => {
  const code = req.body.code;
  MongoDBService.getStates(code, res);
});

app.get('/api/location/countries/:continent', (req, res) => {

  if (req.params.continent === "cblocked") {
    MongoDBService.getCountriesByStatus(res, true)
  } else {
    MongoDBService.getCountries(req.params.continent, res);
  }
});

app.post('/api/location/countries/:isBlocked', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      if (req.params.isBlocked === "block") {
        MongoDBService.blockCountry(req.body, res, true);
      } else if (req.params.isBlocked === "continent") {
        MongoDBService.getCountries(req.body.continent, res);
      } else {
        MongoDBService.blockCountry(req.body, res, false);
      }
    });
  } else {
    res.sendStatus(401);
  }
});

app.get('/api/location/continents/unblocked', (req, res) => {
  MongoDBService.getContinents(res, false);
});

app.get('/api/location/continents', (req, res) => {
  MongoDBService.getContinents(res);
});

app.post('/api/location/continents/:isBlocked', (req, res) => {
  const data = req.body;
  const isBlocked = req.params.isBlocked === "unblock" ? false : true;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.updateContinents(res, data, isBlocked);
    });
  } else {
    res.sendStatus(401);
  }
});


app.post('/api/location/states/countries', (req, res) => {
  const code = req.body.code;
  MongoDBService.getCities(code, res);
});

app.post('/api/users/register', (req, res) => {
  const data = req.body;
  MongoDBService.registerUser(data, res);
});

app.post('/api/:type', (req, res) => {
  const data = req.body;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.registerPlanner(data, user.email, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/:type/profile/new', (req, res) => {
  const data = req.body;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.updateProfile(data, user.email, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.get('/api/admin/noticeboard', (req, res) => {
  MongoDBService.getNoticeBoard(res);
});

app.post('/api/planner/packages/new', (req, res) => {
  const data = req.body;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.addPackages(data, user.email, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/image-upload/:imageno', upload.any('file'), (req, res, next) => {
  res.send({ imageUrl: req.files[0].location });
});

app.post('/api/:type/images', (req, res) => {
  const data = req.body;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.addImages(data, user.email, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/:type/keywords', (req, res) => {
  const data = req.body;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.updateKeywords(data, user.email, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/:type/office', (req, res) => {
  const data = req.body;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.updateOffice(data, user.email, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/profile/reset', (req, res) => {
  const data = req.body;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.resetPassword(data, user.email, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/vendor/services/new', (req, res) => {
  const data = req.body;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.addServices(data, user.email, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.get('/api/vendor/services/dashboard/all', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.getServices(user.email, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/admin/noticeboard', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.addNoticeBoard(req.body, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/admin/packages', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.updateAdminPackages(req.body, res);
    });
  } else {
    res.sendStatus(401);
  }
});


app.post('/api/admin/category', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.addCategories(req.body, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/admin/category/delete', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.removeCategories(req.body, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/admin/event-types', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.addEventType(req.body, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/admin/event-types/delete', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.removeEventType(req.body, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/admin/catering', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.addCatering(req.body, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/admin/catering/delete', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.removeCatering(req.body, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/admin/about-us', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.updateAboutUs(req.body, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/admin/terms', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.updateTnC(req.body, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/admin/privacy-policy', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.updatePP(req.body, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/admin/bg-images', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.updateWebsiteBg(req.body, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.get('/api/admin/stats/:type', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      if (req.params.type === "total") {
        MongoDBService.totalUsers(res);
      } else if (req.params.type === "planners") {
        MongoDBService.totalPlanners(res);
      } else if (req.params.type === "block-planners") {
        MongoDBService.totalBlockedPlanners(res);
      } else if (req.params.type === "block-vendors") {
        MongoDBService.totalBlockedVendors(res);
      }
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/admin/search', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.findUsers(req.body, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/admin/target-market', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      MongoDBService.updateMarketType(req.body, res);
    });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/admin/users/:type', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      if (req.params.type === "block") {
        MongoDBService.blockProfile(req.body, false, res);
      } else if (req.params.type === "delete") {
        MongoDBService.deleteProfile(req.body, res);
      }
      else {
        MongoDBService.blockProfile(req.body, true, res);
      }

    });
  } else {
    res.sendStatus(401);
  }
});


app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
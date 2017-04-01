import express  from 'express';
import cors     from 'cors';
import fetch    from 'isomorphic-fetch';
import mongoose from 'mongoose';
import Promise  from 'bluebird';
import ok       from 'okay';

import saveDataInDb from './saveDataInDb';
import Pet          from './models/Pet';
import User         from './models/User';

mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/skb3b');

const petsUrl = 'https://gist.githubusercontent.com/isuvorov/55f38b82ce263836dadc0503845db4da/raw/pets.json';

let pets = {};

const app = express();
app.use(cors());

app.get('/', (req, res, next) => {
  res.json(pets);
});

app.get('/users/:prop?', (req, res, next) => {
  const prop = req.params.prop;
  // console.log(prop);

  if (!prop) {

    // console.log(req.query);
    if (req.query.havePet) {
      Pet.find({ type: req.query.havePet }, ok(next, (pets) => {
        let userIds = pets.map((pet) => {
          return pet.userId;
        });
        User.find({ id: { $in: userIds } }, ok(next, (user) => {
          res.json(user);
        })).sort('id');
      }));
      // Pet.find({ type: req.query.havePet })
      //     .populate('owner')
      //     .sort('id')
      //     .exec(ok(next, (item) => {
      //       res.json(item);
      //     }));
    } else {
      User.find({}, ok(next, (item) => {
        res.json(item);
      })).sort('id');
    }

  } else {

    if (isNaN(prop)) {
      User.findOne({ username: prop }, ok(next, (item) => {
        if (!item) return res.status(404).send('Not Found');
        res.json(item);
      }));    
    } else {
      User.findOne({ id: prop }, ok(next, (item) => {
        if (!item) return res.status(404).send('Not Found');
        res.json(item);
      }));

    }
  }
});

app.get('/pets/:prop?', (req, res, next) => {
  const prop = req.params.prop;
  console.log(prop);

  if (!prop) {

    console.log(req.query);
    if (req.query) {
      let query = {};

      if (req.query.type) {
        query.type = req.query.type;
      }
      if (req.query.age_gt) {
        query.age = { $gt: req.query.age_gt, };
      }
      if (req.query.age_lt) {
        if (query.age) {
          query.age.$lt = req.query.age_lt;
        } else {
          query.age = { $lt: req.query.age_lt };
        }
      }
      Pet.find(query, ok(next, (item) => {
        if (!item) return res.status(404).send('Not Found');
        res.json(item);
      })).sort('id');

    } else {
      Pet.find({}, ok(next, (item) => {
        res.json(item);
      })).sort('id');
    }

  } else {
    
    if (isNaN(prop)) {
       res.status(404).send('Not Found');
    } else {
      Pet.findOne({ 'id': prop }, ok(next, (item) => {
        if (!item) return res.status(404).send('Not Found');
        res.json(item);
      }));
    }

  }
});

app.listen(3000, () => {
  console.log('App is listening on port 3000');

  fetch(petsUrl)
  .then(async (res) => {
    const data = await res.json();
    pets = await saveDataInDb(data);
  })
  .catch(err => {
    console.log('Что-то пошло не так:', err);
    throw(err);
  });
});
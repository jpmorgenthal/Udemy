const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Driver = mongoose.model('driver');

describe('Drivers Controller', () => {
  it ('Post to /api/drivers creates a new driver', done => {
    Driver.count().then(count => {

    request(app)
      .post('/api/drivers')
      .send({email: 'test@test.com'})
      .end(() => {
        Driver.count().then(newCount => {
          assert(count +1 === newCount);
          done();
        });
      });
    });
  });

  it('Put to /api/drivers edits a driver', done => {
    const d = new Driver({email: 'test@changeme.com', available: false});
    d.save().then(() => {
      request(app)
        .put(`/api/drivers/${d._id}`)
        .send({available: true})
        .end(() => {
          Driver.findOne({email: 'test@changeme.com'})
            .then(driver => {
              assert(driver.available === true);
              done();
            });
        });
    });
  });

  it('Delete /api/drivers deletes a driver', done => {
    const d = new Driver({email: 'test@test.me'});

    d.save().then(() => {
      request(app)
        .delete(`/api/drivers/${d._id}`)
        .end(() => {
          Driver.findOne({email: 'test@test.me'})
            .then ((driver) => {
              assert (driver === null);
              done();
            });
          });
    });
  });

  it('Index /api/drivers finds drivers in location', done => {
    const dA = new Driver({email: 'a@db.com',
      available:true,
      geometry: {type: 'Point', coordinates: [-122.4759902, 47.6147628]}});

    const dB = new Driver({email: 'b@db.com',
      available: true,
      geometry: {type: 'Point', coordinates: [-80.253, 25.791]}});

    Promise.all([dA.save(), dB.save()])
      .then(() => {
        request(app)
          .get('/api/drivers?lng=-80&lat=25')
          .end((err, response) => {
            assert(response.body.length === 1);
            assert(response.body[0].obj.email === 'b@db.com');
            done();
          })
      })
  });
});

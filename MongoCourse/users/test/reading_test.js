const assert = require('assert');
const User = require('../src/user')

describe('Reading Users out of DB', () => {
  let joe, maria, alex, zach;

  beforeEach((done) => {
    alex = new User({name: 'Alex'});
    maria = new User({name: 'Maria'});
    zach = new User({name: 'Zach'});
    joe = new User({name: 'Joe'});

    Promise.all([alex.save(), joe.save(), maria.save(), zach.save()])
    .then(() => done());
  });

  it('finds all Joes', (done) => {
    User.find({name: 'Joe'})
    .then ((users) => {
      assert(users[0]._id.toString()===joe._id.toString());
      done();
    });
  });

  it('find a specific Joe', (done) => {
    User.findOne({_id: joe._id})
    .then((user) => {
      assert(user.name === 'Joe');
      done();
    });
  });

  it('can skip and limit results', (done) => {
    User.find({})
      .sort({name: 1})
      .skip(1).limit(2)
      .then ((users) => {
        assert(users.length === 2);
        assert(users[0].name === 'Joe');
        assert(users[1].name === 'Maria');
        done();
      });
  });
});

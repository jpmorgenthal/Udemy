const assert = require('assert');
const User = require('../src/user');

describe ('Validating records', () => {
  it('requires a username', () => {
    const user = new User({name: undefined});
    const validationResult = user.validateSync();
    const {message} = validationResult.errors.name;

    assert(message === 'Name is required');
  });

  it('name must be longer than 2 characters', () => {
    const user = new User({name: 'Al'});
    const validationResult = user.validateSync();
    const {message} = validationResult.errors.name;

    assert(message === 'Name must be longer than 2 characters');
  });

  it('disallows invalid records being saved', (done) => {
    const user = new User({name:'Al'});
    user.save()
    .catch((validationResult) => {
      const {message} = validationResult.errors.name;

      assert(message === 'Name must be longer than 2 characters');
      done();
    })
  });
});

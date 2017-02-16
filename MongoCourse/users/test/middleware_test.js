const mongoose = require('mongoose');
const assert = require('assert');
const User = require('../src/user');
const BlogPost = require('../src/blogPost');

describe ('Middleware', () => {

  beforeEach((done) => {
    joe = new User({name: 'Joe'});
    blogPost = new BlogPost({title:'JS is Great', content: 'It definitely is'});

    joe.blogPosts.push(blogPost);

    Promise.all([joe.save(), blogPost.save()])
      .then(() => done());
  });

  it('clean up blogPosts when user removed', (done) => {
    joe.remove()
      .then(() => BlogPost.count())
      .then((count) => {
        assert(count === 0);
        done();
      });
  });
});

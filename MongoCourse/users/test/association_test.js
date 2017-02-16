const assert = require('assert')
const mongoose = require('mongoose');
const User = require('../src/user');
const Comment = require('../src/comment');
const BlogPost = require('../src/blogPost');

describe('Associations', () => {
  let joe, blogPost, comment;

  beforeEach((done) => {
    joe = new User({name: 'Joe'});
    blogPost = new BlogPost({title:'JS is Great', content: 'It definitely is'});
    comment = new Comment({content: 'Great post, yay!'});

    joe.blogPosts.push(blogPost);
    blogPost.comments.push(comment);
    comment.user = joe;

    Promise.all([joe.save(), blogPost.save(), comment.save()])
      .then(() => done());
  });

  it('verify relationship between user and blogpost', (done) => {
    User.findOne({name: 'Joe'})
      .populate({
        path: 'blogPosts',
        populate: {
          path: 'comments',
          model: 'comment',
          populate: {
            path: 'user',
            model: 'user'
          }
        }
      })
      .then((user) => {
        const {name} = user.blogPosts[0].comments[0].user;
        assert(user.blogPosts[0].title === 'JS is Great');
        assert(user.blogPosts[0].comments[0].content === 'Great post, yay!');
        assert(name === 'Joe');
        done();
      });
  });

});

/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';
const BookModel = require('../db/model');

module.exports = function (app) {
  app
    .route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      BookModel.find({}, (err, data) => {
        if (err) {
          res.json([]);
        } else {
          const result = data.map((book) => {
            return {
              _id: book._id,
              title: book.title,
              commentcount: book.comments.length,
            };
          });
          res.json(result);
        }
      });
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        res.send('missing required field title');
        return;
      }
      BookModel.create({ title, comments: [] }, (err, data) => {
        if (err) {
          res.send('failed to create book');
        } else {
          res.json(data);
        }
      });
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      BookModel.remove({}, (err, data) => {
        if (err) {
          res.send('could not delete');
        } else {
          res.send('complete delete successful');
        }
      });
    });

  app
    .route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      if (!bookid) {
        res.send('missing _id');
        return;
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      BookModel.findById(bookid, (err, data) => {
        if (err) {
          res.send('no book exists');
        } else {
          res.json(data);
        }
      });
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        res.send('missing required field comment');
        return;
      }
      BookModel.findByIdAndUpdate(
        bookid,
        { $push: { comments: comment } },
        (err, data) => {
          if (err) {
            res.send('no book exists');
          } else {
            const { _id, title, comments } = data;
            res.json({
              _id,
              title,
              commentcount: comments.length,
            });
          }
        },
      );
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      if (!bookid) {
        res.send('missing _id');
        return;
      }
      BookModel.findByIdAndDelete(bookid, (err, data) => {
        if (err) {
          res.send('no book exists');
        } else {
          res.send('delete successful');
        }
      });
    });
};

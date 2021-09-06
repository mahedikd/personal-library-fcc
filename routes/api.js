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
      BookModel.deleteMany({}, (err, data) => {
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
        if (err||!data) {
          res.send('no book exists');
        } else {
          res.json(data);
        }
      });
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        res.send('missing required field comment');
        return;
      }
      BookModel.findById(
        bookid,
        (err, bookData) => {
          if (err || !bookData) {
            res.send('no book exists');
          } else {
          bookData.comments.push(comment);
					bookData.save((err,savedData)=>{
						res.json({
							comments: savedData.comments,
							_id: savedData._id,
							title: savedData.title,
							commentcount: savedData.comments.length
						})
					})
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
        if (err || !data) {
          res.send('no book exists');
        } else {
          res.send('delete successful');
        }
      });
    });
};

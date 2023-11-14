// Create web server application using express
var express = require('express');
var app = express();

// Import body-parser module
var bodyParser = require('body-parser');
// Configure body-parser module to read JSON data
app.use(bodyParser.json());

// Import mongodb module
var mongodb = require('mongodb');
// Create mongodb client
var MongoClient = mongodb.MongoClient;
// Connection URL
var url = 'mongodb://localhost:27017/techblog';

// Import path module
var path = require('path');

// Import fs-extra module
var fs = require('fs-extra');

// Import cors module
var cors = require('cors');
app.use(cors());

// Import multer module
var multer = require('multer');
// Configure multer module to upload files
var upload = multer({ dest: 'uploads/' });

// Create POST API to insert comment
app.post('/api/comments', function(req, res) {
    // Prepare output in JSON format
    var output = {
        error: null,
        status: 200,
        message: 'Comment inserted successfully.',
        insertedId: null
    };
    // Read values from body
    var comment = {
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment,
        blog_id: req.body.blog_id,
        created_at: new Date(),
        updated_at: new Date()
    };
    // Connect to mongodb database
    MongoClient.connect(url, function(err, db) {
        if (err) {
            // If unable to connect mongodb database return error
            output.error = err;
            output.status = 503;
            output.message = 'Unable to connect mongodb database';
            res.status(output.status).json(output);
        } else {
            // If connected to mongodb database
            // Insert comment into database
            db.collection('comments').insert(comment, function(err, result) {
                if (err) {
                    // If error in inserting return error
                    output.error = err;
                    output.status = 500;
                    output.message = 'Unable to insert comment';
                    res.status(output.status).json(output);
                } else {
                    // If success in inserting return success message
                    output.status = 200;
                    output.message = 'Comment inserted successfully';
                    output.insertedId = result.insertedId;
                    res.status(output.status).json(output);
                }
                // Close database connection
                db.close();
            });
        }
    });
});

// Create GET API
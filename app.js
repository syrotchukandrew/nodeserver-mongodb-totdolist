'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const config = require('./config');
const todoitem = require('./todoitems/todoitem');

require('./db');

app.listen(config.port, config.ip, () => {
    console.log(`Server running at http://${config.ip}:${config.port}`);
});

app.use(express.static('public'));
app.use(bodyParser.json());


app.use('/api/v1', todoitem);

// error handling
app.use((req, res, next) => {
    const err = new Error(`Not Found ${req.path}`);
    err.status = 404;
    next(err);
});
app.use((error, req, res, next) => {
    if (error) {
        console.log(error);
        return res.status(400).json({error});
    }
    next(error);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

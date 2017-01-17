'use strict';

const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema(
    {
        todoItem: String,
        checked: Boolean
    },
    { versionKey: false }
);

module.exports = mongoose.model('todoitem', foodSchema);

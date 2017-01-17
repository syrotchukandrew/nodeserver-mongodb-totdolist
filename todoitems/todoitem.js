'use strict';

const express = require('express');

const TodoItem = require('./model');

const router = express.Router();

router.get('/todoitems', (req, res, next) => {
    TodoItem.find({})
        .then(todoitems => {
            res.json({todoitems});
        })
        .catch(next);
});

router.post('/todoitems', (req, res, next) => {
    new TodoItem(req.body.todoitem)
        .save()
        .then(todoitem => {
            console.log(todoitem);
            res.json({todoitem});
        })
        .catch(next);
});

router.put('/todoitems/:id', function (req, res) {
    return TodoItem.findById(req.params.id, function (err, todoitem) {
        if (!todoitem) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }
        todoitem.todoItem = req.body.todoitem["todoItem"];
        todoitem.checked = req.body.todoitem["checked"];
        return todoitem.save(function (err) {
            if (!err) {
                console.log("todoitem updated");
                return res.send({status: 'OK', todoitem: todoitem});
            } else {
                if (err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({error: 'Validation error'});
                } else {
                    res.statusCode = 500;
                    res.send({error: 'Server error'});
                }
                console.log('Internal error(%d): %s', res.statusCode, err.message);
            }
        });
    });
});


router.delete('/todoitems/:id', (req, res) => {
    return TodoItem.findById(req.params.id, function (err, todoitem) {
        if (!todoitem) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }
        return todoitem.remove(function (err) {
            if (!err) {
                console.log("todoitem removed");
                return res.send({status: 'OK'});
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({error: 'Server error'});
            }
        });
    });
});

module.exports = router;

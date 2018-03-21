const Task = require('../models/task');  
const jwt = require('jsonwebtoken');
const config = require('../config/database');

var async = require('async');
const path = require('path')
var _ = require('underscore');

module.exports = (router) => { 
  
    router.post('/addTask', function (req, res) { 
        let task = new Task({
            "title": req.body.title,
            "task": req.body.task,
            "task_type":  req.body.task_type,
            "task_identifier" : req.body.task_identifier,
            "task_ord_id" : req.body.task_ord_id
        });
 

        task.save((err, task) => {
            if (err) {
                let taskResponse = {
                    success: false,
                    message: " Error occured :" + err
                };
                res.json(taskResponse);
            } else {
                let taskResponse = {
                    success: true,
                    task: task, 
                    message: "Task Save Successful..."
                };
                res.json(taskResponse);
            }
        });
 

    });

   

    //header interceptor below from this code line
    router.use((req, res, next) => {
        const token = req.headers['autherization'];
        if (!token) {
            res.json({
                success: false,
                message: " No Access Token Provided"
            });
        } else {
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    res.json({
                        success: false,
                        message: " Token Invalid: " + err
                    });
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        }
    });

    
    router.get('/allTasks', function (req, res) { 
        Task.find({task_identifier : 'global'}, function (err, tasks) {
            if (err) {
                res.json({
                    success: false,
                    message: " Error occured :" + err
                });
            } else {
                res.json({
                    success: true,
                    tasks: tasks
                });
            }
        });

    });


    return router;
}
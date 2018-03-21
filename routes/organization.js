const Organization = require('../models/organization');
const User = require('../models/user');
const TaskInstance = require('../models/task_instances');
const RoleMapping = require('../models/roleMapping');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

var async = require('async');
const path = require('path')
var _ = require('underscore');

module.exports = (router) => {

    /*router.get('/readEvents', function (req, res) {
        async.waterfall([
            function (callback) {
                readEventsFromExternalFile(callback);
            },
            function (eventArray, callback) {
                getrealtimeDocumentCount(callback, eventArray);
            },
            function (eventCount, eventArray, callback) {
                bulkUpdateEventsDocument(callback, eventCount, eventArray);
            }
        ], function (err, resultMessage) {
            res.json(resultMessage);
        });
    });*/
    /*
        var registerSchoolAdmin = function(adminUser){

            if(!adminUser.admin_email){ 
                return {success : false, message: "E-mail Field is required...!"};
            }else{

                if(!adminUser.admin_username){
                    return {success : false, message: "Username Field is required...!"};
                }else{
                    if(!adminUser.admin_password){
                        return {success : false, message: "Password Field is required...!"};
                    }else{
                        let user = new User({
                            username : adminUser.admin_username.toLowerCase(),
                            email : adminUser.admin_email.toLowerCase(),
                            password : adminUser.admin_password
                        }); 
                        user.save((err, user) => { 
                             
                            if(err){
                                if(err.code === 11000){
                                   return {success : false, message: "Username or Email already exsists"};
                                }else{
                                    if(err.errors){
                                        if(err.errors.email){
                                           return {success : false, message: err.errors.email.message};                                       
                                        }else{
                                            if(err.errors.username){
                                               return {success : false, message: err.errors.username.message};                                       
                                            }else{
                                                if(err.errors.password){
                                                   return {success : false, message: err.errors.password.message};                                       
                                                }else{
                                                   return {success : false, message: err};                                       
                                                }
                                            }
                                        }
                                    }else{
                                       return {success : false, message: "User Is Not Saved...!! Error : "+err};
                                    } 
                                }    
                            } 
                            else {
                               return {success : true, message: "User Saved Successfully...!", user:user};
                            }
                        }); 
                    } 
                } 
            } 
        }
    */

    /*  function saveSchool (message, callback) {
        console.log("save school")
        if(message.success){
            return function (callback) {
                var schoolMessage ={};
                org.save((err, org) => { 
                    if (err) {
                        schoolMessage = {
                            success: false,
                            message: " Error occured :" + err
                        };
                    } else {
                        schoolMessage = {
                            success: true,
                            org: org,
                            message: "Save Successful..."
                        };
                    }
                });

                callback (err, schoolMessage);
             }
        }else{
            return function (callback) {
                var schoolMessage  = {
                    success: false,
                    message: " Error occured :" + err
                };
                callback (err, schoolMessage);
             }
        }
      
    }
*/


    async function registerSchoolAdmin(callback, adminUser, org) {

        if (!adminUser.admin_email) {
            let returnMessage = {
                success: false,
                message: "E-mail Field is required...!"
            };
            callback(null, returnMessage, org);
        } else {

            if (!adminUser.admin_username) {
                let returnMessage = {
                    success: false,
                    message: "Username Field is required...!"
                };
                callback(null, returnMessage, org);
            } else {
                if (!adminUser.admin_password) {
                    let returnMessage = {
                        success: false,
                        message: "Password Field is required...!"
                    };
                    callback(null, returnMessage, org);
                } else {
                    let user = new User({
                        username: adminUser.admin_username.toLowerCase(),
                        email: adminUser.admin_email.toLowerCase(),
                        role: 'admin',
                        password: adminUser.admin_password
                    });
                    user.save((err, user) => {
                        if (err) {
                            if (err.code === 11000) {
                                let returnMessage = {
                                    success: false,
                                    message: "Username or Email already exsists"
                                };
                                callback(null, returnMessage, org);
                            } else {
                                if (err.errors) {
                                    if (err.errors.email) {
                                        let returnMessage = {
                                            success: false,
                                            message: err.errors.email.message
                                        };
                                        callback(null, returnMessage, org);
                                    } else {
                                        if (err.errors.username) {
                                            let returnMessage = {
                                                success: false,
                                                message: err.errors.username.message
                                            };
                                            callback(null, returnMessage, org);
                                        } else {
                                            if (err.errors.password) {
                                                let returnMessage = {
                                                    success: false,
                                                    message: err.errors.password.message
                                                };
                                                callback(null, returnMessage, org);
                                            } else {
                                                let returnMessage = {
                                                    success: false,
                                                    message: err
                                                };
                                                callback(null, returnMessage, org);
                                            }
                                        }
                                    }
                                } else {

                                    let returnMessage = {
                                        success: false,
                                        message: "User Is Not Saved...!! Error : " + err
                                    };
                                    callback(null, returnMessage, org);
                                }
                            }
                        } else {
                            let returnMessage = {
                                success: true,
                                message: "User Saved Successfully...!",
                                user: user
                            };
                            callback(null, returnMessage, org);
                        }
                    });
                }
            }
        }
    }

    async function saveNewSchoolData(callback, returnMessage, org) { 
        if (returnMessage.success) {
            org.admin = returnMessage.user;
            await org.save((err, org) => {
                if (err) {
                    let schoolMessage = {
                        success: false,
                        message: " Error occured :" + err
                    };
                    callback(null, schoolMessage);
                } else {
                    let schoolMessage = {
                        success: true,
                        org: org,
                        user: returnMessage.user,
                        message: "Save Successful..."
                    };
                    callback(null, schoolMessage);
                }
            });
        } else {

            let schoolMessage = {
                success: false,
                message: " Error occured :" + returnMessage.message
            };
            callback(null, schoolMessage);

        }
    }
  
    async function updateRoleMapping(callback, returnMessage) {
        if (returnMessage.success) {

            let roleMapping = new RoleMapping({
                "user_id": returnMessage.user._id,
                "school_id": returnMessage.org._id,
                "role": 'admin',
                "status": 'active'
            });

            await roleMapping.save((err, role_mapping) => {
                if (err) {
                    let schoolMessage = {
                        success: false,
                        message: " Error occured :" + err
                    };
                    callback(null, schoolMessage);
                } else {
                    let schoolMessage = {
                        success: true,
                        org: returnMessage.org,
                        user: returnMessage.user,
                        roleMapping: role_mapping,
                        message: "User Role Successfully Created"
                    };
                    callback(null, schoolMessage);
                }
            });



        } else {

            let schoolMessage = {
                success: false,
                message: " Error occured :" + returnMessage.message
            };
            callback(null, schoolMessage);

        }
    }

    router.post('/addSchool', function (req, res) {
        let org = new Organization({
            "name": req.body.name,
            "description": req.body.description,
            "admin": {
                
            }
        });

        const adminData = {
            "admin_username": req.body.admin_username,
            "admin_password": req.body.admin_password,
            "admin_email": req.body.admin_email
        }

        async.waterfall([ // parrarale processing
            function (callback) {
                registerSchoolAdmin(callback, adminData, org);
            },
            function (schoolMessage, org, callback) {
                saveNewSchoolData(callback, schoolMessage, org);
            },
            function (schoolMessage, callback) {
                updateRoleMapping(callback, schoolMessage);
            },
        ], function (err, resultMessage) {

            if (err) {
                let finalMessage = {
                    success: false,
                    message: " Error occured :" + err
                };
                res.json(finalMessage);
            } else {
                if (resultMessage.success) {
                    res.json(resultMessage);
                } else {

                    res.statusCode = 500;
                    res.json(resultMessage);
                }

            }
        });
    });


    async function registerSchoolUser(callback, adminUser, org_id) {
        
                if (!adminUser.admin_email) {
                    let returnMessage = {
                        success: false,
                        message: "E-mail Field is required...!"
                    };
                    callback(null, returnMessage, org_id);
                } else {
        
                    if (!adminUser.admin_username) {
                        let returnMessage = {
                            success: false,
                            message: "Username Field is required...!"
                        };
                        callback(null, returnMessage, org_id);
                    } else {
                        if (!adminUser.admin_password) {
                            let returnMessage = {
                                success: false,
                                message: "Password Field is required...!"
                            };
                            callback(null, returnMessage, org_id);
                        } else {
                            let user = new User({
                                username: adminUser.admin_username.toLowerCase(),
                                email: adminUser.admin_email.toLowerCase(),
                                role: 'user',
                                password: adminUser.admin_password
                            });
                            user.save((err, user) => {
                                if (err) {
                                    if (err.code === 11000) {
                                        let returnMessage = {
                                            success: false,
                                            message: "Username or Email already exsists"
                                        };
                                        callback(null, returnMessage, org_id);
                                    } else {
                                        if (err.errors) {
                                            if (err.errors.email) {
                                                let returnMessage = {
                                                    success: false,
                                                    message: err.errors.email.message
                                                };
                                                callback(null, returnMessage, org_id);
                                            } else {
                                                if (err.errors.username) {
                                                    let returnMessage = {
                                                        success: false,
                                                        message: err.errors.username.message
                                                    };
                                                    callback(null, returnMessage, org_id);
                                                } else {
                                                    if (err.errors.password) {
                                                        let returnMessage = {
                                                            success: false,
                                                            message: err.errors.password.message
                                                        };
                                                        callback(null, returnMessage, org_id);
                                                    } else {
                                                        let returnMessage = {
                                                            success: false,
                                                            message: err
                                                        };
                                                        callback(null, returnMessage, org_id);
                                                    }
                                                }
                                            }
                                        } else {
        
                                            let returnMessage = {
                                                success: false,
                                                message: "User Is Not Saved...!! Error : " + err
                                            };
                                            callback(null, returnMessage, org_id);
                                        }
                                    }
                                } else {
                                    let returnMessage = {
                                        success: true,
                                        message: "User Saved Successfully...!",
                                        user: user
                                    };
                                    callback(null, returnMessage, org_id);
                                }
                            });
                        }
                    }
                }
        }
    async function updateSchoolData(callback, returnMessage, org_id) {  
        let  schoolMessage = {};
        if (returnMessage.success) {

           let user = returnMessage.user;
         
           await  Organization.findOneAndUpdate({_id: org_id}, {$push: {users: user}},function (err, org) {
            
            if (err) {
                schoolMessage ={
                    success: false,
                    message: " Error occured :" + err
                };
                callback(null, schoolMessage);
            } else {
                schoolMessage = {
                    success: true,
                    org: org,
                    user: user,
                    message: "Updated updated"
                }; 
                callback(null, schoolMessage);
            }
            });
 
           
        } else {

            schoolMessage ={
                success: false,
                message: " Error occured :"+returnMessage.message
            };
            callback(null, schoolMessage);

        }
      

    }
    async function updateGeneralRoleMapping(callback, returnMessage) { 
        if (returnMessage.success) {

            let roleMapping = new RoleMapping({
                "user_id": returnMessage.user._id,
                "school_id": returnMessage.org._id,
                "role": 'user',
                "status": 'active'
            }); 
            await roleMapping.save((err, role_mapping) => {
                if (err) {
                    let schoolMessage = {
                        success: false,
                        message: " Error occured :" + err
                    };
                    callback(null, schoolMessage);
                } else {
                    let schoolMessage = {
                        success: true,
                        org: returnMessage.org,
                        user: returnMessage.user,
                        roleMapping: role_mapping,
                        message: "User Role Successfully Created"
                    };
                    callback(null, schoolMessage);
                }
            });



        } else { 
            let schoolMessage = {
                success: false,
                message: " Error occured :" + returnMessage.message
            };
            callback(null, schoolMessage);

        }
    }


    router.post('/addUser', function (req, res) {
        let org_id = req.body.org_id;

        const userData = {
            "admin_username": req.body.username,
            "admin_password": req.body.password,
            "admin_email": req.body.email
        } 
        async.waterfall([ // parrarale processing
            function (callback) {
                registerSchoolUser(callback, userData, org_id);
            },
            function (schoolMessage, org_id, callback) {
                updateSchoolData(callback, schoolMessage, org_id);
            },
            function (schoolMessage, callback) {
                updateGeneralRoleMapping(callback, schoolMessage);
            },
        ], function (err, resultMessage) {

            if (err) {
                let finalMessage = {
                    success: false,
                    message: " Error occured :" + err
                };
                res.json(finalMessage);
            } else {
                if (resultMessage.success) {
                    res.json(resultMessage);
                } else { 
                    res.statusCode = 500;
                    res.json(resultMessage);
                }

            }
        });


    });


    async function createTaskInstance(callback, taskInstance, org_id, task_id, assignee) {  
    let task_instance = new TaskInstance( { 
            task: {
                title: taskInstance.title,
                task_type : taskInstance.task_type,
                task: taskInstance.task
            }, 
            task_id: task_id,
            task_identifier : taskInstance.task_identifier,
            task_ord_id:  org_id,
            user_id: assignee._id,
            status:"ASSIGNED" 
    } );

    task_instance.save((err, taskInstance) => { 
        if (err) {
            schoolMessage = {
                success: false,
                message: " Error occured :" + err
            };
            callback(null, schoolMessage);
        } else {
            schoolMessage = {
                success: true,
                taskInstance: taskInstance,
                message: "Save Successful..."
            }; 
            callback(null, schoolMessage, org_id, task_id, assignee);
        }
    });
}
 
  async function updateCurrentOrganization(callback, schoolMessage, org_id, task_id, assignee) { 
    Organization.update(
        { _id:  org_id , 'tasks._id': task_id  },
        { $push: { 'tasks.$.assignees' : assignee  } }
      , function(err, org){
          if(err){
            let finalMessage = {
                success: false,
                message: " Err " + err 
            }; 
            callback(null, finalMessage);
          }
        let finalMessage = {
            success: true,
            taskInstance: schoolMessage.taskInstance,
            message: " Assignee Updated - done" 
        }; 
        callback(null, finalMessage);
      });
   
  }
  

    router.post('/assignusers/:org_id/:task_id', function (req, res) { 
        let taskInstance = req.body.selectedTask;
        let org_id = req.params.org_id;
        let task_id = req.params.task_id;
        let assignee = req.body.assignee;


        async.waterfall([ // parrarale processing
            function (callback) {
                createTaskInstance(callback, taskInstance, org_id, task_id, assignee);
            },
            function (schoolMessage, org_id, task_id, assignee, callback) {
                updateCurrentOrganization(callback, schoolMessage, org_id, task_id, assignee);
            },
        ], function (err, resultMessage) {

            if (err) {
                let finalMessage = {
                    success: false,
                    message: " Error occured :" + err
                };
                res.json(finalMessage);
            } else {
                if (resultMessage.success) {
                    res.json(resultMessage);
                } else { 
                    res.statusCode = 500;
                    res.json(resultMessage);
                }

            }
        });













      /*
        Organization.update(
            { _id: req.params.org_id , 'tasks._id': req.params.task_id  },
            { $push: { 'tasks.$.assignees' : { $each: req.body.assignee } } }
          , function(err, org){
              if(err){
                let finalMessage = {
                    success: false,
                    message: " Err " + err 
                };
                res.json(finalMessage);
              }
            let finalMessage = {
                success: true,
                message: " recived " 
            };
            res.json(finalMessage);
          });
*/
 
 

    });



    async function updateOrg(task, req){
        task.task_identifier = 'school';
        task.task_ord_id = req.params.org_id;
        let  message = {};
       await  Organization.findOneAndUpdate({_id: req.params.org_id}, {$push: {tasks: task}},function (err, org) {
        
        if (err) {
            message ={
                success: false,
                message: " Error occured :" + err
            };
        } else {
            message = {
                success: true,
                message: "successfully updated"
            };
        }
        });

        return message;
    }
    
    router.put('/update/:org_id' , function (req, res) {  
        var taskList =req.body;
        let returnMessage={};
        taskList.forEach(task => {
            returnMessage = updateOrg(task, req); 
        });
         
        res.json(returnMessage); 
    });
 
    router.post('/updatetask/:org_id' , function (req, res) {   
        let org_id = req.params.org_id;
        let taskId = req.body._id;
        let newDeadline = req.body.task.deadline; 

        Organization.findOneAndUpdate({ _id: org_id, 'tasks._id' : taskId },{ $set : {'tasks.$.task.deadline': newDeadline}},function (err, response) {
            if(err){
                res.json({
                    success: false,
                    response: "",
                    message: "Error Occured :"+err
                });
            }else{
                res.json({
                    success: true,
                    response: response
                });
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


    router.get('/allSchools', function (req, res) { 
        Organization.find({}, function (err, organizations) {
            if (err) {
                res.json({
                    success: false,
                    message: " Error occured :" + err
                });
            } else {
                res.json({
                    success: true,
                    ogranizations: organizations
                });
            }
        });

    });

    router.get('/schoolByUser/:adminId', function (req, res) {  
        Organization.findOne({
            "admin._id" : req.params.adminId
        }, function (err, organization) {
            if (err) {
                res.json({
                    success: false,
                    message: " Error occured :" + err
                });
            } else {
                res.json({
                    success: true,
                    organization: organization
                });
            }
        });

    });
    
    router.get('/tasksInstancesByUser/:org_id/:user_id', function (req, res) {  
        TaskInstance.find({
            "user_id" : req.params.user_id,
            "task_ord_id" : req.params.org_id
        }, function (err, taskInstances) {
            if (err) {
                res.json({
                    success: false,
                    message: " Error occured :" + err
                });
            } else {
                res.json({
                    success: true,
                    tasks: taskInstances
                });
            }
        }); 
    });

    router.get('/userrole/:user_id', function (req, res) {  
        RoleMapping.findOne({
            "user_id" : req.params.user_id 
        }, function (err, roleMapping) {
            if (err) {
                res.json({
                    success: false,
                    message: " Error occured :" + err
                });
            } else {
                res.json({
                    success: true,
                    roleMapping: roleMapping
                });
            }
        }); 
    });
    return router;
}
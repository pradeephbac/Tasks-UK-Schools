var express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
var path = require('path'); 
var bodyParser = require('body-parser');

//route paths
const authentication = require('./routes/authentication')(router);
const organizations = require('./routes/organization')(router); 

const tasks = require('./routes/task')(router); 
const config = require('./config/database');
 

var cors = require('cors');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) => {
    if (err) {
        console.log('could not connect to db', err);
    } else {
        console.log('connect to db', config.db);
    }
});

app.use(cors({
    origin: "http://localhost:4200"
}))

//set build directory of Angular2 -midelwares
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/client/dist'));

//Api routes
app.use('/authentication', authentication);
app.use('/tasks', tasks);
app.use('/organizations', organizations);
//app.use('/vote', votes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/dist/index.html'));
});

var server_port = 8080;
app.listen(server_port, () => {
    console.log('server starts at port 8080');
});
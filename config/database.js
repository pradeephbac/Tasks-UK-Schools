const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
    uri: "mongodb://admin:password@ds259255.mlab.com:59255/task-for-uk-schools", 
    secret: crypto,
    db: "task-for-uk-schools"
}
const dbOp = require('../Database/DbQueries');
const logger = require('../Log/Logger');
const statuses = require('../Constants/Statuses');
const bcrypt = require('bcrypt');

module.exports = {
    getUsers: function (req, res) {
        let result = new Array();
        let status = 1;
        let statusCode = 200;

        if (req.query.id != null) {
            getUsersById(req.query.id).map((val,key,array)=>{
                result.push({id:val.id, username:val.username});
            });
        } else if (req.query.username != null) {
            if (req.query.username.length >= 3) {
                getUsersByName(req.query.username).map((val,key,array)=>{
                    result.push({id:val.id, username:val.username});
                });
            } else {
                statusCode = 411;
                status = 0;
            }
        } else {
            getUsers().map((val,key,array)=>{
                result.push({id:val.id, username:val.username});
            });
        }
        let response = wrapResponse(result, status);

        logger.logger.info({ query: req.query, body: req.body, response: response });

        res.status(statusCode);
        res.send(response);

    },

    addUser: async function (req, res)  {
        //validation
        if(!validateUserNameFromRequestBody(req.body)){
            res.status(400);
            res.send(wrapResponse(null,statuses.InvalidUserName));
            return;
        }
        if(!validatePasswordFromRequestBody(req.body)){
            res.status(400);
            res.send(wrapResponse(null,statuses.InvalidPassword));
            return;
        }
        let users = getUsersByName(req.body.username);
        if(users != null && users.length > 0){
            res.status(409);
            res.send(wrapResponse(null,statuses.UsernameAlreadyExists));
            return;
        }

        //hash password
        let datebefore = Date.now();
        let hashResult = await bcrypt.hash(req.body.password, 10);
        logger.logger.info('Hash password generated in '+((Date.now())-datebefore)+'ms.');

        //save in db
        createUser(req.body.username, hashResult);

        //retrieve id
        let checkUser = getUsersByName(req.body.username);

        if(checkUser.length > 0){
            res.status(201);
            res.send(wrapResponse({id: checkUser[0].id},statuses.OK));
        }else{
            res.statues(500);
            res.send(wrapResponse(null,statuses.UserCreationFailed));
        }
    },

    checkUser: async function(req,res){
        //validation
        if(!validateUserNameFromRequestBody(req.body)){
            res.status(400);
            res.send(wrapResponse(null,statuses.InvalidUserName));
            return;
        }
        if(!validatePasswordFromRequestBody(req.body)){
            res.status(400);
            res.send(wrapResponse(null,statuses.InvalidPassword));
            return;
        }

        //get user
        let userList = getUsersByName(req.body.username);

        if(userList == null || userList.length != 1){
            res.status(400);
            res.send(wrapResponse(null,statuses.InvalidUserName));
            return;
        }

        //check password
        let user = userList[0];
        let compareResult = await bcrypt.compare(req.body.password ,user.password);

        if(compareResult){
            //get token
            let token = dbOp.grantTokenToUser(user.id);

            res.status(200);
            res.send(wrapResponse({id: user.id, allowed: true, token: token}, statuses.OK));
        }else{
            res.status(401);
            res.send(wrapResponse({id: null, allowed: false}, statuses.InvalidPassword));
        }

    }

}

function createUser(username, hash){
    return dbOp.createUser(username,hash);
}

function getUsersById(id) {
    return dbOp.getUsersById(id);
}

function getUsers() {
    return dbOp.getUsers();
}

function getUsersByName(name) {
    return dbOp.getUsersByName(name);
}

function validateUserNameFromRequestBody(body) {
    if (body != null && body.username != null && body.username.length >= 3) {
        return true;
    }
    return false;
}

function validatePasswordFromRequestBody(body) {
    if (body != null && body.password != null && body.password.length >= 6) {
        return true;
    }
    return false;
}

function wrapResponse(result, status) {
    return { status: status, data: result };
}

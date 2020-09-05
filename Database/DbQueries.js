module.exports = {
    getUsers : function(){
        const dbOp = require('./DbOperations');
        var retVal = dbOp.select(['id','username','password'], 'users');
    
        return retVal;
    },

    getUsersById : function(id){
        const dbOp = require('./DbOperations');
        var retVal = dbOp.selectWhere(['id', 'username','password'], 'users', 'id = '+id);

        return retVal;
    },

    getUsersByName : function(name){
        const dbOp = require('./DbOperations');
        var retVal = dbOp.selectWhere(['id', 'username','password'], 'users', "username like '%"+name+"%'");

        return retVal;
    },

    getUserByToken: function(token, callback){
        const dbOp = require('./DbOperations');
        dbOp.wrapper.select({table: 'tokens', fields: ['userid'], where: {token: token, validity: 1}, limit:1},
        function(err, rows) {
            if(!rows || rows.length == 0){
                callback(false);
            }else{
                dbOp.wrapper.select({table: 'users', fields:['id','username'], where: {id: rows[0].userid}},
                function(err, rows) {
                    callback(rows[0]);
                });
            }
        });
    },

    createUser : function(name, hash){
        const dbOp = require('./DbOperations');
        let map = new Map();
        map.set('username', name);
        map.set('password',hash);

        var retVal = dbOp.insertIntoTable('users',map);

        return retVal;
    },

    getTokenByUserId: function(id){

        const dbOp = require('./DbOperations');
        let tokenResult = dbOp.selectWhere(['token'],'tokens','WHERE userid = '+id);

        if(tokenResult == null || tokenResult.length != 1){
            return null;
        }else{
            return tokenResult[0].token;
        }
    },

    isTokenValid: function(token, callback){
        const dbOp = require('./DbOperations');
        dbOp.wrapper.select({table: 'tokens', fields: ['token', 'validity'], where: {token: token, validity: 1}}, function(err, rows) {
            if(rows.length > 0){
                callback(true);
            } else {
                callback(false);
            }
        });
    },

    grantTokenToUser: function(id){
        let token;
        const dbOp = require('./DbOperations');
        let tokenResult = dbOp.selectWhere(['token', 'validity'],'tokens',' WHERE userid = '+id);

        if(tokenResult == null || tokenResult.length == 0){
            let map = new Map();
            token = generateGuidToken();
            map.set('userid',id);
            map.set('token', token);
            map.set('validity', 1);

            dbOp.insertIntoTable('tokens',map);
        }else{
            token = generateGuidToken();
            let map = new Map();
            map.set('validity',1);
            map.set('token',token);
            dbOp.updateWhere('tokens',map,' WHERE userid = '+id);
        }

        return token;
    },

    retrievePosts: function(maxNumber, callback){
        const dbOp = require('./DbOperations');
        dbOp.wrapper.select("select posts.id, posts.text as text, posts.postedAt as postedAt, users.username as username, count(comments.postid) as countofComments from posts left join comments on posts.id = comments.postid inner join users on posts.userid = users.id group by posts.id order by posts.postedAt desc limit "+maxNumber,
        function(err, posts) {
            if(err){
                console.log(err);
            }
            callback(posts);
        });
    },

    createPost: function(userid, text, callback){
        const dbOp = require('./DbOperations');
        let now = Date.now();
        dbOp.wrapper.insert('posts', {userid: userid, text: text, postedAt: now}, function(err, id) {
            if(id == 0){
                callback(false);
            }else{
                callback(true);
            }
        });
    }
}

function generateGuidToken(){
    var uuidv4 = require('uuid');
    return uuidv4.v4();
}
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
    }
}

function generateGuidToken(){
    var uuidv4 = require('uuid');
    return uuidv4.v4();
}
const query = require('../../Database/DbQueries');

const Authorization = {
    authorize : function(req, res, next){
        //get the token
        let token = req.get('token');
        if(token == undefined){
            sendForbidden(res);
            return;
        }

        //retrieves the token from db
        query.isTokenValid(token, function(validity) {
            if(validity){
                next();
            }else{
                sendForbidden(res);
            }
        });
    }
}

function sendForbidden(res){
    res.status(403).send('Not permitted');
}

module.exports = Authorization;
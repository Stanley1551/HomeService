const query = require('../../Database/DbQueries');
const statuses = require('../../Constants/Statuses');

module.exports = {
    getDashboard: function(req, res, next){
        let max = req.query.max;
        if(max == undefined){
            max = 20;
        }
        query.retrievePosts(max, function(posts){
            res.send(wrapResponse(posts, 1));
        });
    },
    getPost: function(req,res){

    },

    addPost: function(req,res){
        //validation
        let body = req.body;
        if(!body.text){
            res.send(wrapResponse('Malformed request body', statuses.InvalidPostCreation));
            return;
        }

        //get user
        query.getUserByToken(req.get('token'), function(user){
            if(user){
                query.createPost(user.id, body.text, function(result) {
                    if(result){
                        res.send(wrapResponse('OK', statuses.OK));
                    }else{
                        res.send(wrapResponse('Failed to create post', statuses.FailedToCreatePost))
                    }
                });
            }else{
                res.send(wrapResponse('Failed to create post', statuses.FailedToCreatePost));
            }
        });
    },
}

function wrapResponse(result, status) {
    return { status: status, data: result };
}
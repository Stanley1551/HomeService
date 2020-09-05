const query = require('../../Database/DbQueries');

module.exports = {
    getDashboard: function(req, res){
        const max = req.query.max;
        if(max == undefined){
            max = 20;
        }
        const posts = query.retrievePosts(max);
    },
    getPost: function(req,res){

    },

    addPost: function(req,res){

    },
}
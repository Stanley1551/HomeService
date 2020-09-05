const dbOp = require('./DbOperations');

const users = {name : 'users', columns : [
    {colName : 'id', type : 'INTEGER PRIMARY KEY AUTOINCREMENT'},
    {colName : 'username', type: 'TEXT'},
    {colName : 'password', type : 'TEXT'},
]};
const tokens = {name: 'tokens', columns: [
    {colName : 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT'},
    {colName : 'userid', type: 'INTEGER'},
    {colName : 'token', type: 'TEXT'},
    {colName : 'validity', type: 'INTEGER'},
]};
const posts = {name: 'posts', columns : [
    {colName: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT'},
    {colName: 'userid', type: 'INTEGER'},
    {colName: 'text', type: 'TEXT'},
    {colName: 'postedAt', type:'TEXT'},
]};
const comments = {name: 'comments', columns: [
    {colName: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT'},
    {colName: 'userid', type: 'INTEGER'},
    {colName: 'postid', type: 'INTEGER'},
    {colName: 'text', type:'TEXT'},
    {colName: 'commentedAt', type:'TEXT'},
]};


module.exports = {
    initState : function(){
        dbOp.createTable(users);
        dbOp.createTable(tokens);
        dbOp.createTable(posts);
        dbOp.createTable(comments);
        dbOp.pragma('journal_mode = WAL');
    }
}

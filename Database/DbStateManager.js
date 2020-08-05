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


module.exports = {
    initState : function(){
        dbOp.createTable(users);
        dbOp.createTable(tokens);
        dbOp.pragma('journal_mode = WAL');
    }
}

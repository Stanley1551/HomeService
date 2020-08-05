const db = require('better-sqlite3')('db.db');

module.exports = {
    /*tableExists : function(name) {
        const cmd = db.prepare('SELECT name FROM sqlite_master WHERE type=\'table\' AND name=?;');

        const result = cmd.get(name);

        return result.
    }*/

    createTable: function (tableDef) {

        var cmdText = constructCreateTableCmd(tableDef);
        executeCommand(cmdText);
    },

    select: function (columns, tableName) {

        var cmdText = constructSelectCmd(columns, tableName);
        return retrieveCommand(cmdText);
    },

    selectWhere: function (columns, tableName, whereExpression) {
        var cmdText = constructSelectWhereCmd(columns, tableName, whereExpression);
        return retrieveCommand(cmdText);
    },

    insertIntoTable: function(table, map){
        var cmdText = constructInsertIntoCommand(table,map);

        return runCommand(cmdText);
    },

    pragma: function(option){
        pragma(option);
    },

    updateWhere: function(table,map,whereExpression){
        var cmdText = constructUpdateWhereCommand(table,map,whereExpression);

        return runCommand(cmdText);
    }
}

function pragma(option){
    db.pragma(option);
}

function executeCommand(cmdText) {
    const retVal = db.exec(cmdText);

    return retVal;
}

function retrieveCommand(cmdText) {
    const cmd = db.prepare(cmdText);

    const retVal = cmd.all();

    return retVal;
}

function runCommand(cmdText) {
    const cmd = db.prepare(cmdText);
    
    const retVal = cmd.run();

    return retVal;
}

function constructUpdateWhereCommand(table,map, whereExpression){
    let retVal = 'UPDATE '+table+' SET ';
    for(let [key, value] of map){
        retVal += (key +'='+"'"+value+"',");
    }
    retVal = retVal.replace(/.$/," ");

    if(whereExpression.search('WHERE') == -1){
        retVal += 'WHERE ' + whereExpression;
    }
    else{
        retVal += whereExpression;
    }

    return retVal;
}

function constructInsertIntoCommand(tablename, map){
    let retVal = 'INSERT INTO ' + tablename+' ';
    let columns = '(';
    let values = ' values(';
    map.forEach(function(value, key, array){
        columns+=key+',';
        values+="'"+value+"'"+',';
    });

    columns = columns.replace(/.$/,")");
    values = values.replace(/.$/,")");

    retVal += columns += values;

    return retVal;
}

function constructCreateTableCmd(tableDef) {
    var retVal = 'CREATE TABLE IF NOT EXISTS ' + tableDef.name;
    var colDefs = '(';
    for (var i = 0; i < tableDef.columns.length; i++) {
        colDefs += tableDef.columns[i].colName + ' ' + tableDef.columns[i].type;
        if (i != tableDef.columns.length - 1) {
            colDefs += ',';
        }
    }
    colDefs += ')';
    retVal += colDefs;

    return retVal;
}

function constructSelectCmd(columns, tableName) {
    var cmd = 'SELECT ';
    for (var i = 0; i < columns.length; i++) {
        cmd += columns[i];

        if (i != columns.length - 1) {
            cmd += ',';
        }
    }

    cmd += ' FROM ' + tableName;

    return cmd;
}

function constructSelectWhereCmd(columns, tableName, whereExpression) {
    var select = constructSelectCmd(columns, tableName);

    if(whereExpression.search('WHERE') == -1){
        select += ' WHERE ' + whereExpression;
    }
    else{
        select += whereExpression;
    }

    return select;

}
var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();

exports.handler = async (event) => {
  try {
    // List All existing tables
    let tableNames = await this.listTables();
    if (tableNames) {
      await this.createBackupAll(tableNames);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.listTables = async () => {
  try {
    var params = {};
    let tablesList = await dynamodb.listTables(params).promise();
    if (tablesList.TableNames.length > 0) {
      return tablesList.TableNames;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.createBackupAll = async (tableNames) => {
  let requests = [];
  try {
    tableNames.forEach(table => {
      requests.push(this.createBackup(table));
    });

    await Promise.all(requests);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.createBackup = async (table) => {
  let date = new Date();
  let timestamp = date.getTime();
  let backupName = `${table}-${timestamp}`;
  try {
    let params = {
      BackupName: backupName,
      TableName: table
    };
    await dynamodb.createBackup(params).promise();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

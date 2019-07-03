var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB();
const daysToRetain = process.env.DAYS_RETAIN;

exports.handler = async (event) => {
  try {
    let backups = await this.listAllBackups();
    if (backups === null || backups === undefined || backups.length <= 0) {
      // Do nothing
    } else {
      await this.deleteBackupAll(backups);
    }
  } catch (error) {
    console.log(error);
  }
};

exports.listAllBackups = async () => {
  let date = new Date();
  let timestamp = date.getTime(); // ms
  let daysToDeduct = parseInt(daysToRetain) * 86400000; // ms
  timestamp = (timestamp - daysToDeduct) / 1000; // DynamoDB takes Timestamp in s

  try {
    let params = {
      BackupType: 'ALL',
      TimeRangeUpperBound: timestamp // Return only backups which were created before the number of days to retain
    };

    let backupList = await dynamodb.listBackups(params).promise();
    return backupList.BackupSummaries.map(table => {
      return table.BackupArn;
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.deleteBackupAll = async (backupArnList) => {
  let requests = [];
  try {
    backupArnList.forEach(backupArn => {
      requests.push(this.deleteBackup(backupArn));
    });

    await Promise.all(requests);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

exports.deleteBackup = async (backupArn) => {
  try {
    var params = {
      BackupArn: backupArn
    };
    await dynamodb.deleteBackup(params).promise();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

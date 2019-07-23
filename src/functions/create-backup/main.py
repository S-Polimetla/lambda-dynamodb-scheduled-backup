import datetime
import json
import boto3
client = boto3.client('dynamodb')

def handler(event, context):
    tableInfo = client.list_tables()
    if(len(tableInfo.get('TableNames')) <= 0):
        return
    else:
        timestamp = datetime.datetime.now().strftime("%Y-%m-%dT%H-%M-%S")        
        for table in tableInfo.get('TableNames'):            
            client.create_backup(
                TableName = table,
                BackupName = table + '-' + timestamp
            )


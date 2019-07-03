# backup-service
A simple application to take daily backup of all the available DynamoDB tables

## Cron Jobs
`ScheduleExpression: "cron(1 0 * * ? *)"`

ScheduleExpression defines the time and frequency to run the lambda function which is attached as a Target to it.

## Creation
A lambda function is run every day at 00.01 to create backup all the existing tables. 

## Retention
The backups are kept for 90 days in this example. This can be configured by the config file. 

A lambda function is run every day also at 00.01 to list all the backups which are over 90 days old and these backups will be deleted. 

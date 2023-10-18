'use strict';

const chance = require('chance').Chance();

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

// SQS dependencies
const { SendMessageCommand, SQSClient } =  require("@aws-sdk/client-sqs");

const sqsClient = new SQSClient({});
const SQS_QUEUE_URL = "https://sqs.us-west-2.amazonaws.com/067714926294/liveAuction";

exports.handler = async (event) => {

const timestamp = new Date(Date.now()).toLocaleString('en-us');


/*
{
  "id":"guid-abcd-1234-5678",
  "category": "Collectible",
  "createdBy": "a_user@gmail.com",
  "dateAdded": "10/1/2023",
  "dateSold": "10/16/2023",
  "description": "A slightly-used test item",
  "itemName": "Test Item",
  "status": "Approved",
  "itemType": "Rare Item",
  "winningBid": "1000000",
  "wonBy": "some_other_user@gmail.com"
}
*/
  const newAuction = {
    'id' : chance.guid(),
    'category' : event.category || '',
    'createdBy': event.createdBy || '',
    'dateAdded': timestamp,
    'dateSold': '', // event.dateSold 
    'description': event.description || '',
    'itemName': event.itemName || '',
    'status': 'Approved', // event.status,
    'itemType': event.itemType || '',
    'winningBid': '0', // parseInt(event.winningBid)
    'wonBy': '', // event.wonBy,
  };

/*
  Add item to "auctions" DynamoDB model.
*/
  const command = new PutCommand({
    TableName: 'auctions',
    Item: newAuction,
  });
  
  const result = await docClient.send(command);

/*
SQS Code. Add new Auction item to "liveAuction" Queue.
*/
const sqsCommand = new SendMessageCommand({
  QueueUrl: SQS_QUEUE_URL,
  DelaySeconds: 10,
  MessageAttributes: {
    "Title": {
      DataType: "String",
      StringValue: "Auction",
    },
  },
  MessageBody: await JSON.stringify(newAuction),
});

  const sqsResponse = await sqsClient.send(sqsCommand);
//console.log(response);

  const response = {
    statusCode: 201,
    body: JSON.stringify(newAuction),
  };
  return response;
};
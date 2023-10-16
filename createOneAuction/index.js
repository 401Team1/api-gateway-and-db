'use strict';

const chance = require('chance').Chance();

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { PutCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {

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
    'category' : event.category,
    'createdBy': event.createdBy,
    'dateAdded': Date.now(),
    'dateSold': '', // event.dateSold 
    'description': event.description,
    'itemName': event.itemName,
    'status': 'Approved', // event.status,
    'itemType': event.itemType,
    'winningBid': '0', // parseInt(event.winningBid)
    'wonBy': '', // event.wonBy,
  };

  const command = new PutCommand({
    TableName: 'auctions',
    Item: newAuction,
  });
  
  const result = await docClient.send(command);

  const response = {
    statusCode: 201,
    body: JSON.stringify(newAuction),
  };
  return response;
};
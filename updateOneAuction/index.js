'use strict';

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { UpdateCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  let response = {}

  if ( event.status === undefined ) {
    response = {
      statusCode: 500,
      body: { "error": "Not enough information to complete update." },
    };
  }

  let updateExpression = "set "

  const eventBody = await JSON.parse(event.body);

  const id = eventBody.id;
  const auctionStatus = eventBody.auctionStatus;
  const wonBy = eventBody.wonBy;
  const winningBid = eventBody.winningBid;

  const updateValues = {};

  if ( auctionStatus ) {
    updateExpression = updateExpression + 'auctionStatus = :auctionStatus ';
    updateValues[':auctionStatus'] = auctionStatus
  };
  
  if ( wonBy ) {
    const timestamp = new Date(Date.now()).toLocaleString('en-us', { timeZone: 'America/Los_Angeles' });

    updateExpression = updateExpression + ', wonBy = :wonBy ';
    updateValues[':wonBy'] = wonBy

    updateExpression = updateExpression + ', winningBid = :winningBid ';
    updateValues[':winningBid'] = parseInt(winningBid)

    updateExpression = updateExpression + ', dateSold = :dateSold ';
    updateValues[':dateSold'] = timestamp
  };
  
  updateExpression = updateExpression.replace(/set \,/, 'set ');

  console.log(updateExpression);

  const command = new UpdateCommand({
    TableName: "auctions",
    Key: {
      id: id,
    },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: updateValues,
    ReturnValues: "ALL_NEW",
  });
  
  const result = await docClient.send(command);

  response = {
    statusCode: 200,
    body: JSON.stringify(result),
  };
  return response;
};
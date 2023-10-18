const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({});

exports.handler = async (event) => {

  const command = new ScanCommand({
    TableName: "auctions",
  });

  const result = await client.send(command);

  const response = {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
  return response;
};

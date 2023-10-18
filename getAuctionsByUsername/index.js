const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({});

exports.handler = async (event) => {
  const command = new ScanCommand({
    FilterExpression: "createdBy = :createdBy",
    // For more information about data types,
    // see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes and
    // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html#Programming.LowLevelAPI.DataTypeDescriptors
    ExpressionAttributeValues: {
      ":createdBy": { S: event.pathParameters.username },
  },
    TableName: "auctions",
  });

  const result = await client.send(command);
  
  const response = {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
  return response;
};
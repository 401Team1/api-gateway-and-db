# api-gateway-and-db
API/Lambda Code for receiving auction items and updating the db

# Requirements
aws-sdk chance jest @aws-sdk/lib-dynamodb @aws-sdk/client-dynamodb @aws-sdk/client-sqs

# Routes

- POST
-- /auctions  **createOneAuction:** Adds item to Auctions queue, and to the db with status "Approved".

# JSON/DB Model
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

## TO_DO:
create getAllAuctions
lambdas for closing auction/update wonBy


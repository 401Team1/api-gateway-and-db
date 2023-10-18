# api-gateway-and-db
API/Lambda Code for sending and receiving auction items and updating the db

# Requirements
aws-sdk chance jest @aws-sdk/lib-dynamodb @aws-sdk/client-dynamodb @aws-sdk/client-sqs

# Routes

## GET
- **/auctions** Get all auctions in the db
- **/auctions/{username}** Get all auctions in the db for a given username

## POST
- **/auctions**  Adds item to liveAuction queue, and creates record in the db with status "Approved".

## PATCH
- **auctions/** Update an Auction - to change status to "live", "not sold", "sold" (and set wonBy, winningBid, dateSold if won.)
NOTE: id, status, wonBy, winningBid are passed in event.body.

## JSON/DB Model
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



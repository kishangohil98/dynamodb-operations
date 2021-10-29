import { DynamoDB } from 'aws-sdk';

let dynamoDb: DynamoDB;

export const getDynamoDb = (): DynamoDB => {
    if(dynamoDb) {
        return dynamoDb;
    }
    console.log("process.env.AWS_REGION", process.env.AWS_REGION)
    dynamoDb = new DynamoDB({
        httpOptions: {
            connectTimeout: 1000,
            timeout: 1000
        },
        accessKeyId: process.env.AWS_ACCESSKEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
        region: process.env.AWS_REGION,
        endpoint: process.env.AWS_ENDPOINT, // http://localhost:8000
    })
    return dynamoDb;
}
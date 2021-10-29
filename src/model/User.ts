 import { getDynamoDb } from '../dynamoDb';
import { DynamoDB } from 'aws-sdk'

export class User {
    userId: string
    username: string
    category: string

    constructor(userId: string, username: string, category: string) {
        this.userId = userId;
        this.username = username;
        this.category = category;
    }

    get PK(): string {
        return `USER#${this.userId}`
    }

    get SK(): string {
        return `USER#${this.userId}`
    }

    toItem(): DynamoDB.ItemCollectionKeyAttributeMap {
        return {
            PK: {
                S: this.PK
            },
            SK: {
                S: this.SK
            },
            userId: { S: this.userId },
            username: { S: this.username },
            category: { S: this.category }
        }
    }
}

export const createUser = async (user: User) => {
    const client: DynamoDB = getDynamoDb();

    const putItemInput :DynamoDB.PutItemInput = {
        TableName: process.env.TABLE_NAME!,
        Item: user.toItem(),
    }

    await client.putItem(putItemInput).promise();
    return user.toItem();
}

export const getUsers = async () => {
    const client: DynamoDB = getDynamoDb();

    const users = await client.scan({
        TableName: process.env.TABLE_NAME!,
        ReturnConsumedCapacity: 'TOTAL'
    }).promise();

    return users;
}

export const getUserByUsername = async (username: string) => {
    const client: DynamoDB = getDynamoDb();

    const getItemInput :DynamoDB.DocumentClient.ScanInput = {
        TableName: process.env.TABLE_NAME!,
        FilterExpression: "username = :usernameValue",
        ExpressionAttributeValues: {
            ":usernameValue": {
                S: username
            }
        }
    }
    return client.scan(getItemInput).promise();
}

export const getUserById = async (userId: string) => {
    const client: DynamoDB = getDynamoDb();

    console.log("userId", userId);
    const getItemInput :DynamoDB.DocumentClient.QueryInput= {
        TableName: process.env.TABLE_NAME!,
        KeyConditionExpression: 'PK = :userId',
        ExpressionAttributeValues: {
            ':userId': {
                S: `USER#${userId}`
            }
        },
        ReturnConsumedCapacity: 'TOTAL'
    };
    return client.query(getItemInput).promise();
}
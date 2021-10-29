import { IRouter, Router, Request, Response } from 'express';
import { getDynamoDb } from '../dynamoDb'
import { DynamoDB } from 'aws-sdk'

export const router: IRouter = Router();

const client: DynamoDB = getDynamoDb();
const url: string = '/table'

router.post(url, async (req: Request, res: Response) => {
    try {
        const createYableInput: DynamoDB.CreateTableInput = {
            TableName: process.env.TABLE_NAME!,
            KeySchema: [
                {
                    AttributeName: 'PK',
                    KeyType: 'HASH'
                },
                {
                    AttributeName: 'SK',
                    KeyType: 'RANGE'
                }
            ],
            AttributeDefinitions: [
                {
                    AttributeName: 'PK',
                    AttributeType: 'S'
                },
                {
                    AttributeName: 'SK',
                    AttributeType: 'S'
                },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1
            }
        };
        const createTableResponse: DynamoDB.CreateTableOutput = await client.createTable(createYableInput).promise();
        console.log("createTableResponse", createTableResponse);
        res.status(200).json({
            message: 'Table created succesfully'
        });
        
    } catch (error :any) {
        console.error(error);
        if(error.statusCode === 400 && error.code === 'ResourceInUseException'){
            res.status(400).json({
                message: 'Table already exists'
            });
        }
        res.status(500).json({
            error
        });
    }
});

router.delete(url, async (req: Request, res: Response) => {
    try {
        // Request validation
        if(!req.body.tableName){
            res.status(400).json({
                message: 'Table name is required'
            });
        }

        const deleteTableInput: DynamoDB.DeleteTableInput = {
            TableName: req.body.tableName
        }

        const deleteTableResponse: DynamoDB.DeleteTableOutput = await client.deleteTable(deleteTableInput).promise();
        res.status(200).json({
            message: 'Table deleted succesfully'
        });
    } catch (error :any) {
        console.error(error);
        if(error.statusCode === 400 && error.code === 'ResourceNotFoundException'){
            res.status(400).json({
                message: 'Table not found'
            });
        }
        res.status(500).json({
            error
        });
    }
});
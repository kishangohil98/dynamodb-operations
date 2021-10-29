import { IRouter, Router, Request, Response } from 'express';
import { getDynamoDb } from '../dynamoDb'
import { DynamoDB } from 'aws-sdk'
import { User, createUser, getUsers, getUserByUsername, getUserById, searchByCategory, updateUser, deleteUser } from '../model/User'
import  { v4 as uuid } from 'uuid';

export const router: IRouter = Router();

const client: DynamoDB = getDynamoDb();
const url: string = '/user'

router.post(url, async (req: Request, res: Response) => {
    // TODO: Request validation
    try {
        const { username, category } = req.body;
        const user = new User(uuid(), username, category);

        const userResponse = await createUser(user);

        res.status(200).json({
            data: userResponse
        });

    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            error
        })
    }
});

router.get(url, async (req: Request, res: Response) => {
    try {
        const users = await getUsers();
        
        res.status(200).json({
            data: users
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            error
        })
    }
});

router.get(`${url}/:username`, async (req: Request, res: Response) => {
    try {

        const users = await getUserByUsername(req.params.username);
        
        res.status(200).json({
            data: users
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            error
        })
    }
});

router.get(`${url}/userId/:userId`, async (req: Request, res: Response) => {
    try {

        const users = await getUserById(req.params.userId);
        res.status(200).json({
            data: users
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            error
        })
    }
});

router.get(`${url}/category/:category`, async (req: Request, res: Response) => {
    try {

        const users = await searchByCategory(req.params.category);

        res.status(200).json({
            data: users
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            error
        })
    }
});

router.put(`${url}/:userId`, async (req: Request, res: Response) => {
    try {
        // TODO: Request validation
        const { username, category } = req.body;
        const users = await updateUser({
            category,
            username,
            userId: req.params.userId
        });

        res.status(200).json({
            data: users
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            error
        })
    }
});

router.delete(`${url}/:userId`, async (req: Request, res: Response) => {
    try {
        const users = await deleteUser(req.params.userId);

        res.status(200).json({
            data: users
        });
    } catch (error: any) {
        console.log(error);
        res.status(500).json({
            error
        })
    }
});
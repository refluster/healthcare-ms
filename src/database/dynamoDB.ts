import { AttributeValue, BatchWriteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand, QueryCommandInput, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user';
//import { CreateIssueParams, GithubIssue, createIssue, getIssue, updateIssue } from '../lib/github';

const client = new DynamoDBClient({ region: 'us-west-2' });
const dynamoDB = DynamoDBDocumentClient.from(client);
const tableName = 'healhcare-user';

export const createUsers = async (usersInput: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<User[]> => {
    const currentUtcIso8601 = new Date().toISOString();
    const users: User[] = usersInput.map(userInput => {
        const newUser = {
            ...userInput,
            id: uuidv4(),
            createdAt: currentUtcIso8601,
            updatedAt: currentUtcIso8601,
        };
        return newUser;
    })

    const ddbParams = users.map(user => ({
        TableName: tableName,
        Item: user,
    }));
    const ddbPutPromise = ddbParams.map(ddbParam => dynamoDB.send(new PutCommand(ddbParam)));
    const ret = await Promise.all(ddbPutPromise);
    return users;
};

export const queryUsers = async ({ id }: { id?: string }): Promise<User[]> => {
    const params = {
        TableName: tableName,
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: { ":id": id },
    };
    try {
        const { Items } = await client.send(new QueryCommand(params));
        if (!Items) {
            throw new Error('Failed to query items from DynamoDB');
        }
        const users = Items as User[];
        return users;
    } catch (error: any) {
        console.log("DynamoDB query error:", error.message);
        throw error.message;
    }
};

export const updateUsers = async (usersInput: User[]): Promise<User[]> => {
/*
    // query the specified works
    // create github issue for the qualified works
    // update works db w/ github issue referrence info
    const preWorks_arr = await Promise.all(worksInput.map(workInput => queryWorks({ id: workInput.id })));
    const preWorks = preWorks_arr.flat();

    const githubParamss = await works2githubParams(worksInput);

    const works4GithubUpdate: (Work | undefined)[] = worksInput.map(workInput => {
        const preWork = preWorks.find(w => w.id === workInput.id);
        if (workInput.type !== 'task' || preWork === undefined) {
            return undefined;
        }
        if (!preWork.githubIssueNo && workInput.status === 'qualified') {
            return workInput;
        } else {
            return undefined;
        }
    });
    console.log('work4GithubUpdate', JSON.stringify(works4GithubUpdate));
    const createIssuesPromise = zip(works4GithubUpdate, githubParamss).map(([work, githubParams]) => {
        if (!work || !githubParams) {
            return undefined;
        }
        const params: CreateIssueParams = {
            title: work.name,
            body: work.description,
            labels: [],
        };
        return createIssue(githubParams, params);
    });
    const issues: (GithubIssue | undefined)[] = await Promise.all(createIssuesPromise);
    console.log('issues', JSON.stringify(issues));

    const currentUtcIso8601 = new Date().toISOString();
    const newWorks = zip(preWorks, issues).map(([preWork, issue]) => {
        const workInput = <Work>worksInput.find(w => w.id === preWork.id);
        const newWork = {
            ...preWork,
            ...workInput,
            ... {
                githubIssueNo: issue?.number,
                updatedAt: currentUtcIso8601,
            }
        }
        return newWork;
    });

    const updateParams = newWorks.map(work => {
        const updateExpression: string[] = [];
        const expressionAttributeNames: { [key: string]: string } = {};
        const expressionAttributeValues: { [key: string]: any } = {};
        for (const key in work) {
            const workKey = key as keyof Work;
            if (workKey !== 'id' && work[workKey]) {
                updateExpression.push(`#${workKey} = :${workKey}`);
                expressionAttributeNames[`#${workKey}`] = workKey;
                expressionAttributeValues[`:${workKey}`] = work[workKey];
            }
        }
        const params = {
            TableName: tableName,
            Key: { id: work.id },
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'ALL_NEW' as const,
        };
        return params;
    });
    const updatePromises = updateParams.map(params => {
        return client.send(new UpdateCommand(params));
    });
    await Promise.all(updatePromises);
    return newWorks;
    */
   return [];
};

export const deleteUsers = async (ids: string[]): Promise<string[]> => {
/*
    const preWorks_arr = await Promise.all(ids.map(id => queryWorks({ id: id })));
    const preWorks = preWorks_arr.flat();

    const githubParamss = await works2githubParams(preWorks);

    const closeGithubIssuesPromise = zip(preWorks, githubParamss)
        .filter(([work, github]) => work.githubIssueNo && github)
        .map(([work, github]) => github && updateIssue(github, {
            issue_number: work.githubIssueNo!,
            state: 'closed',
            title: undefined,
            body: undefined,
            labels: undefined,
        }));
    await Promise.all(closeGithubIssuesPromise);

    const deleteParams = ids.map(id => ({
        TableName: tableName,
        Key: { id },
    }));
    const deletePromise = deleteParams.map(async (params) => {
        const { Attributes } = await client.send(new DeleteCommand(params));
        if (Attributes) {
            return params.Key.id;
        } else {
            undefined;
        }
    });
    try {
        const ret = await Promise.all(deletePromise);
        const deletedIds = <string[]>ret.filter(d => d !== undefined);
        return deletedIds;
    } catch {
        return [];
    }
    */
   return [];
};

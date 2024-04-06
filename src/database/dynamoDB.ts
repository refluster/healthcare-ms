import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand, UpdateCommand, DeleteCommand, QueryCommandInput, QueryCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../models/user';
import { Journal } from '../models/journal';
import { DailyStat } from '../models/daily';
import { endOfDay, format, startOfDay } from 'date-fns';

const client = new DynamoDBClient({ region: 'us-west-2' });
const dynamoDB = DynamoDBDocumentClient.from(client);
const UsertableName = 'healhcare-user';
const JournalTableName = 'healhcare-journal';
const dailyStatsTableName = 'healhcare-daily-stats';

export const createJournals = async (itemsInput: Omit<Journal, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<Journal[]> => {
    const tableName = JournalTableName;
    const currentUtcIso8601 = new Date().toISOString();
    const items: Journal[] = itemsInput.map(itemInput => {
        const newItem = {
            ...itemInput,
            id: uuidv4(),
            createdAt: currentUtcIso8601,
            updatedAt: currentUtcIso8601,
        };
        return newItem;
    })

    const ddbParams = items.map(item => ({
        TableName: tableName,
        Item: item,
    }));
    const ddbPutPromise = ddbParams.map(ddbParam => dynamoDB.send(new PutCommand(ddbParam)));
    const ret = await Promise.all(ddbPutPromise);
    return items;
};

type JournalQueryParams = {
    userId: string;
    startDate?: string;
    endDate?: string;
}
export const queryJournals = async (query: JournalQueryParams): Promise<Journal[]> => {
    const tableName = JournalTableName;
    const params = {
        TableName: tableName,
        IndexName: 'byUserid',
        KeyConditionExpression: "userId = :userId AND createdAt BETWEEN :startDate AND :endDate",
        ExpressionAttributeValues: {
            ":userId": query.userId,
            ":startDate": query.startDate || '2000-01-01T00:00:00.000Z',
            ":endDate": query.endDate || '2100-01-01T00:00:00.000Z',
        },
        Limit: 12,
        ScanIndexForward: false,
    };
    console.log(params);
    try {
        const { Items } = await client.send(new QueryCommand(params));
        if (!Items) {
            throw new Error('Failed to query items from DynamoDB');
        }
        const journals = Items as Journal[];
        return journals;
    } catch (error: any) {
        console.log("DynamoDB query error:", error.message);
        throw error.message;
    }
};

export const createUsers = async (usersInput: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<User[]> => {
    const tableName = UsertableName;
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
    try {
        const ddbPutPromise = ddbParams.map(ddbParam => dynamoDB.send(new PutCommand(ddbParam)));
        const ret = await Promise.all(ddbPutPromise);
    } catch (error: any) {
        console.log("DynamoDB create user error:", error.message);
        throw error.message;
    }
    return users;
};

export const queryUsers = async ({ id }: { id?: string }): Promise<User[]> => {
    const tableName = UsertableName;
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

export const patchUsers = async (usersInput: Omit<User, 'createdAt' | 'updatedAt'>[]): Promise<User[]> => {
    const tableName = UsertableName;
    const currentUtcIso8601 = new Date().toISOString();

    const commandsInput = usersInput.map(userInput => ({
        TableName: tableName,
        Key: { id: userInput.id },
        UpdateExpression: 'set #profileText = :profileText, updatedAt = :updatedAt',
        ExpressionAttributeNames: {
            '#profileText': 'profileText',
        },
        ExpressionAttributeValues: {
            ':profileText': userInput.profileText,
            ':updatedAt': currentUtcIso8601,
        },
        ReturnValues: 'ALL_NEW',
    } as UpdateCommandInput));
    const promises = commandsInput
        .map(commandInput => new UpdateCommand(commandInput))
        .map(command => dynamoDB.send(command).then(response => response.Attributes))
    const updatedUsers = await Promise.all(promises);
    return updatedUsers.filter(user => user !== null) as User[];
};

export const deleteUsers = async (users: Pick<User, 'id'>[]): Promise<string[]> => {
    const tableName = UsertableName;
    const commandsInput = users.map(user => ({
        TableName: tableName,
        Key: { id: user.id },
    }));
    const promises = commandsInput
        .map(commandInput => new DeleteCommand(commandInput))
        .map(command => dynamoDB.send(command)
            .then(() => command.input.Key?.id)
            .catch(error => {
                console.error("Delete error for user ID:", command.input.Key?.id, error);
                return null;
            })
        )
    const deletedUserIds = await Promise.all(promises);
    return deletedUserIds.filter(userId => userId !== null) as string[];
};

export const createDailyStats = async (itemsInput: Omit<DailyStat, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<DailyStat[]> => {
    const tableName = dailyStatsTableName;
    const currentUtcIso8601 = new Date().toISOString();
    const items: DailyStat[] = itemsInput.map(itemInput => {
        const newItem = {
            ...itemInput,
            id: uuidv4(),
            createdAt: currentUtcIso8601,
            updatedAt: currentUtcIso8601,
        };
        return newItem;
    })

    const ddbParams = items.map(item => ({
        TableName: tableName,
        Item: item,
    }));
    const ddbPutPromise = ddbParams.map(ddbParam => dynamoDB.send(new PutCommand(ddbParam)));
    const ret = await Promise.all(ddbPutPromise);
    return items;
};

type DailyStatsQueryParam = {
    userId: string;
    startDate: string;
    endDate: string;
}
export const queryDailyStats = async (query: DailyStatsQueryParam): Promise<DailyStat[]> => {
    const tableName = dailyStatsTableName;
    const params = {
        TableName: tableName,
        IndexName: 'byUserid',
        KeyConditionExpression: "userId = :userId AND #date BETWEEN :startDate AND :endDate",
        ExpressionAttributeValues: {
            ":userId": query.userId,
            ":startDate": format(startOfDay(query.startDate), 'yyyy-MM-dd'),
            ":endDate": format(endOfDay(query.endDate), 'yyyy-MM-dd'),
        },
        ExpressionAttributeNames: {
            "#date": "date"
        },
        Limit: 12,
        ScanIndexForward: false,
    };
    console.log(params);
    try {
        const { Items } = await client.send(new QueryCommand(params));
        if (!Items) {
            throw new Error('Failed to query items from DynamoDB');
        }
        const dailyStats = Items as DailyStat[];
        return dailyStats;
    } catch (error: any) {
        console.log("DynamoDB query error:", error.message);
        throw error.message;
    }
};

type DailyStatsDeleteParam = {
    userId: string;
    startDate: string;
    endDate: string;
}
export const deleteDailyStats = async (query: DailyStatsDeleteParam): Promise<undefined> => {
    const tableName = dailyStatsTableName;
    const items = await queryDailyStats(query);

    try {
        const items = await queryDailyStats(query);
        for (const item of items) {
            const deleteCommand = new DeleteCommand({
                TableName: tableName,
                Key: {
                    id: item.id,
                }
            });
            await client.send(deleteCommand);
        }
        console.log(`${items.length} items deleted.`);
    } catch (error) {
        console.error("Error deleting items:", error);
    }
}
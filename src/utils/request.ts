import { APIGatewayProxyEvent } from 'aws-lambda';

export const parseJSON = (jsonString: string | null) => {
    if (jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch {
            return null;
        }
    }
    return null;
};

export const getPathParameter = (event: APIGatewayProxyEvent, paramName: string): string | null => {
    if (event.pathParameters && event.pathParameters[paramName]) {
        return event.pathParameters[paramName]!;
    }
    return null;
};

export const getQueryParameter = (event: APIGatewayProxyEvent, paramName: string): string | null => {
    if (event.queryStringParameters && event.queryStringParameters[paramName]) {
        return event.queryStringParameters[paramName]!;
    }
    return null;
};

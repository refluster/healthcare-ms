import { APIGatewayProxyResult } from 'aws-lambda';

export const successResponse = (statusCode: number, body: object): APIGatewayProxyResult => {
    return {
        statusCode,
        body: JSON.stringify(body),
    };
};

export const errorResponse = (statusCode: number, message: string): APIGatewayProxyResult => {
    return {
        statusCode,
        body: JSON.stringify({
            message,
        }),
    };
};

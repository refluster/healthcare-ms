import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorResponse, successResponse } from '../utils/response';
import { UserProfile } from '../models';
import { createUsers, deleteUsers, patchUsers, queryUsers } from '../database/dynamoDB';

export const postUsersHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('create users', event);
    const usersInput: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>[] = JSON.parse(event.body || '{}');

    if (!usersInput || usersInput.length === 0) {
      return errorResponse(400, 'User data is required');
    }

    const newUsers = await createUsers(usersInput);
    return successResponse(201, newUsers);
  } catch (e: any) {
    console.log('ERROR', e.message);
    return successResponse(500, { message: 'Service side error: ' + e.message });
  }
};

export const getUsersHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const queryParameters = event.queryStringParameters || {};
  const id = queryParameters.userId || undefined;
  if (!id) {
    return successResponse(400, { message: '"userId" is required as a query parameter' });
  }
  try {
    const users = await queryUsers({ id });
    return successResponse(201, users);
  } catch (e: any) {
    console.log('ERROR', e.message);
    return successResponse(500, { message: 'Service side error: ' + e.message });
  }
};

export const patchUsersHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const usersInput: Omit<UserProfile, 'createdAt' | 'updatedAt'>[] = JSON.parse(event.body || '{}');

    if (!Array.isArray(usersInput) || usersInput.length === 0) {
      return errorResponse(400, 'User data array is required in the request body');
    }

    const users = await patchUsers(usersInput);
    return successResponse(200, users);
  } catch (e: any) {
    console.log('ERROR', e.message);
    return errorResponse(500, 'Server side error: ' + e.message);
  }
}

export const deleteUsersHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const userId = event.pathParameters?.id;
    //const usersInput: Pick<User, 'id'>[] = JSON.parse(event.body || '{}');

    if (!userId === undefined) {
      return errorResponse(400, 'User ID is required.');
    }

    const users = await deleteUsers([{id: userId as string}]);
    return successResponse(200, users);
  } catch (e: any) {
    console.log('ERROR', e.message);
    return errorResponse(500, 'Server side error: ' + e.message);
  }
  return successResponse(200, {});
};

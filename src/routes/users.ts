import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorResponse, successResponse } from '../utils/response';
import { User } from '../models/user';
import { createUsers, deleteUsers, queryUsers, updateUsers } from '../database/dynamoDB';

export const postUsersHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('create works', event);
    const usersInput: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[] = JSON.parse(event.body || '{}');

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
  const id = queryParameters.id || undefined;
  if (!id) {
    return successResponse(400, { message: 'input query parameter is not valid' });
  }
  try {
    const works = await queryUsers({ id });
    return successResponse(201, works);
  } catch (e: any) {
    console.log('ERROR', e.message);
    return successResponse(500, { message: 'Service side error: ' + e.message });
  }
};

export const updateUsersHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
/*
  try {
    console.log('update works', event);
    const worksInput: Work[] = JSON.parse(event.body || '{}');  // Assume Work type includes 'id', 'createdAt', and 'updatedAt'

    if (!worksInput || worksInput.length === 0) {
      return errorResponse(400, 'Work data is required');
    }

    const updatedWorks = await updateWorks(worksInput);
    return successResponse(200, updatedWorks);
  } catch (e: any) {
    console.log('ERROR', e.message);
    return errorResponse(500, 'Service side error: ' + e.message);
  }
*/
  return successResponse(200, {});
};

export const deleteUsersHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
/*
  try {
    console.log('delete works', event);
    const queryStringParameters = event.queryStringParameters || {};
    const idParam = queryStringParameters.id || '';
    const ids = idParam.split(',');
    if (ids.length === 0) {
      return successResponse(400, { message: 'input query parameter is not valid' });
    }
    const deletedIds = await deleteWorks(ids);
    return successResponse(200, ids);
  } catch (e: any) {
    console.log('ERROR', e.message);
    return successResponse(500, { message: 'Service side error: ' + e.message });
  }
*/
  return successResponse(200, {});
};

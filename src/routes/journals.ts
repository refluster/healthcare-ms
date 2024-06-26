import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorResponse, successResponse } from '../utils/response';
import { Journal } from '../models/journal';
import { createJournals, queryJournals } from '../database/dynamoDB';
import { putJournalPostEvent } from '../lib/eventbridge';

export const postJournalsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('create journals', event);
    const journalsInput: Omit<Journal, 'id' | 'createdAt' | 'updatedAt'>[] = JSON.parse(event.body || '{}');

    if (!journalsInput || journalsInput.length === 0) {
      return errorResponse(400, 'User data is required');
    }

    const newJournals = await createJournals(journalsInput);
    await putJournalPostEvent({userId: newJournals[0].userId, date: newJournals[0].createdAt});
    return successResponse(201, newJournals);
  } catch (e: any) {
    console.log('ERROR', e.message);
    return successResponse(500, { message: 'Service side error: ' + e.message });
  }
};

export const getJournalsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const queryParameters = event.queryStringParameters || {};
  const userId = queryParameters.userId || undefined;
  const startDate = queryParameters.startDate || undefined;
  const endDate = queryParameters.endDate || undefined;
  const limit = Number(queryParameters.limit) || undefined;
  if (!userId) {
    return successResponse(400, { message: 'input query parameter is not valid' });
  }
  try {
    const journals = await queryJournals({ userId, startDate, endDate, limit });
    return successResponse(201, journals);
  } catch (e: any) {
    console.log('ERROR', e.message);
    return successResponse(500, { message: 'Service side error: ' + e.message });
  }
};

export const updateJournalsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
  return successResponse(200, {});
*/
  return errorResponse(400, 'This API is currently not supported.');
};

export const deleteJournalsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
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
  return successResponse(200, {});
*/
  return errorResponse(400, 'This API is currently not supported.');
};

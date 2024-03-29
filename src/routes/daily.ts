import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorResponse, successResponse } from '../utils/response';
import { Journal } from '../models/journal';
import { createDailyStats, createJournals, queryDailyStats, queryJournals } from '../database/dynamoDB';
import { DailyStat } from '../models/daily';

type PostInput = {
  userId: string;
};

export const postDailyStatsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('create daily stats', event);
    const input: PostInput = JSON.parse(event.body || '{}');
    const userId = input.userId;
    if (!userId) {
      return successResponse(400, { message: 'input query parameter is not valid' });
    }
    const _dailyStats = {
      userId: userId,
      wellnessEmotional: .3,
      wellnessPhysical: .2,
      wellnessSocial: .7,
      wellnessSpiritual: .5,
      wellnessFinancial: .4,
      wellnessIntellectual: .8,
      date: '2024-03-28',
    }
    const dailyStats = await createDailyStats([_dailyStats]);
    return successResponse(201, dailyStats);
  } catch (e: any) {
    console.log('ERROR', e.message);
    return successResponse(500, { message: 'Service side error: ' + e.message });
  }
};

export const getDailyStatsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const queryParameters = event.queryStringParameters || {};
  const userId = queryParameters.userId || undefined;
  if (!userId) {
    return successResponse(400, { message: 'input query parameter is not valid' });
  }
  try {
    const journals = await queryDailyStats({ userId });
    return successResponse(201, journals);
  } catch (e: any) {
    console.log('ERROR', e.message);
    return successResponse(500, { message: 'Service side error: ' + e.message });
  }
};


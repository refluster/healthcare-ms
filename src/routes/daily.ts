import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorResponse, successResponse } from '../utils/response';
import { Journal } from '../models/journal';
import { createDailyStats, createJournals, deleteDailyStats, queryDailyStats, queryJournals } from '../database/dynamoDB';
import { DailyStat } from '../models/daily';
import { endOfDay, format, startOfDay } from 'date-fns';
import { text2wellness } from '../lib/openai';

type PostInput = {
  userId: string;
};

export const postDailyStatsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    //console.log('create daily stats', event);
    const input: PostInput = JSON.parse(event.body || '{}');
    const userId = input.userId;
    const date = new Date();
    const startDate = startOfDay(date).toISOString();
    const endDate = endOfDay(date).toISOString();

    if (!userId) {
      return successResponse(400, { message: 'input query parameter is not valid' });
    }
    console.log({userId, startDate, endDate});
    const journals = await queryJournals({userId, startDate, endDate});
    const posts = journals
      .filter(d => d.author === 'user')
      .map(d => d.content)
      .join(' ');
    
    const wellness = await text2wellness(posts);
    if (!wellness) {
      return successResponse(500, { message: 'wellness cannot be generated.' });
    }
    const _dailyStats = {
      userId: userId,
      wellnessEmotional: wellness.emotional,
      wellnessPhysical: wellness.physical,
      wellnessSocial: wellness.social,
      wellnessSpiritual: wellness.spiritual,
      wellnessFinancial: wellness.financial,
      wellnessIntellectual: wellness.intellectual,
      date: format(new Date(), 'yyyy-MM-dd'),
    }
    await deleteDailyStats({userId, startDate, endDate});
    const dailyStats = await createDailyStats([_dailyStats]);
    return successResponse(201, dailyStats);
  } catch (e: any) {
    console.log('ERROR', e.message);
    return successResponse(500, { message: 'Service side error: ' + e.message });
  }
};

export const getDailyStatsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const queryParameters = event.queryStringParameters || {};
  const userId = queryParameters.userId;
  const startDate = queryParameters.startDate;
  const endDate = queryParameters.endDate;
  if (!userId || !startDate || !endDate) {
    return successResponse(400, { message: 'input query parameter is not valid' });
  }
  try {
    const journals = await queryDailyStats({ userId, startDate, endDate });
    return successResponse(201, journals);
  } catch (e: any) {
    console.log('ERROR', e.message);
    return successResponse(500, { message: 'Service side error: ' + e.message });
  }
};


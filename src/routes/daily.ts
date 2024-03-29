import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorResponse, successResponse } from '../utils/response';
import { Journal } from '../models/journal';
import { createDailyStats, createJournals, deleteDailyStats, queryDailyStats, queryJournals } from '../database/dynamoDB';
import { DailyStat } from '../models/daily';
import { format } from 'date-fns';
import { text2wellness } from '../lib/openai';

type PostInput = {
  userId: string;
};

export const postDailyStatsHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    console.log('create daily stats', event);
    const input: PostInput = JSON.parse(event.body || '{}');
    const userId = input.userId;
    const date = format(new Date(), 'yyyy-MM-dd');

    if (!userId) {
      return successResponse(400, { message: 'input query parameter is not valid' });
    }
    const wellness = await text2wellness("今日は天気の良い1日だった。");
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
      date: date,
    }
    await deleteDailyStats({userId, startDate: date, endDate: date});
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


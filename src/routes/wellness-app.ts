import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { errorResponse, successResponse } from '../utils/response';
import { Journal } from '../models/journal';
import { createDailyStats, createJournals, deleteDailyStats, queryDailyStats, queryJournals } from '../database/dynamoDB';
import { DailyStat } from '../models/daily';
import { endOfDay, format, startOfDay } from 'date-fns';
import { text2wellness, text2wellnessApp } from '../lib/openai';
import { getAppDef } from '../lib/app-db';

type App = {
  appId: string;
}

type RunAppInput = {
  userId: string;
  message: string;
  apps: App[];
};

const baseContent = [
  'あなたはコンシューマ寄りのウェルネスや幸福感情の化学的知識に精通しています。',
  '科学的知識は以下ページを根拠に、定量化します（https://www.linkedin.com/pulse/6-dimensions-wellness-how-help-workplace-char-olivia-hamilton）。',
  '与えられた情報をもとに、Wellness wheelの6感情を0.0から1.0で計測もできます。',
  'ここで扱うウェルネスや幸福度とは、生きがい、自己実現、満足感、自己受容、達成感、情熱、創造性などによって齎されるものです。',
  'あなたは人をより高い幸福に導くための、関係する体系知識、産業分野、フレームワーク、スタンダードなどを整理し構造化し、多様な観点で一般人に分かりやすく、専門の体系知識とのブリッジもしつつアドバイスします。'
].join('');

export const runAppHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    //console.log('create daily stats', event);
    const param: RunAppInput = JSON.parse(event.body || '{}');
    const userId = param.userId;
    if (!userId) {
      return successResponse(400, { message: 'input query parameter is not valid' });
    }

    // TBD: just using only the first app id for now
    const appId = param.apps[0].appId;
    const appDef = getAppDef({ appId });
    if (!appDef) {
      return successResponse(400, { message: 'appId is not valid' });
    }
    const appContent = appDef.appContent;
    const content = baseContent + appContent;

    const appRes = await text2wellnessApp({ systemContent: content, userContent: param.message })
    return successResponse(201, { apps: [appRes] });
  } catch (e: any) {
    console.log('ERROR', e.message);
    return successResponse(500, { message: 'Service side error: ' + e.message });
  }
};

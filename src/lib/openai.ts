import { AzureKeyCredential, ChatRequestMessage, GetChatCompletionsOptions, OpenAIClient } from "@azure/openai";
import axios from "axios";

type Wellness = {
    emotional: number;
    physical: number;
    social: number;
    spiritual: number;
    financial: number;
    intellectual: number;
};

export type OpenAIInitParams = {
    apiKey: string;
    apiBase: string;
    apiType: string;
    deployment: string;
};
export type InputParams = {
    type: 'wellness' | 'talk'
    message: string;
    content?: string;
};

/*
export const text2wellness = async (input: string) => {
    const baseUrl = 'https://cykubbplcd.execute-api.us-west-2.amazonaws.com/Prod';
    try {
        console.log('abc ========')
        const res = await axios.post(`${baseUrl}/healthcare-gpt/generic`, {
            message: input,
            type: 'wellness',
        });
        console.log('abc ======== 1', res.data);
        return res.data.wellness as Wellness;
    } catch (error) {
        console.error('API call failed:', error);
    }
};
*/

const client = new OpenAIClient(
    'https://openai-test000.openai.azure.com/',
    new AzureKeyCredential('73dd6dd7bd9c40b8b6fb1d7518c71c6f'),
    {
        apiVersion: '2024-02-15-preview',
    }
);
const deploymentId = 'test-gpt-35-turbo-16k';

export const text2wellness = async (message: string) => {
    const messages: ChatRequestMessage[] = [
        {
            role: 'system',
            content: [
                'あなたはコンシューマ寄りのヘルスケアやウェルネスの化学的知識に精通しています。',
                '科学的知識は以下ページを根拠に、定量化します。https://www.linkedin.com/pulse/6-dimensions-wellness-how-help-workplace-char-olivia-hamilton',
                '与えられたコンディションをもとに、Wellness wheelの6感情を0.0から1.0のグラフで視覚化もできます。',
            ].join('')
        },
        {
            role: 'user',
            content: message
        },
    ];
    const options: GetChatCompletionsOptions | undefined = (() => {
        return {
            tools: [
                {
                    type: "function",
                    function: wellness,
                },
            ],
            "tool_choice": {
                "type": "function",
                "function": {
                    "name": wellness.name,
                }
            },
        };
    })();
    const result = await client.getChatCompletions(
        deploymentId, messages, options,
    );
    for (const choice of result.choices) {
        console.log('message', choice.message);
    }
    if (result.choices[0].message?.toolCalls) {
        const fn = result.choices[0].message?.toolCalls[0].function;
        const ret = JSON.parse(fn.arguments) as Wellness;
        return ret;
    } else {
        return undefined;
    }
}

type WellnessAppParams = {
    systemContent: string;
    userContent: string;
}

export const text2wellnessApp = async (param: WellnessAppParams) => {
    const messages: ChatRequestMessage[] = (() => {
        return [
            { "role": "system", "content": param.systemContent },
            { "role": "user", "content": param.userContent },
        ];
    })();
    const options: GetChatCompletionsOptions | undefined = (() => {
        return {
            "tools": [
                {
                    "type": "function",
                    "function": wellnessAppBankTransaction
                }
            ],
            "tool_choice": {
                "type": "function",
                "function": {
                    "name": wellnessAppBankTransaction.name,
                }
            },
        };
    })();
    const result = await client.getChatCompletions(
        deploymentId, messages, options,
    );
    for (const choice of result.choices) {
        console.log('message', choice.message);
    }
    if (result.choices[0].message?.content) {
        return {
            message: result.choices[0].message.content,
        };
    } else if (result.choices[0].message?.toolCalls) {
        const fn = result.choices[0].message?.toolCalls[0].function;
        return {
            [fn.name]: JSON.parse(fn.arguments),
        }
    } else {
        return undefined;
    }
}

const wellness = {
    "name": "wellness",
    "description": "Visualize how the person is in well status using 6 dimension of wellness defined by wellness wheel by giving value for each dimension as real number",
    "parameters": {
        "type": "object",
        "properties": {
            "emotional": {
                "type": "number",
                "description": "Indicates the emotional wellness degree, how the person is emotionally good states between 0.0 (not good) and 1.0 (good)."
            },
            "physical": {
                "type": "number",
                "description": "Indicates the physical wellness degree, how the person is physically good states between 0.0 (not good) and 1.0 (good)."
            },
            "social": {
                "type": "number",
                "description": "Indicates the social wellness degree, how the person is emotisocially good states between 0.0 (not good) and 1.0 (good)."
            },
            "spiritual": {
                "type": "number",
                "description": "Indicates the spiritual wellness degree, how the person is spiritually good states between 0.0 (not good) and 1.0 (good)."
            },
            "financial": {
                "type": "number",
                "description": "Indicates the financial wellness degree, how the person is financially good states between 0.0 (not good) and 1.0 (good)."
            },
            "intellectual": {
                "type": "number",
                "description": "Indicates the intellectual wellness degree, how the person is intellectually good states between 0.0 (not good) and 1.0 (good)."
            }
        },
        "required": [
            "physical",
            "emotional",
            "spiritual",
            "financial",
            "intellectual",
            "social"
        ]
    }
};

const wellnessAppBankTransaction = {
    "name": "bank-transaction",
    "description": "より高いWellnessの獲得に向けたアドバイスを提供します。",
    "parameters": {
        "type": "object",
        "properties": {
            "advice": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "title": {
                            "type": "string",
                            "description": "アドバイスの要約を、人の目を惹きつける魅力的な内容で表現します。もっと知りたい、知った上で試してみたいと思えるようなタイトルです。"
                        },
                        "content": {
                            "type": "string",
                            "description": "具体的なアドバイスを表現します。"
                        }
                    }
                }
            }
        },
        "required": [
            "advice"
        ]
    }
};


type AppDef = {
    appId: string;
    appContent: string;
    function: any;
}

const wellnessApps: AppDef[] = [
    {
        appId: 'bank-transaction',
        appContent: '例えば、お金を使い過ぎたように見えても、それが消費か、自身への投資か、をしっかり把握する、見方を変える（誰かが明示的にフィードバックする）だけでも幸福度は変わります。この後者の場合は、資産の削減ではなく、資産の置き換えで、自己資産は減らないどころか拡大もありえます。この資産には有形も無形もあるからです。あなたは人をより高い幸福に導くための、関係しそうな体系知識、産業分野、フレームワーク標準などを整理し、各々の観点で一般人に分かりやすく、少し科学的な体系の説明を少しだけ取り入れながら助言します。助言には、ネクストアクションの掲示もあれば、良い取り組みは継続できるよう素直に認め誉めること、もあります。助言はトータルで5個、提供します。',
        function: {
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
        }
    }, {
        appId: 'financial-wellbeing',
        appContent: 'USのConsumer Financial Protection Bureauが開発したFinancial Well-being Scale（https://files.consumerfinance.gov/f/documents/bcfp_fin-well-being_full-scorecard.pdf）を使って、ユーザの資産管理における健康度合いを計測する。合計、12個の質問の回答を推測し、Financial Well-being scoreを算出する。',
        function: {
            "name": "financial-wellbeing",
            "description": "USのConsumer Financial Protection Bureauが開発したFinancial Well-being Scaleで評価する。",
            "parameters": {
                "type": "object",
                "properties": {
                    "comment": {
                        "type": "string",
                        "description": "12個の質問の予測回答を元に、より高いWellbeingに向けて100文字程度でコメントする。"
                    },
                    "score": {
                        "type": "number",
                        "description": "12個の質問の回答を予測し、各々のスコアの合計値（結果は0から91）でFinancial Well-being Scoreを割り出して回答する。",
                    }
                },
                "required": [
                    "comment",
                    "score"
                ]
            }
        }
    }, {
        appId: 'heart-health',
        appContent: 'あなたは、与えられた人の行動や情動に対して、広義の意味で健康になる助言を3つフィードバックします。その際、この人の行動や情動をとてもよく観察した上で、ウェルネスを高め、生きがい、やる気、自己達成感、満足感、などを効果的に高める厳選されたワードが重要です。',
        function: {
            "name": "heart-health",
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
        }
    }
];

type QueryParam = {
    appId: string;
}
export const getAppDef = (param: QueryParam) => {
    return wellnessApps.find(app => app.appId === param.appId);
}

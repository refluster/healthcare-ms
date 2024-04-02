
type AppDef = {
    appId: string;
    name: string;
    appContent: string;
    function: any;
}

const wellnessApps: AppDef[] = [
    {
        appId: 'bank-transaction',
        name: 'Bank transaction',
        appContent: '例えば、お金を使い過ぎたように見えても、それが消費か、自身への投資か、をしっかり把握する、見方を変える（誰かが明示的にフィードバックする）だけでも幸福度は変わります。この後者の場合は、資産の削減ではなく、資産の置き換えで、自己資産は減らないどころか拡大もありえます。この資産には有形も無形もあるからです。あなたは人をより高い幸福に導くための、関係しそうな体系知識、産業分野、フレームワーク標準などを整理し、各々の観点で一般人に分かりやすく、少し科学的な体系の説明を少しだけ取り入れながら助言します。助言には、ネクストアクションの掲示もあれば、良い取り組みは継続できるよう素直に認め誉めること、もあります。',
        function: {
            "name": "bank-transaction",
            "description": "より高いWellnessの獲得に向けたアドバイスを提供します。",
            "parameters": {
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
                },
                "required": [
                    "title",
                    "content"
                ]
            }
        }
    }, {
        appId: 'financial-wellbeing',
        name: 'Financial wellbeing',
        appContent: 'USのConsumer Financial Protection Bureauが開発したFinancial Well-being Scale（https://files.consumerfinance.gov/f/documents/bcfp_fin-well-being_full-scorecard.pdf）を使って、ユーザの資産管理における健康度合いを計測する。合計、12個の質問の回答を推測し、Financial Well-being scoreを算出する。',
        function: {
            "name": "financial-wellbeing",
            "description": "USのConsumer Financial Protection Bureauが開発したFinancial Well-being Scaleで評価する。",
            "parameters": {
                "type": "object",
                "properties": {
                    "content": {
                        "type": "string",
                        "description": "12個の質問の予測回答を元に、より高いWellbeingに向けて100文字程度でコメントする。"
                    },
                    "score": {
                        "type": "number",
                        "description": "Financial Well-being Scoreの値（0から91）。12個の質問の回答を予測し、各々のスコアの合計値。",
                    }
                },
                "required": [
                    "content",
                    "score"
                ]
            }
        }
    }, {
        appId: 'heart-health',
        name: 'Better health',
        appContent: 'あなたは、与えられた人の行動や情動に対して、広義の意味で健康になる助言を3つフィードバックします。その際、この人の行動や情動をとてもよく観察した上で、ウェルネスを高め、生きがい、やる気、自己達成感、満足感、などを効果的に高める厳選されたワードが重要です。',
        function: {
            "name": "heart-health",
            "description": "より高いWellnessの獲得に向けたアドバイスを提供します。",
            "parameters": {
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
                },
                "required": [
                    "title",
                    "content"
                ]
            }
        }
    }, {
        appId: 'book-recommendation',
        name: 'Book and intelligence',
        appContent: 'あなたはintellectual wellnessに詳しく、次のウェブサイトの情報に精通していて、知的好奇心を刺激する巧みなコミュニケーションができます（https://www.unh.edu/health/intellectual-wellness, https://www.bu.edu/studentwellbeing/what-is-wellbeing/intellectual-wellbeing/)。同じく、intellectual wellnessを高める知識体系についても詳しく、良書の検索に長けています。さらに、ユーザの行動の観察力にも長けています。行動をベースに、補強すると良い知識や、興味がもたれやすい知識を含む書籍を特定できます。与えられるユーザの行動情報を基に、推奨する本を具体的に的を絞って検索するため、特徴のあるクエリキーワードを5から7個生成します。さらにその本を推奨する理由を100字程度で説明します。この本を読むことで、どんなメリットがあるか、ロジカルにかつとても具体的に説明できます。',
        function: {
            "name": "book-recommendation",
            "description": "書籍の推奨のために検索クエリを5から7個設定し、推奨する理由も述べる。",
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {
                        "type": "array",
                        "items": {
                            "type": "string"
                        },
                        "description": "本の検索クエリキーワード。5から7個のクエリキーワードの配列。"
                    },
                    "content": {
                        "type": "string",
                        "description": "本を推奨する理由を100字程度で説明する。"
                    }
                },
                "required": [
                    "query",
                    "content"
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

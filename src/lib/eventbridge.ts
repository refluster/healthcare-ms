import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";

const client = new EventBridgeClient({ region: 'us-west-2'});

type JournalPostEvent = {
    userId: string;
    date: string;
}

export const putJournalPostEvent = async (event: JournalPostEvent) => {
    const params = {
        Entries: [
            {
                EventBusName: 'default',
                Source: 'healthcare.journal',
                DetailType: 'Journal post created',
                Detail: JSON.stringify(event),
            },
        ],
    };

    try {
        const command = new PutEventsCommand(params);
        const response = await client.send(command);
        console.log("Event sent:", response);
        return response;
    } catch (error) {
        console.error("Error sending event to EventBridge:", error);
        throw error;
    }
}

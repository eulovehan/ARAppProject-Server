
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const enum EventType {
	CONNECT = "CONNECT",
	DISCONNECT = "DISCONNECT",
	MESSAGE = "MESSAGE",
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	const context = event?.requestContext;
	const connectionId = context.connectionId;
	
	switch(context.eventType) {
		case EventType.CONNECT: {
			console.log(`Connection established: ${connectionId}`);
			break;
		}
		
		case EventType.DISCONNECT: {
			console.log(`Connection closed: ${connectionId}`);
			break;
		}
			
		case EventType.MESSAGE: {
			console.log(`Message received from ${connectionId}: ${event.body}`);
			break;
		}
			
		default: {
			console.log(`Unknown event type: ${context.eventType}`);
			break;
		}
	}

	return {
		statusCode: 200,
		body: "OK",
	}
};
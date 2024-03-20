import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context, Callback } from 'aws-lambda';
import { postUsersHandler, getUsersHandler, updateUsersHandler, deleteUsersHandler } from './routes';

type HttpMethod = 'post' | 'get' | 'put' | 'patch' | 'delete';

const routes: { [key: string]: { [key in HttpMethod]?: APIGatewayProxyHandler } } = {
  '/users': {
    post: postUsersHandler,
    get: getUsersHandler,
    put: updateUsersHandler,
    delete: deleteUsersHandler,
  }
};

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<APIGatewayProxyResult>
): Promise<APIGatewayProxyResult> => {
  const resource = event.resource;
  const method = event.httpMethod.toLowerCase() as HttpMethod;
  const route = routes[resource];

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // Allow any origin
    'Access-Control-Allow-Headers': 'Content-Type', // Allow only headers with "Content-Type" 
    'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PATCH,PUT,DELETE', // Allow these methods
  };
  console.log('resource', event.resource)
  console.log('method', method)
  console.log('body', event.body)
  console.log('str', JSON.stringify(event))

  if (route && route[method]) {
    try {
      // Cast the return type to Promise<APIGatewayProxyResult>
      const result = await (route[method]!(event, context, callback) as Promise<APIGatewayProxyResult>);
      return { ...result, headers }; // Include CORS headers in the response
    } catch (error) {
      console.error('Error processing request:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' }),
        headers,
      };
    }
  } else {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: 'Not found' }),
      headers,
    };
  }
};


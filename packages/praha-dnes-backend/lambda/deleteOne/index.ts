import {DynamoDB} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocument, DeleteCommand} from "@aws-sdk/lib-dynamodb";

const dynamo = DynamoDBDocument.from(new DynamoDB());

const tableName = process.env.TABLE;

export const handler = async (event: any) => {
	const command = new DeleteCommand({
		TableName: tableName,
		Key: {
			id: event.pathParameters.id,
		},
	});

	const response = await dynamo.send(command);

	const statusCode = "200";
	const headers = {
		"Access-Control-Allow-Origin": "https://praha-dnes-cms.michalprucha.cz",
		"Access-Control-Allow-Methods": "DELETE, OPTIONS",
	};
	const body = JSON.stringify(response);
	return {
		statusCode,
		body,
		headers,
	};
};

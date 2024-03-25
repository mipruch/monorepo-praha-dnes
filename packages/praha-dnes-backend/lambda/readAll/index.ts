import {DynamoDB} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocument, GetCommand} from "@aws-sdk/lib-dynamodb";

const dynamo = DynamoDBDocument.from(new DynamoDB());

const tableName = process.env.TABLE;

export const handler = async (event: any) => {
	let body;
	let statusCode = "200";
	const headers = {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, OPTIONS",
	};

	const command = {
		TableName: tableName,
	};

	try {
		const res: any = await dynamo.scan(command);
		body = JSON.stringify(res.Items);
	} catch (err: any) {
		statusCode = "400";
		body = err.message;
	}

	return {
		statusCode,
		body,
		headers,
	};
};

import {DynamoDB} from "@aws-sdk/client-dynamodb";
import {DynamoDBDocument, GetCommand} from "@aws-sdk/lib-dynamodb";

const dynamo = DynamoDBDocument.from(new DynamoDB());

const tableName = process.env.TABLE;

export const handler = async (event: any) => {
	let body;
	let statusCode = "200";

	const allowedOrigins = [
		"https://praha-dnes-cms.michalprucha.cz",
		"https://praha-dnes.michalprucha.cz",
	];
	const headers: {
		"Content-Type": string;
		"Access-Control-Allow-Origin"?: string;
		"Access-Control-Allow-Methods": string;
	} = {
		"Content-Type": "application/json",
		"Access-Control-Allow-Methods": "GET, OPTIONS",
	};

	const origin = event.headers.origin || event.headers.Origin;
	if (allowedOrigins.includes(origin)) {
		headers["Access-Control-Allow-Origin"] = origin;
	}
	headers["Access-Control-Allow-Origin"] = "*";

	const command = new GetCommand({
		TableName: tableName,
		Key: {
			id: event.pathParameters.id,
		},
	});

	try {
		const res: any = await dynamo.send(command);
		body = res.Item.config;
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

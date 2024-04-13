import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {
	PutCommand,
	DynamoDBDocumentClient,
	UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {Handler} from "aws-cdk-lib/aws-lambda";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.TABLE;

export const handler: Handler = async (event: any) => {
	const body = JSON.parse(event.body);
	const headers = {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": " OPTIONS, POST",
	};

	if (!body.name || !body.category) {
		return {
			statusCode: 400,
			body: "Špatný formát",
			headers,
		};
	}

	try {
		const command = new UpdateCommand({
			TableName: tableName,
			Key: {
				id: event.pathParameters.id,
			},
			UpdateExpression:
				"set #n = :name, category = :category, config = :config",
			ExpressionAttributeNames: {
				"#n": "name",
			},
			ExpressionAttributeValues: {
				":name": body.name,
				":category": body.category,
				":config": JSON.stringify(body),
			},
			ConditionExpression: "attribute_exists(id)",
		});

		const res = await docClient.send(command);
		const response = JSON.stringify(res);

		return {
			statusCode: 200,
			body: response,
			headers,
		};
	} catch (error) {
		if ((error as any).name === "ConditionalCheckFailedException") {
			return {
				statusCode: 409,
				body: "Vrstva s tímto ID neexistuje.",
				headers,
			};
		}
		throw error;
	}
};

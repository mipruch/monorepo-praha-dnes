import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {PutCommand, DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";
import {Handler} from "aws-cdk-lib/aws-lambda";
import {v4 as uuidv4} from "uuid";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.TABLE;

export const handler: Handler = async (event: any) => {
	const body = JSON.parse(event.body);
	const headers = {
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "https://praha-dnes-cms.michalprucha.cz",
		"Access-Control-Allow-Methods": " OPTIONS, POST",
	};

	if (!body.name || !body.category) {
		return {
			statusCode: 400,
			body: "Špatný formát",
			headers,
		};
	}
	const crypto = require("crypto");

	body.id = crypto.randomBytes(16).toString("hex");

	try {
		const command = new PutCommand({
			TableName: tableName,
			Item: {
				id: body.id,
				name: body.name,
				category: body.category,
				config: JSON.stringify(body),
			},
			ConditionExpression: "attribute_not_exists(id)",
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
				body: "Vrstva s tímto ID již existuje.",
				headers,
			};
		}
		throw error;
	}
};

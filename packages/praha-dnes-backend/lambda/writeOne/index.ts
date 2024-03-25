import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import {PutCommand, DynamoDBDocumentClient} from "@aws-sdk/lib-dynamodb";
import {Handler} from "aws-cdk-lib/aws-lambda";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.TABLE;

export const handler: Handler = async (event: any) => {
	const body = JSON.parse(event.body);

	if (!body.id || !body.name || !body.category)
		return {
			statusCode: 400,
			body: "Špatný formát",
		};

	const command = new PutCommand({
		TableName: tableName,
		Item: {
			id: body.id,
			name: body.name,
			category: body.category,
			config: JSON.stringify(body),
		},
	});

	const res = await docClient.send(command);
	const response = JSON.stringify(res);

	return {
		statusCode: 200,
		body: response,
	};
};

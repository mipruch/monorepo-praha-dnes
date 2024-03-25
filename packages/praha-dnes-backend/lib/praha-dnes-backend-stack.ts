import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import {AssetCode, Runtime} from "aws-cdk-lib/aws-lambda";

export class PrahaDnesBackendStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const table = new dynamodb.Table(this, "layers", {
			partitionKey: {name: "id", type: dynamodb.AttributeType.STRING},
			tableName: "layers",

			// Additional properties as needed
			// removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
			// billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Or dynamodb.BillingMode.PROVISIONED
		});

		// Lambda function to read one record by ID
		const readOneLambda = new lambda.Function(this, "ReadOneRecordLambda", {
			runtime: Runtime.NODEJS_LATEST,
			handler: "index.handler",
			code: lambda.Code.fromAsset(`./lambda/readOne`),
			environment: {
				TABLE: table.tableName,
			},
		});

		// Lambda function to read all records
		const readAllLambda = new lambda.Function(
			this,
			"ReadAllRecordsLambda",
			{
				runtime: Runtime.NODEJS_LATEST,
				handler: "index.handler",
				code: lambda.Code.fromAsset(`./lambda/readAll`),
				environment: {
					TABLE: table.tableName,
				},
			}
		);

		// Lambda function to write a record
		const writeLambda = new lambda.Function(this, "WriteRecordLambda", {
			runtime: Runtime.NODEJS_LATEST,
			handler: "index.handler",
			code: lambda.Code.fromAsset(`./lambda/writeOne`),
			environment: {
				TABLE: table.tableName,
			},
		});

		// Grant the Lambda function read/write permissions to the table
		table.grantReadData(readOneLambda);
		table.grantReadData(readAllLambda);
		table.grantWriteData(writeLambda);

		const restApi = new apigateway.RestApi(
			this,
			this.stackName + "RestApi",
			{
				deployOptions: {
					stageName: "prod",
					metricsEnabled: true,
					loggingLevel: apigateway.MethodLoggingLevel.INFO,
					dataTraceEnabled: true,
				},
				cloudWatchRole: true,
			}
		);

		restApi.root
			.addResource("layers")
			.addMethod(
				"GET",
				new apigateway.LambdaIntegration(readAllLambda, {})
			);

		restApi.root
			.getResource("layers")!
			.addMethod(
				"POST",
				new apigateway.LambdaIntegration(writeLambda, {})
			);

		restApi.root
			.getResource("layers")!
			.addResource("{id}")
			.addMethod(
				"GET",
				new apigateway.LambdaIntegration(readOneLambda, {})
			);
	}
}

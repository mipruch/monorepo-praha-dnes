import * as cdk from "aws-cdk-lib";
import {Construct} from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as iam from "aws-cdk-lib/aws-iam";
import {AssetCode, Runtime} from "aws-cdk-lib/aws-lambda";
import {Duration} from "aws-cdk-lib";
import {AuthorizationType, Cors} from "aws-cdk-lib/aws-apigateway";

export class PrahaDnesBackendStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// DynamoDB table to store layers
		const table = new dynamodb.Table(this, "layers", {
			partitionKey: {name: "id", type: dynamodb.AttributeType.STRING},
			tableName: "layers",

			// Additional properties as needed
			// removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
			// billingMode: dynamodb.BillingMode.PAY_PER_REQUEST, // Or dynamodb.BillingMode.PROVISIONED
		});

		// Lambda functions to manipulate the table
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

		// Lambda function to delete a record
		const deleteLambda = new lambda.Function(this, "DeleteRecordLambda", {
			runtime: Runtime.NODEJS_LATEST,
			handler: "index.handler",
			code: lambda.Code.fromAsset(`./lambda/deleteOne`),
			environment: {
				TABLE: table.tableName,
			},
		});

		const updateLambda = new lambda.Function(this, "UpdateRecordLambda", {
			runtime: Runtime.NODEJS_LATEST,
			handler: "index.handler",
			code: lambda.Code.fromAsset(`./lambda/updateOne`),
			environment: {
				TABLE: table.tableName,
			},
		});

		// Grant the Lambda function read/write permissions to the table
		table.grantReadData(readOneLambda);
		table.grantReadData(readAllLambda);
		table.grantWriteData(writeLambda);
		table.grantWriteData(deleteLambda);
		table.grantWriteData(updateLambda);

		// Cognito user pool
		const userPool = new cognito.UserPool(this, "praha-dnes-userPool", {
			signInCaseSensitive: false,
			selfSignUpEnabled: true,
			userVerification: {
				emailSubject: "Verify your email for our awesome app!",
				emailBody:
					"Thanks for signing up to our awesome app! Your verification code is {####}",
				emailStyle: cognito.VerificationEmailStyle.CODE,
			},
			userInvitation: {
				emailSubject: "Invite to join our awesome app!",
				emailBody:
					"Hello {username}, you have been invited to join our awesome app! Your temporary password is {####}",
				smsMessage:
					"Hello {username}, your temporary password for our awesome app is {####}",
			},
			signInAliases: {email: true, username: false},

			standardAttributes: {
				fullname: {
					required: true,
					mutable: false,
				},
			},
			autoVerify: {email: true},
			mfa: cognito.Mfa.REQUIRED,
			mfaSecondFactor: {
				sms: false,
				otp: true,
			},
			passwordPolicy: {
				minLength: 8,
				requireDigits: true,
				requireLowercase: true,
				requireUppercase: true,
				requireSymbols: false,
				tempPasswordValidity: Duration.days(1),
			},
		});

		var callbackUrls = [
			"https://" + "praha-dnes" + ".michalprucha.cz",
			"http://localhost:3002",
		];

		const appClient = userPool.addClient("appClient", {
			authFlows: {
				userPassword: true,
				userSrp: true,
				adminUserPassword: true,
			},
			oAuth: {
				flows: {
					authorizationCodeGrant: true,
					implicitCodeGrant: true,
				},
				callbackUrls: callbackUrls,
			},
			idTokenValidity: Duration.hours(8),
			accessTokenValidity: Duration.hours(8),
		});

		userPool.addDomain("userPoolDomain", {
			cognitoDomain: {
				domainPrefix: "praha-dnes",
			},
		});

		// API GATEWAY REST API
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
				defaultCorsPreflightOptions: {
					allowOrigins: Cors.ALL_ORIGINS,
					allowMethods: Cors.ALL_METHODS,
					allowHeaders: ["*"],
				},
			}
		);

		const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
			this,
			"APIGatewayAuthorizer",
			{
				cognitoUserPools: [userPool],
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
				new apigateway.LambdaIntegration(writeLambda, {}),
				{
					authorizer: authorizer,
					authorizationType: apigateway.AuthorizationType.COGNITO,
				}
			);

		restApi.root
			.getResource("layers")!
			.addResource("{id}")
			.addMethod(
				"GET",
				new apigateway.LambdaIntegration(readOneLambda, {})
			);

		restApi.root
			.getResource("layers")!
			.getResource("{id}")!
			.addMethod(
				"DELETE",
				new apigateway.LambdaIntegration(deleteLambda, {}),
				{
					authorizer: authorizer,
					authorizationType: apigateway.AuthorizationType.COGNITO,
				}
			);

		restApi.root
			.getResource("layers")!
			.getResource("{id}")!
			.addMethod(
				"PUT",
				new apigateway.LambdaIntegration(updateLambda, {}),
				{
					authorizer: authorizer,
					authorizationType: apigateway.AuthorizationType.COGNITO,
				}
			);
	}
}

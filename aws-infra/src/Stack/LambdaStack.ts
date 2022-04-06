import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import {
  IResource,
  LambdaIntegration,
  MockIntegration,
  PassthroughBehavior,
  RestApi
} from "aws-cdk-lib/aws-apigateway";
import {
  NodejsFunction,
  NodejsFunctionProps
} from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";

const lambdaBaseDir = "../../lambda";
const lambdaSrcDir = `${lambdaBaseDir}/src`;

export class LambdaStack extends Stack {
  authUser: NodejsFunction;
  api: RestApi;
  
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);


    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
        ],
      },
      depsLockFilePath: join(__dirname, lambdaBaseDir, 'package-lock.json'),
      environment: {
      },
      runtime: Runtime.NODEJS_14_X,
      memorySize: 512,
      timeout: Duration.seconds(5),
    }

    this.authUser = new NodejsFunction(this, 'AuthUser', {
      entry: join(__dirname, lambdaSrcDir, 'AuthUser.ts'),
      ...nodeJsFunctionProps,
    });

    const addUser = new NodejsFunction(this, 'AddUser', {
      entry: join(__dirname, lambdaSrcDir, 'AddUser.ts'),
      ...nodeJsFunctionProps,
    });

    // Create an API Gateway resource for each of the CRUD operations
    this.api = new RestApi(this, 'CognitoPocPublicApi', {
      restApiName: id+' Cognito POC public API',
      //deployOptions: {
      //  stageName: "api-prd"
      //}
    });

    // the resource controls the url
    const authUserResource = this.api.root.addResource('auth-user');
    authUserResource.addMethod('GET', new LambdaIntegration(this.authUser));
    addCorsOptions(authUserResource);

    const addUserResource = this.api.root.addResource('add-user');
    addUserResource.addMethod('POST', new LambdaIntegration(addUser));
    addCorsOptions(addUserResource);

  }
}

export function addCorsOptions(apiResource: IResource) {
  apiResource.addMethod('OPTIONS', new MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
      },
    }],
    passthroughBehavior: PassthroughBehavior.NEVER,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
  }), {
    methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Credentials': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },
    }]
  })
}


import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { ssmStringParam } from "Util/Ssm";

export class DirectAafAuthnApiConfigParamStack extends Stack {
  DirectAafAuthnApiConfig: StringParameter;

  constructor(
    scope: Construct,
    id: string,
    props: StackProps & {},
  ){
    super(scope, id, props);

    // see DirectAafAuthnApiHandler  
    this.DirectAafAuthnApiConfig = ssmStringParam(
      this, 'DirectAafAuthnApiConfig' );
  }

}

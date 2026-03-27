import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as ecs from 'aws-cdk-lib/aws-ecs'
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import * as ses from 'aws-cdk-lib/aws-ses'

interface HomepageStackProps extends cdk.StackProps {
  domainName: string
  imageTag: string
}

export class HomepageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: HomepageStackProps) {
    super(scope, id, props)

    const { domainName, imageTag } = props

    // ── ECR ─────────────────────────────────────────────────────────────────
    const repo = new ecr.Repository(this, 'Repo', {
      repositoryName: 'homepage',
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      lifecycleRules: [{ maxImageCount: 10 }],
    })

    // ── VPC ─────────────────────────────────────────────────────────────────
    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
      natGateways: 1,
    })

    // ── ECS cluster ─────────────────────────────────────────────────────────
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc })

    // ── Task definition ─────────────────────────────────────────────────────
    const taskDef = new ecs.FargateTaskDefinition(this, 'TaskDef', {
      cpu: 512,
      memoryLimitMiB: 1024,
    })

    // Allow task to send email via SES
    taskDef.addToTaskRolePolicy(
      new iam.PolicyStatement({
        actions: ['ses:SendEmail', 'ses:SendRawEmail'],
        resources: ['*'],
      }),
    )

    taskDef.addContainer('web', {
      image: ecs.ContainerImage.fromEcrRepository(repo, imageTag),
      portMappings: [{ containerPort: 3000 }],
      environment: {
        NODE_ENV: 'production',
        SES_FROM_ADDRESS: `hello@${domainName}`,
        SES_REGION: this.region,
      },
      logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'homepage' }),
    })

    // ── Fargate service ──────────────────────────────────────────────────────
    const sg = new ec2.SecurityGroup(this, 'ServiceSg', { vpc })
    const service = new ecs.FargateService(this, 'Service', {
      cluster,
      taskDefinition: taskDef,
      desiredCount: 1,
      assignPublicIp: false,
      securityGroups: [sg],
    })

    // ── ALB ──────────────────────────────────────────────────────────────────
    const alb = new elbv2.ApplicationLoadBalancer(this, 'Alb', {
      vpc,
      internetFacing: true,
    })

    const listener = alb.addListener('HttpListener', { port: 80, open: true })
    listener.addTargets('EcsFargate', {
      port: 3000,
      protocol: elbv2.ApplicationProtocol.HTTP,
      targets: [service],
      healthCheck: { path: '/', interval: cdk.Duration.seconds(30) },
    })
    sg.addIngressRule(
      ec2.Peer.securityGroupId(alb.connections.securityGroups[0].securityGroupId),
      ec2.Port.tcp(3000),
    )

    // ── Route 53 hosted zone ─────────────────────────────────────────────────
    const zone = route53.HostedZone.fromLookup(this, 'Zone', { domainName })

    // ── ACM cert (us-east-1 required for CloudFront) ─────────────────────────
    const cert = new acm.Certificate(this, 'Cert', {
      domainName,
      subjectAlternativeNames: [`www.${domainName}`],
      validation: acm.CertificateValidation.fromDns(zone),
    })

    // ── CloudFront distribution ──────────────────────────────────────────────
    const distribution = new cloudfront.Distribution(this, 'Cdn', {
      defaultBehavior: {
        origin: new origins.LoadBalancerV2Origin(alb, { protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
      },
      domainNames: [domainName, `www.${domainName}`],
      certificate: cert,
    })

    // ── DNS records ──────────────────────────────────────────────────────────
    new route53.ARecord(this, 'AliasRecord', {
      zone,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    })
    new route53.ARecord(this, 'WwwAliasRecord', {
      zone,
      recordName: 'www',
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    })

    // ── SES identity (domain) ────────────────────────────────────────────────
    new ses.EmailIdentity(this, 'SesIdentity', {
      identity: ses.Identity.publicHostedZone(zone),
    })

    // ── Outputs ──────────────────────────────────────────────────────────────
    new cdk.CfnOutput(this, 'DistributionDomain', { value: distribution.distributionDomainName })
    new cdk.CfnOutput(this, 'EcrRepoUri', { value: repo.repositoryUri })
  }
}

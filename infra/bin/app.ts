#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { HomepageStack } from '../lib/homepage-stack'

const app = new cdk.App()

new HomepageStack(app, 'HomepageStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
  domainName: 'przybytek.com',
  imageTag: process.env.IMAGE_TAG ?? 'latest',
})

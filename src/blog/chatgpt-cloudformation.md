---
tags: post
layout: "layouts/article.njk"
title: "Using ChatGPT to Write CloudFormation"
date: "2023-10-18"
highlightSyntax: true
meta:
  description: The one where the Tyler uses a computer to do computer things.
  image: /blog/assets/post-image-cloudformation-chatgpt.jpg
---

[CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) is not fun to write. The documentation is obtuse. There’s 20 different ways to do everything. Time spent on it feels like yak shaving at best and a total waste at worst. Having said that, the infra provisioning setups you can make with it are helpful and, for most things beyond small personal projects, necessary. So, I’ve been doing what every lazy programmer does. I’m getting a computer to do the unfun work for me.

## The project

For a client project I’m working on right now, I’m using AWS Lambda with EventBridge, Secrets Manager, and CloudWatch. It’s a small project. What I’ve built is a Lambda function that runs at scheduled times every day. Each function invocation takes a certain input that tells the function to complete a certain task. The tasks all interact with the [Bullhorn](https://www.bullhorn.com/) API to modify various records. I’m also using [AWS SAM](https://aws.amazon.com/serverless/sam/) on the project.

## The infra

I’m not an expert in infra provisioning and not an expert in AWS services. But, I’ve used AWS enough over the years to have an understanding of what’s offered and, for the most part, what’s possible. Because of that, I’m able to describe the AWS setup I want in English but, I struggle at times to find the exact CloudFormation incantation I need to accomplish what I’m looking for. Again, that’s in large part because the documentation is all over the place. (**Side note**: I realize there are alternatives to CloudFormation, which I’ve used and will use on other projects, but for this one, I’m using CloudFormation.)

This is where ChatGPT is a perfect tool. It’s hoovered up all of the scattered documentation and blog posts about CloudFormation and can take my specific, but unstructured, infra description and give me back the structured CloudFormation YAML.

## The prompts

When I started did this, I had a rough CloudFormation template that I generated with the SAM CLI and modified for the project. Here’s the first few lines of it:

<pre><code class="language-yaml">AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: >
  bullhorn-entity-updater
Globals:
  Function:
    Tracing: Active
Resources:
  BullhornEntityUpdaterFunction:
    Type: AWS::Serverless::Function
    Properties:
      Description: A Lambda function with multiple available tasks to update Bullhorn entities.
      Runtime: nodejs18.x

# ...template continues, truncated for display
</code></pre>

I fed the template into ChatGPT and told it that I needed help adding resources. There’s nothing sensitive in it, so I can share the [full chat log](https://chat.openai.com/share/4ce3ff0a-dece-4834-bdd4-d4a82a499c3e) that I went back to over a couple days.

For the most part, it’s what you’d expect. After setting the scene, I started prompting with:

<pre><code class="language-text">First, can we add 3 aws cloudwatch events:
- Each one can invoke the BullhornEntityUpdaterFunction
- Each one is on a cron schedule at 1am daily
- Each one sends `{"task": "noop"}` as input
</code></pre>

It responded back with a brief and overly enthusiastic explanation about what it had done and then gave me the complete YAML with the events added in.

<pre><code class="language-yaml">...
Events:  # <-- Add this Events section
  DailyTrigger1:
    Type: Schedule
    Properties:
      Schedule: cron(0 1 * * ? *)
      Input: '{"task": "noop"}'
  DailyTrigger2:
    Type: Schedule
    Properties:
      Schedule: cron(0 1 * * ? *)
      Input: '{"task": "noop"}'
  DailyTrigger3:
    Type: Schedule
    Properties:
      Schedule: cron(0 1 * * ? *)
      Input: '{"task": "noop"}'
...
</code></pre>

Good so far. From there, I could make changes to the names, cron, and input as needed. You can see from my prompt that I understand what I want. This helps me get there.

Something that’s very helpful is being able to ask clarifying questions to help me gain a better understanding. For example, my next prompt:

<pre><code class="language-text">If I change `DailyTrigger1` `DailyTrigger2` `DailyTrigger3` 
will that change the name of the event in the AWS console?</code></pre>

ChatGPT gives a detailed answer:

<pre><code class="language-text">Yes, changing the names DailyTrigger1, DailyTrigger2, 
DailyTrigger3 in the CloudFormation template will change the 
logical IDs of those AWS CloudWatch Event rules. However, it 
won't directly affect the displayed names in the AWS Console.

In AWS CloudFormation, these are known as logical IDs, which 
are used to uniquely identify a resource within a template. 

...answer continues</code></pre>

These are the types of questions I can’t ask static documentation and that is difficult to Google for.

Another interesting exchange later was me asking for Lambda insights.

<pre><code class="language-text">Can we update the function to enable lambda insights?</code></pre>

Which produced a response and the following snippet

<pre><code class="language-yaml">...
Layers:
  - !Sub 'arn:aws:lambda:${AWS::Region}:580247275435:layer:LambdaInsightsExtension:14'  # Please note that the version number (14 here) may change
Policies:
  - Version: '2012-10-17'
    Statement:
      - Effect: Allow
        Action:
          - "cloudwatch:PutMetricData"
          - "logs:CreateLogGroup"
          - "logs:CreateLogStream"
          - "logs:PutLogEvents"
        Resource: "*"
...</code></pre>

This was an instance where I knew more about what I wanted and this wasn’t it. I knew there was a managed policy for this instead of listing the actions like this. So, I needed to edit my prompt to get ChatGPT closer. First I tried:

<pre><code class="language-text">Can we update the function to enable lambda insights following 
best practices?</code></pre>

It came back with the same listed actions so I had to get more specific:

<pre><code class="language-text">Can we update the function to enable lambda insights 
using a managed policy?</code></pre>

That’s what it needed. Along with a detailed explanation it gave back this YAML:

<pre><code class="language-yaml">BullhornEntityUpdaterFunction:
  Type: AWS::Serverless::Function
  Properties:
    ...
    Policies:
      - arn:aws:iam::aws:policy/CloudWatchLambdaInsightsExecutionRolePolicy
    Layers:
      - !Sub 'arn:aws:lambda:${AWS::Region}:580247275435:layer:LambdaInsightsExtension:14'
</code></pre>

Again, this was me having enough knowledge about what I wanted to be able to guide ChatGPT to the best outcome. Note that in that exchange I’m editing the prompt, not creating new prompts. That’s a habit I’ve picked up from Jeremy Howard’s excellent “[A Hackers' Guide to Language Models](https://youtu.be/jkrNMKz9pWU?si=w5MH0Hh9KzGG891k)”.

It’s worth reading through the [full chat log](https://chat.openai.com/share/4ce3ff0a-dece-4834-bdd4-d4a82a499c3e). There are more interesting little bits that show how I’m going back and forth to make sure I’m getting what I need and that I understand what we’re doing.

So, not the singularity, but, this is the most practical, day-to-day helpful thing I’ve done with any LLM so far. Coming up with ideas for infrastructure is fun. Writing YAML is not. Having computers to do the unfun, tedious parts of the job is what they’re here for.

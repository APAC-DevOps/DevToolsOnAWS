# DevToolsOnAWS

The code base in this repo is to demonstrate how to implement self-recoverable development toolsets on AWS via automation. This is not to say you can launch up your DevTools environment (git, build, artifacts, wiki and alike) by simply doing a "git pull" and issuing "launch up" command, as the code base is inaccurate (for I have to remove some sensitive information, otherwise, you won't even see any of the code in this repo) and there is some manual operation which is required when doing initial setup.

Though, the sample code is for implementing a development toolset based on Bitbucket, Bamboo, Confluence and Nexus. However, it is possible to implement your own self-recoverable and self-manageable development toolset by making changes to the code base in this repo. Your development toolset could be a commercial solution (e.g. Atlassian product), or be a pure open source solution, or even a combination of commercial products and open source tools.

What worth to point out is that all the building blocks (scripts, templates, and config files) in this repo consists of a terminal tool, which you can either run from within your local terminal or integrate it into your CI/CD pipeline and let your build job triggers the execution of this tool or a portion of this tool. This does not mean that you can not run a single script from this repo directly from your terminal environment. Take the script - ./src/script/ebs/ebs-attach.sh for example, you can successfully run that script by providing sufficient command line augments on an EC2 instance with proper IAM role configured. A sample configuration of IAM role's policy which allows an EC2 instance to attach EBS volume can be found in the CloudFormation template - ./src/basesys-stack/scm/demo-scm-bitbucket.json.

To set up your local environment for having a play of this devops tool:
1. git clone https://github.com/APAC-DevOps/DevToolsOnAWS.git
2. cd into your local repository directory
3. npm Install
4. npm install grunt-cli -g
5. grunt --help  # you may need a little bit javascript knowledge to understand its output

Below is a short-list of helpful tech workarounds that you can find in this repo:
1. incorporate cloud-init, metadata, launchconfiguration and auto-scaling group resources for giving your systems or/and apps the capability of auto-rehealing;
2. "master-sub" fashioned CloudFormation templates organised in real world project;
3. shell scripts for mounting EBS volume, updating DNS records, and configuring network routes;
4. the advantage of combining CloudFormation Templates and AWS SDK scripts;
5. and a lot more to be discovered by you

Perhaps, other than the code itself, the most valuable nutrition in this repo is the methodologies and techniques that I used to solve real world problem. And because a large portion of code is CloudFormation template, which would be beneficial to AWS learners as well.

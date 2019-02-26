# DevToolsOnAWS

The code base in this repo is to demonstrate how to implement self-recoverable development toolsets on AWS via automation. This is not to say you can launch up your DevTools environment (git, build, artifacts, wiki and alike) by simply doing a "git pull" and issuing "launch up" command, as the code base is inaccurate (for I have to remove some sensitive information, otherwise, you won't even see any of the code in this repo) and there is some manual operation which is required when doing initial setup.

Though, the sample code is for implementing a development toolset based on Bitbucket, Bamboo, Confluence and Nexus. However, it is possible to implement your own self-recoverable and self-manageable development toolset by making changes to the code base in this repo. Your development toolset could be a commercial solution (e.g. Atlassian product), or be a pure open source solution, or even a combination of commercial products and open source tools.

Again, the primary purpose of sharing with you the code in this repo is to help you easy the "technical-challenge" solving process when you implement DevTools environment either in-house or for your customers.

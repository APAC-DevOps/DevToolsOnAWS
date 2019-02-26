
module.exports = function(grunt) {

	var path = require('path');
	var package = require("./package.json");
	var creds = grunt.file.readJSON("creds/creds.json");
	var para_basesys_vpc = grunt.file.readJSON("parameters/basesys-vpc.json");

//--------------------------------------------------- CONFIG BLOCKS ---------------------------------------------------

	grunt.initConfig({

		pkg: grunt.file.readJSON("package.json"),

		clean: {
            dist: {
            	src: [ "dist" ]
            },
						pki: {
            	src: [ "easyrsa3" ]
            }
        },

        copy: {
        	dist: {
        		files: [
        			{ expand: true, cwd: "src", src: "**/*", dest: "dist" }
        		]
        	},
					easyrsa: {
        		files: [
        			{ expand: true, cwd: "node_modules/easy-rsa/easyrsa3", src: "**/*", dest: "easyrsa3" }
        		]
        	}
        },

		aws: grunt.file.readJSON("creds/creds.json"),

		s3: {
			basesys: {
				options: {
					"accessKeyId": creds.AccessKeyId,
					"secretAccessKey": creds.SecretAccessKey,
					"region": para_basesys_vpc.S3Region,
					"bucket": "stacks-tokyo-demo",
					"access": "private",
					"gzip": false,
					"overwrite": true,
					"cache": false
				},
				"cwd": "dist/basesys-stack",
				"src": "**/*",
				"dest": "basesys-stack/"
			},
			infofrontier: {
				options: {
					"accessKeyId": creds.AccessKeyId,
					"secretAccessKey": creds.SecretAccessKey,
					"region": para_basesys_vpc.S3Region,
					"bucket": "stacks-tokyo-demo",
					"access": "private",
					"gzip": false,
					"overwrite": true,
					"cache": false
				},
				"cwd": "dist/infofrontier-stack",
				"src": "**/*",
				"dest": ""
			},
		script: {
			options: {
				"accessKeyId": creds.AccessKeyId,
				"secretAccessKey": creds.SecretAccessKey,
				"region": para_basesys_vpc.S3Region,
				"bucket": "scripts-tokyo-demo",
				"access": "private",
				"gzip": false,
				"overwrite": true,
				"cache": false
			},
			"cwd": "dist/script",
			"src": "**/*"
		},
		binary: {
			options: {
				"accessKeyId": creds.AccessKeyId,
				"secretAccessKey": creds.SecretAccessKey,
				"region": para_basesys_vpc.S3Region,
				"bucket": "binaries-tokyo-demo",
				"access": "private",
				"gzip": false,
				"overwrite": true,
				"cache": false
			},
			"cwd": "binary",
			"src": "**/*",
			"dest": "applications/"
		}
	},

		processTemplate: {
			prereq: {
				"src": "dist/basesys-stack/demo-stack-prereqs.json",
				"key": "devopsinfra-prereqs"
			},
			devopsinfra: {
				"src": "dist/basesys-stack/demo-stack.json",
				"key": "devopsinfra"
			},
			demoenv: {
				"src": "dist/infofrontier-stack/demoenv/demoenv-stack-entry.json",
				"key": "demoenv"
			},
			demoenv_app_infofrontier: {
				"src": "dist/infofrontier-stack/app/infofrontier-demo-php.json",
				"key": "demoenv-app-infofrontier"
			},
			prodenv: {
				"src": "dist/infofrontier-stack/prodenv/prodenv-stack-entry.json",
				"key": "prodenv"
			},
			prodenv_app_infofrontier: {
				"src": "dist/infofrontier-stack/app/infofrontier-loadbalancer-cluster.json",
				"key": "prodenv-app-infofrontier"
			}
		},

		createStack: {
			prereq: {
				"name": "devopsinfra-prereqs",
				"templateKey": "devopsinfra-prereqs",
				"outputKey": "devopsinfra-prereqs.out",
				"region": para_basesys_vpc.Region
			},

			devopsinfra: {
				"name": "devopsinfra",
				"templateKey": "devopsinfra",
				"outputKey": "devopsinfra.out",
				"region": para_basesys_vpc.Region,
				"capabilities": [
					"CAPABILITY_IAM"
				]
			},

			demoenv:{
				"name": "demoenv-stack-entry",
				"templateKey": "demoenv",
				"outputKey": "demoenv.out",
				"region": para_basesys_vpc.Region,
				"capabilities": [ "CAPABILITY_IAM" ]
			},

			demoenv_app_infofrontier:{
				"name": "demoenv-app-infofrontier",
				"templateKey": "demoenv-app-infofrontier",
				"outputKey": "demoapp.out",
				"region": para_basesys_vpc.Region,
				"capabilities": [ "CAPABILITY_IAM" ]
			},

			prodenv:{
				"name": "prodenv-stack-entry",
				"templateKey": "prodenv",
				"outputKey": "prodenv.out",
				"region": para_basesys_vpc.Region,
				"capabilities": [ "CAPABILITY_IAM" ]
			},

			prodenv_app_infofrontier:{
				"name": "prodenv-app-infofrontier",
				"templateKey": "prodenv-app-infofrontier",
				"outputKey": "prodapp.out",
				"region": para_basesys_vpc.Region,
				"capabilities": [ "CAPABILITY_IAM" ]
			}
		},

		updateStack: {
			prereq: {
				"name": "devopsinfra-prereqs",
				"templateKey": "devopsinfra-prereqs",
				"outputKey": "devopsinfra-prereqs.out",
				"region": para_basesys_vpc.Region
			},

			devopsinfra: {
				"name": "devopsinfra",
				"templateKey": "devopsinfra",
				"outputKey": "devopsinfra.out",
				"region": para_basesys_vpc.Region,
				"capabilities": [
					"CAPABILITY_IAM"
				]
			},

			demoenv:{
				"name": "demoenv-stack-entry",
				"templateKey": "demoenv",
				"outputKey": "demoenv.out",
				"region": para_basesys_vpc.Region,
				"capabilities": [ "CAPABILITY_IAM" ]
			},

			demoenv_app_infofrontier:{
				"name": "demoenv-app-infofrontier",
				"templateKey": "demoenv-app-infofrontier",
				"outputKey": "demoapp.out",
				"region": para_basesys_vpc.Region,
				"capabilities": [ "CAPABILITY_IAM" ]
			},

			prodenv:{
				"name": "prodenv-stack-entry",
				"templateKey": "prodenv",
				"outputKey": "prodenv.out",
				"region": para_basesys_vpc.Region,
				"capabilities": [ "CAPABILITY_IAM" ]
			},

			prodenv_app_infofrontier:{
				"name": "prodenv-app-infofrontier",
				"templateKey": "prodenv-app-infofrontier",
				"outputKey": "prodapp.out",
				"region": para_basesys_vpc.Region,
				"capabilities": [ "CAPABILITY_IAM" ]
			}
		},

		shell: {
			setperm: {
				command: "chmod +x easyrsa",
				options: {
					stderr: false,
					execOptions: {
						cwd: "easyrsa3"
					}
				}
			},
			initpki: {
				command: "./easyrsa init-pki",
				options: {
					stderr: false,
					execOptions: {
						cwd: "easyrsa3"
					}
				}
			},
			buildca: {
				command: "./easyrsa --batch --vars=./var --req-cn=OpenVPN build-ca nopass",
				options: {
					stderr: false,
					execOptions: {
						cwd: "easyrsa3"
					}
				}
			},
			genreq: {
				command: "./easyrsa --batch --vars=./var --req-cn=openvpn.server gen-req openvpn.server nopass",
				options: {
					stderr: false,
					execOptions: {
						cwd: "easyrsa3"
					}
				}
			},
			signreq: {
				command: "./easyrsa --batch --vars=./var sign-req server openvpn.server",
				options: {
					stderr: false,
					execOptions: {
						cwd: "easyrsa3"
					}
				}
			},
			gencrl: {
				command: "./easyrsa --batch gen-crl",
				options: {
					stderr: false,
					execOptions: {
						cwd: "easyrsa3"
					}
				}
			},
			gendh: {
				command: "./easyrsa --batch gen-dh",
				options: {
					stderr: false,
					execOptions: {
						cwd: "easyrsa3"
					}
				}
			}
		},

		'compile-handlebars': {
        	easyrsavar: {
        		template: 'src/script/openvpn/var',
        		templateData: null,
        		output: 'easyrsa3/var'
        	}
        },
	});

	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-shell");
	grunt.loadNpmTasks("grunt-aws");
	grunt.loadNpmTasks("grunt-niteo-awscloudformation");
	grunt.loadNpmTasks('grunt-compile-handlebars');

	grunt.registerTask("init", function() {

		grunt.file.mkdir("dist");
	});

//------------------------------------------------ SET AND UNSET CREDS ------------------------------------------------

	grunt.registerTask("setcreds", function() {
		grunt.file.write(process.env['HOME'] + "/.aws/infracredentials", "[default]\naws_access_key_id = " + creds.AccessKeyId + "\n" + "aws_secret_access_key = " + creds.SecretAccessKey + "\n");
	});

	grunt.registerTask("unsetcreds", function() {
		grunt.file.write(process.env['HOME'] + "/.aws/infracredentials", "[default]\naws_access_key_id = \n" + "aws_secret_access_key = \n");
	});

//-------------------------------------- DEPLOY STACKS TO CLIENT CLOUD FORMATION --------------------------------------

	grunt.registerTask("infradeploy", function() {
		var clientData = grunt.file.readJSON("clients/infofrontier.json");

		grunt.task.run("push");
		grunt.task.run("deploy_prereq");
		grunt.task.run("write_prereq_outputs");
		grunt.task.run("deploy_devopsinfra");
		grunt.task.run("write_devopsinfra_outputs");


		if(clientData.DeployDemoEnv == "yes") {
			grunt.task.run( [ "create-demoenv-main", "write-demoenv-output" ] );
		}

		if(clientData.DeployProdEnv == "yes" ) {
			grunt.task.run( [ "create-prodenv-main", "write-prodenv-output" ] )
		}

		if(clientData.InitVpnKeys) {
			grunt.task.run("init_openvpn_keys");
		}
	});

	// Create VPC Host Zone
	grunt.registerTask("deploy_prereq", function() {
		var clientData = grunt.file.readJSON("clients/infofrontier.json");

		grunt.task.run("processTemplate:prereq");

		var params = [
			{ "ParameterKey": "InternalDnsSuffix", "ParameterValue": clientData.InternalDnsSuffix },
			{ "ParameterKey": "VPCRegion", "ParameterValue": para_basesys_vpc.Region },
			{ "ParameterKey": "DefaultVpcId", "ParameterValue": clientData.DefaultVpcId }
		];

		grunt.config.set("createStack.prereq.parameters", params);
		grunt.task.run("createStack:prereq");
	});

	grunt.registerTask("deploy_devopsinfra", function() {
		var clientData = grunt.file.readJSON("clients/infofrontier.json");
		var outputs = grunt.option("devopsinfra-prereqs.out").Outputs;
		var InternalDnsHostedZoneId;

		for(var i=0; i<outputs.length; i++) {
			var key = outputs[i].OutputKey;
			if(key == "InternalDnsHostedZoneId") {
				InternalDnsHostedZoneId = outputs[i].OutputValue;
			}
		}

		grunt.task.run("processTemplate:devopsinfra");

		var params = [

			{ "ParameterKey": "BucketKeysPrefix", "ParameterValue": clientData.BucketKeysPrefix },
			{ "ParameterKey": "BucketSuffix", "ParameterValue": clientData.BucketSuffix },
			{ "ParameterKey": "BuildDataVolume", "ParameterValue": clientData.BuildDataVolume },
			{ "ParameterKey": "BuildHostname", "ParameterValue": clientData.BuildHostname },
			{ "ParameterKey": "BuildInstanceType", "ParameterValue": clientData.BuildInstanceType },
			{ "ParameterKey": "BuildVersion", "ParameterValue": clientData.BuildVersion },
			{ "ParameterKey": "CompanyName", "ParameterValue": clientData.CompanyName },
			{ "ParameterKey": "CreateBuildCluster", "ParameterValue": clientData.CreateBuildCluster },
			{ "ParameterKey": "CreateNatGateway", "ParameterValue": clientData.CreateNatGateway },
			{ "ParameterKey": "CreateRepoCluster", "ParameterValue": clientData.CreateRepoCluster },
			{ "ParameterKey": "CreateScmCluster", "ParameterValue": clientData.CreateScmCluster },
			{ "ParameterKey": "CreateVpnSvr", "ParameterValue": clientData.CreateVpnSvr },
			{ "ParameterKey": "CreateWikiCluster", "ParameterValue": clientData.CreateWikiCluster },
			{ "ParameterKey": "CriticalAlertEmail", "ParameterValue": clientData.CriticalAlertEmail },
			{ "ParameterKey": "EnableSsl", "ParameterValue": clientData.EnableSsl },
			{ "ParameterKey": "ExternalDnsHostedZoneId", "ParameterValue": clientData.ExternalDnsHostedZoneId },
			{ "ParameterKey": "ExternalDnsSuffix", "ParameterValue": clientData.ExternalDnsSuffix },
			{ "ParameterKey": "InternalDnsHostedZoneId", "ParameterValue": InternalDnsHostedZoneId },
			{ "ParameterKey": "InternalDnsSuffix", "ParameterValue": clientData.InternalDnsSuffix },
			{ "ParameterKey": "IsScmClusterPublic", "ParameterValue": clientData.IsScmClusterPublic },
			{ "ParameterKey": "IsBuildClusterPublic", "ParameterValue": clientData.IsBuildClusterPublic },
			{ "ParameterKey": "NotificationEmail", "ParameterValue": clientData.NotificationEmail },
			{ "ParameterKey": "RepoDataVolume", "ParameterValue": clientData.RepoDataVolume },
			{ "ParameterKey": "RepoHostname", "ParameterValue": clientData.RepoHostname },
			{ "ParameterKey": "RepoInstanceType", "ParameterValue": clientData.RepoInstanceType },
			{ "ParameterKey": "RepoVersion", "ParameterValue": clientData.RepoVersion },
			{ "ParameterKey": "ScmDataVolume", "ParameterValue": clientData.ScmDataVolume },
			{ "ParameterKey": "ScmHostname", "ParameterValue": clientData.ScmHostname },
			{ "ParameterKey": "ScmInstanceType", "ParameterValue": clientData.ScmInstanceType },
			{ "ParameterKey": "ScmVersion", "ParameterValue": clientData.ScmVersion },
			{ "ParameterKey": "SingleZonePreference", "ParameterValue": clientData.SingleZonePreference },
			{ "ParameterKey": "TimeZone", "ParameterValue": clientData.TimeZone },
			{ "ParameterKey": "VpnHostname", "ParameterValue": clientData.VpnHostname },
			{ "ParameterKey": "VpnInstanceType", "ParameterValue": clientData.VpnInstanceType },
			{ "ParameterKey": "WikiDataVolume", "ParameterValue": clientData.WikiDataVolume },
			{ "ParameterKey": "WikiHostname", "ParameterValue": clientData.WikiHostname },
			{ "ParameterKey": "WikiInstanceType", "ParameterValue": clientData.WikiInstanceType },
			{ "ParameterKey": "WikiVersion", "ParameterValue": clientData.WikiVersion },

			// { "ParameterKey": "VpnEipAllocationId", "ParameterValue": vpnEipAloocationId },

			{ "ParameterKey": "WikiDatabasePassword", "ParameterValue": creds.WikiDbPassword },
			{ "ParameterKey": "BuildDatabasePassword", "ParameterValue": creds.BuildDbPassword },
			{ "ParameterKey": "ScmDatabasePassword", "ParameterValue": creds.ScmDbPassword },


			{ "ParameterKey": "AllDestinationCidrBlock", "ParameterValue": para_basesys_vpc.AllDestinationCidrBlock },
			{ "ParameterKey": "VpcCidrBlock", "ParameterValue": para_basesys_vpc.VpcCidrBlock },
			{ "ParameterKey": "PeeredVpcCidr1", "ParameterValue": para_basesys_vpc.PeeredVpcCidr1 },
			{ "ParameterKey": "PublicRoutingSubnetZone1CidrBlock", "ParameterValue": para_basesys_vpc.PublicRoutingSubnetZone1CidrBlock },
			{ "ParameterKey": "PublicRoutingSubnetZone2CidrBlock", "ParameterValue": para_basesys_vpc.PublicRoutingSubnetZone2CidrBlock },
			{ "ParameterKey": "PrivateScmSubnetZone1CidrBlock", "ParameterValue": para_basesys_vpc.PrivateScmSubnetZone1CidrBlock },
			{ "ParameterKey": "PrivateScmSubnetZone2CidrBlock", "ParameterValue": para_basesys_vpc.PrivateScmSubnetZone2CidrBlock },
			{ "ParameterKey": "PrivateBuildSubnetZone1CidrBlock", "ParameterValue": para_basesys_vpc.PrivateBuildSubnetZone1CidrBlock },
			{ "ParameterKey": "PrivateBuildSubnetZone2CidrBlock", "ParameterValue": para_basesys_vpc.PrivateBuildSubnetZone2CidrBlock },
			{ "ParameterKey": "PrivateRepoSubnetZone1CidrBlock", "ParameterValue": para_basesys_vpc.PrivateRepoSubnetZone1CidrBlock },
			{ "ParameterKey": "PrivateRepoSubnetZone2CidrBlock", "ParameterValue": para_basesys_vpc.PrivateRepoSubnetZone2CidrBlock },
			{ "ParameterKey": "PrivateWikiSubnetZone1CidrBlock", "ParameterValue": para_basesys_vpc.PrivateWikiSubnetZone1CidrBlock },
			{ "ParameterKey": "PrivateWikiSubnetZone2CidrBlock", "ParameterValue": para_basesys_vpc.PrivateWikiSubnetZone2CidrBlock },
			{ "ParameterKey": "Region", "ParameterValue": para_basesys_vpc.S3Region },
			{ "ParameterKey": "VpnSubnetRange", "ParameterValue": para_basesys_vpc.VpnSubnetRange },
			{ "ParameterKey": "VpnSubnetCidr", "ParameterValue": para_basesys_vpc.VpnSubnetCidr },
			{ "ParameterKey": "VpnPushRoute1", "ParameterValue": para_basesys_vpc.VpnPushRoute1 },
			{ "ParameterKey": "VpnPushRoute2", "ParameterValue": para_basesys_vpc.VpnPushRoute2 },
			{ "ParameterKey": "VpnPushRoute3", "ParameterValue": para_basesys_vpc.VpnPushRoute3 }
		];

		grunt.config.set("createStack.devopsinfra.parameters", params);
		grunt.task.run("createStack:devopsinfra");
	});

	grunt.registerTask("write_prereq_outputs", function() {

	var outputs = grunt.option("devopsinfra-prereqs.out").Outputs;
	var config = {};

	for(var i=0; i<outputs.length; i++) {
		config[outputs[i].OutputKey] = outputs[i].OutputValue;
	}

	grunt.file.write("outputs/outputs-" + getRegionName(para_basesys_vpc.Region) + "-prereq.json", JSON.stringify(config, null, 4));
});



grunt.registerTask("write_devopsinfra_outputs", function() {

		var outputs = grunt.option("devopsinfra.out").Outputs;
		var config = {};

		for(var i=0; i<outputs.length; i++) {
			config[outputs[i].OutputKey] = outputs[i].OutputValue;
		}

		grunt.file.write("outputs/outputs-" + getRegionName(para_basesys_vpc.Region) + "-devopsinfra.json", JSON.stringify(config, null, 4));
	});

//--------------------------------------CREATE DEMO ENV TO CLIENT CLOUD FORMATION--------------------------------------

grunt.registerTask("create-demoenv", [ "init", "copy:dist", "s3:infofrontier", "create-demoenv-main", "write-demoenv-output" ]);

grunt.registerTask("create-demoenv-main", function() {
	var clientData = grunt.file.readJSON("clients/infofrontier.json");
	var basesysOutput = grunt.file.readJSON("outputs/outputs-" + getRegionName(para_basesys_vpc.Region) + "-prereq.json");
	var devopsinfraOutput = grunt.file.readJSON("outputs/outputs-" + getRegionName(para_basesys_vpc.Region) + "-devopsinfra.json");
	var basesysPara = grunt.file.readJSON("parameters/basesys-vpc.json");
	var demoenv_vpc = grunt.file.readJSON("parameters/devenv-vpc.json");

	grunt.task.run("processTemplate:demoenv");

	var params = [
		{ "ParameterKey": "InternalDnsHostedZoneId", "ParameterValue": basesysOutput.InternalDnsHostedZoneId },

    { "ParameterKey": "SgBuildSvr", "ParameterValue": devopsinfraOutput.SgBuildSvr },
		{ "ParameterKey": "BasesysVpcId", "ParameterValue": devopsinfraOutput.VpcId },
		{ "ParameterKey": "BaseSysVpcPrivateRouteTableZone1", "ParameterValue": devopsinfraOutput.PrivateRouteTableZone1 },
		{ "ParameterKey": "BaseSysVpcPrivateRouteTableZone2", "ParameterValue": devopsinfraOutput.PrivateRouteTableZone2 },


		{ "ParameterKey": "BasesysVpcCidrBlock", "ParameterValue": basesysPara.VpcCidrBlock },

		{ "ParameterKey": "AllDestinationCidrBlock", "ParameterValue": para_basesys_vpc.AllDestinationCidrBlock },
		{ "ParameterKey": "NexusSubnetCidr", "ParameterValue": para_basesys_vpc.NexusSubnetCidr },
		{ "ParameterKey": "VpnSubnetCidr", "ParameterValue": para_basesys_vpc.VpnSubnetCidr },

		{ "ParameterKey": "CreateBasesysVpcPeering", "ParameterValue": demoenv_vpc.CreateBasesysVpcPeering},
		{ "ParameterKey": "VpcCidrBlock", "ParameterValue": demoenv_vpc.VpcCidrBlock },
		{ "ParameterKey": "PublicRoutingSubnetZone1CidrBlock", "ParameterValue": demoenv_vpc.PublicRoutingSubnetZone1CidrBlock },
		{ "ParameterKey": "PublicRoutingSubnetZone2CidrBlock", "ParameterValue": demoenv_vpc.PublicRoutingSubnetZone2CidrBlock },
		{ "ParameterKey": "PrivateFrontEndAppSubnetZone1CidrBlock", "ParameterValue": demoenv_vpc.PrivateFrontEndAppSubnetZone1CidrBlock },
		{ "ParameterKey": "PrivateFrontEndAppSubnetZone2CidrBlock", "ParameterValue": demoenv_vpc.PrivateFrontEndAppSubnetZone2CidrBlock },
		{ "ParameterKey": "PrivateBackEndAppSubnetZone1CidrBlock", "ParameterValue": demoenv_vpc.PrivateBackEndAppSubnetZone1CidrBlock },
		{ "ParameterKey": "PrivateBackEndAppSubnetZone2CidrBlock", "ParameterValue": demoenv_vpc.PrivateBackEndAppSubnetZone2CidrBlock },

		{ "ParameterKey": "CompanyName", "ParameterValue": clientData.CompanyName },
		{ "ParameterKey": "NotificationEmail", "ParameterValue": clientData.NotificationEmail },
		{ "ParameterKey": "CriticalAlertEmail", "ParameterValue": clientData.CriticalAlertEmail },
		{ "ParameterKey": "InternalDnsSuffix", "ParameterValue": clientData.InternalDnsSuffix },
		{ "ParameterKey": "BucketSuffix", "ParameterValue": clientData.BucketSuffix },
		{ "ParameterKey": "BucketKeysPrefix", "ParameterValue": clientData.BucketKeysPrefix },
		{ "ParameterKey": "BucketStacksPrefix", "ParameterValue": clientData.BucketStacksPrefix },
		{ "ParameterKey": "BucketScriptsPrefix", "ParameterValue": clientData.BucketScriptsPrefix },
		{ "ParameterKey": "BucketBinariesPrefix", "ParameterValue": clientData.BucketBinariesPrefix },
		{ "ParameterKey": "TimeZone", "ParameterValue": clientData.TimeZone }
	];

	grunt.config.set("createStack.demoenv.parameters", params);
	grunt.task.run("createStack:demoenv")
});

grunt.registerTask("write-demoenv-output", function() {

	var outputs = grunt.option("demoenv.out").Outputs;
	var config = {};

	for(var i=0; i<outputs.length; i++) {
		config[outputs[i].OutputKey] = outputs[i].OutputValue;
	}

	 grunt.file.write("outputs/outputs-" + getRegionName(para_basesys_vpc.Region) + "-demoenv.json", JSON.stringify(config, null, 4));
});

//--------------------------------------CREATE PROD ENV TO CLIENT CLOUD FORMATION--------------------------------------

grunt.registerTask("create-prodenv", [ "init", "copy:dist", "s3:infofrontier", "create-prodenv-main", "write-prodenv-output" ] )

grunt.registerTask("create-prodenv-main", function() {
	var clientData = grunt.file.readJSON("clients/infofrontier.json");
	var basesysOutput = grunt.file.readJSON("outputs/outputs-" + getRegionName(para_basesys_vpc.Region) + "-prereq.json");
 	var devopsinfraOutput = grunt.file.readJSON("outputs/outputs-" + getRegionName(para_basesys_vpc.Region) + "-devopsinfra.json");
 	var basesysPara = grunt.file.readJSON("parameters/basesys-vpc.json");
	var prodenv_vpc = grunt.file.readJSON("parameters/prodenv-vpc.json");

	grunt.task.run("processTemplate:prodenv");

	var params = [
		{ "ParameterKey": "InternalDnsHostedZoneId", "ParameterValue": basesysOutput.InternalDnsHostedZoneId },

    { "ParameterKey": "SgBuildSvr", "ParameterValue": devopsinfraOutput.SgBuildSvr },
		{ "ParameterKey": "BasesysVpcId", "ParameterValue": devopsinfraOutput.VpcId },
		{ "ParameterKey": "BaseSysVpcPrivateRouteTableZone1", "ParameterValue": devopsinfraOutput.PrivateRouteTableZone1 },
		{ "ParameterKey": "BaseSysVpcPrivateRouteTableZone2", "ParameterValue": devopsinfraOutput.PrivateRouteTableZone2 },

		{ "ParameterKey": "BasesysVpcCidrBlock", "ParameterValue": basesysPara.VpcCidrBlock },


		{ "ParameterKey": "AllDestinationCidrBlock", "ParameterValue": para_basesys_vpc.AllDestinationCidrBlock },
		{ "ParameterKey": "NexusSubnetCidr", "ParameterValue": para_basesys_vpc.NexusSubnetCidr },
		{ "ParameterKey": "VpnSubnetCidr", "ParameterValue": para_basesys_vpc.VpnSubnetCidr },

		{ "ParameterKey": "CreateBasesysVpcPeering", "ParameterValue": prodenv_vpc.CreateBasesysVpcPeering},
		{ "ParameterKey": "VpcCidrBlock", "ParameterValue": prodenv_vpc.VpcCidrBlock },
		{ "ParameterKey": "PublicRoutingSubnetZone1CidrBlock", "ParameterValue": prodenv_vpc.PublicRoutingSubnetZone1CidrBlock },
		{ "ParameterKey": "PublicRoutingSubnetZone2CidrBlock", "ParameterValue": prodenv_vpc.PublicRoutingSubnetZone2CidrBlock },
		{ "ParameterKey": "PrivateFrontEndAppSubnetZone1CidrBlock", "ParameterValue": prodenv_vpc.PrivateFrontEndAppSubnetZone1CidrBlock },
		{ "ParameterKey": "PrivateFrontEndAppSubnetZone2CidrBlock", "ParameterValue": prodenv_vpc.PrivateFrontEndAppSubnetZone2CidrBlock },
		{ "ParameterKey": "PrivateBackEndAppSubnetZone1CidrBlock", "ParameterValue": prodenv_vpc.PrivateBackEndAppSubnetZone1CidrBlock },
		{ "ParameterKey": "PrivateBackEndAppSubnetZone2CidrBlock", "ParameterValue": prodenv_vpc.PrivateBackEndAppSubnetZone2CidrBlock },

		{ "ParameterKey": "CompanyName", "ParameterValue": clientData.CompanyName },
		{ "ParameterKey": "NotificationEmail", "ParameterValue": clientData.NotificationEmail },
		{ "ParameterKey": "CriticalAlertEmail", "ParameterValue": clientData.CriticalAlertEmail },
		{ "ParameterKey": "InternalDnsSuffix", "ParameterValue": clientData.InternalDnsSuffix },
		{ "ParameterKey": "BucketSuffix", "ParameterValue": clientData.BucketSuffix },
		{ "ParameterKey": "BucketKeysPrefix", "ParameterValue": clientData.BucketKeysPrefix },
		{ "ParameterKey": "BucketStacksPrefix", "ParameterValue": clientData.BucketStacksPrefix },
		{ "ParameterKey": "BucketScriptsPrefix", "ParameterValue": clientData.BucketScriptsPrefix },
		{ "ParameterKey": "BucketBinariesPrefix", "ParameterValue": clientData.BucketBinariesPrefix },
		{ "ParameterKey": "TimeZone", "ParameterValue": clientData.TimeZone }
	];

	grunt.config.set("createStack.prodenv.parameters", params);
	grunt.task.run("createStack:prodenv")
});

grunt.registerTask("write-prodenv-output", function() {

	var outputs = grunt.option("prodenv.out").Outputs;
	var config = {};

	for(var i=0; i<outputs.length; i++) {
		config[outputs[i].OutputKey] = outputs[i].OutputValue;
	}

	 grunt.file.write("outputs/outputs-" + getRegionName(para_basesys_vpc.Region) + "-prodenv.json", JSON.stringify(config, null, 4));
});


//-------------------------------------- UPDATE STACKS TO CLIENT CLOUD FORMATION --------------------------------------

	grunt.registerTask("infraupdate", function() {
		var clientData = grunt.file.readJSON("clients/infofrontier.json");

		grunt.task.run("push");
		grunt.task.run("update_prereq");
		grunt.task.run("write_prereq_outputs");
		grunt.task.run("update_devopsinfra");
		grunt.task.run("write_devopsinfra_outputs");


		if(clientData.DeployDemoEnv == "yes" ) {
			grunt.task.run( [ "update-demoenv-main", "write-demoenv-output" ] )
		}

		if(clientData.DeployProdEnv == "yes" ) {
			grunt.task.run( [ "update-prodenv-main", "write-prodenv-output" ] )
		}

		if(clientData.InitVpnKeys) {
			grunt.task.run("init_openvpn_keys");
		}
	});

	// Create VPC Host Zone
	grunt.registerTask("update_prereq", function() {
		var clientData = grunt.file.readJSON("clients/infofrontier.json");

		grunt.task.run("processTemplate:prereq");

		var params = [
			{ "ParameterKey": "InternalDnsSuffix", "ParameterValue": clientData.InternalDnsSuffix },
			{ "ParameterKey": "VPCRegion", "ParameterValue": para_basesys_vpc.Region },
			{ "ParameterKey": "DefaultVpcId", "ParameterValue": clientData.DefaultVpcId }
		];

		grunt.config.set("createStack.prereq.parameters", params);
		grunt.task.run("createStack:prereq");
	});

	grunt.registerTask("update_devopsinfra", function() {
		var clientData = grunt.file.readJSON("clients/infofrontier.json");
		var outputs = grunt.option("devopsinfra-prereqs.out").Outputs;
		var InternalDnsHostedZoneId;

		for(var i=0; i<outputs.length; i++) {
			var key = outputs[i].OutputKey;
			if(key == "InternalDnsHostedZoneId") {
				InternalDnsHostedZoneId = outputs[i].OutputValue;
			}
		}

		grunt.task.run("processTemplate:devopsinfra");

		var params = [

			{ "ParameterKey": "BucketKeysPrefix", "ParameterValue": clientData.BucketKeysPrefix },
			{ "ParameterKey": "BucketSuffix", "ParameterValue": clientData.BucketSuffix },
			{ "ParameterKey": "BuildDataVolume", "ParameterValue": clientData.BuildDataVolume },
			{ "ParameterKey": "BuildHostname", "ParameterValue": clientData.BuildHostname },
			{ "ParameterKey": "BuildInstanceType", "ParameterValue": clientData.BuildInstanceType },
			{ "ParameterKey": "BuildVersion", "ParameterValue": clientData.BuildVersion },
			{ "ParameterKey": "CompanyName", "ParameterValue": clientData.CompanyName },
			{ "ParameterKey": "CreateBuildCluster", "ParameterValue": clientData.CreateBuildCluster },
			{ "ParameterKey": "CreateNatGateway", "ParameterValue": clientData.CreateNatGateway },
			{ "ParameterKey": "CreateRepoCluster", "ParameterValue": clientData.CreateRepoCluster },
			{ "ParameterKey": "CreateScmCluster", "ParameterValue": clientData.CreateScmCluster },
			{ "ParameterKey": "CreateVpnSvr", "ParameterValue": clientData.CreateVpnSvr },
			{ "ParameterKey": "CreateWikiCluster", "ParameterValue": clientData.CreateWikiCluster },
			{ "ParameterKey": "CriticalAlertEmail", "ParameterValue": clientData.CriticalAlertEmail },
			{ "ParameterKey": "EnableSsl", "ParameterValue": clientData.EnableSsl },
			{ "ParameterKey": "ExternalDnsHostedZoneId", "ParameterValue": clientData.ExternalDnsHostedZoneId },
			{ "ParameterKey": "ExternalDnsSuffix", "ParameterValue": clientData.ExternalDnsSuffix },
			{ "ParameterKey": "InternalDnsHostedZoneId", "ParameterValue": InternalDnsHostedZoneId },
			{ "ParameterKey": "InternalDnsSuffix", "ParameterValue": clientData.InternalDnsSuffix },
			{ "ParameterKey": "IsScmClusterPublic", "ParameterValue": clientData.IsScmClusterPublic },
			{ "ParameterKey": "IsBuildClusterPublic", "ParameterValue": clientData.IsBuildClusterPublic },
			{ "ParameterKey": "NotificationEmail", "ParameterValue": clientData.NotificationEmail },
			{ "ParameterKey": "RepoDataVolume", "ParameterValue": clientData.RepoDataVolume },
			{ "ParameterKey": "RepoHostname", "ParameterValue": clientData.RepoHostname },
			{ "ParameterKey": "RepoInstanceType", "ParameterValue": clientData.RepoInstanceType },
			{ "ParameterKey": "RepoVersion", "ParameterValue": clientData.RepoVersion },
			{ "ParameterKey": "ScmDataVolume", "ParameterValue": clientData.ScmDataVolume },
			{ "ParameterKey": "ScmHostname", "ParameterValue": clientData.ScmHostname },
			{ "ParameterKey": "ScmInstanceType", "ParameterValue": clientData.ScmInstanceType },
			{ "ParameterKey": "ScmVersion", "ParameterValue": clientData.ScmVersion },
			{ "ParameterKey": "SingleZonePreference", "ParameterValue": clientData.SingleZonePreference },
			{ "ParameterKey": "TimeZone", "ParameterValue": clientData.TimeZone },
			{ "ParameterKey": "VpnHostname", "ParameterValue": clientData.VpnHostname },
			{ "ParameterKey": "VpnInstanceType", "ParameterValue": clientData.VpnInstanceType },
			{ "ParameterKey": "WikiDataVolume", "ParameterValue": clientData.WikiDataVolume },
			{ "ParameterKey": "WikiHostname", "ParameterValue": clientData.WikiHostname },
			{ "ParameterKey": "WikiInstanceType", "ParameterValue": clientData.WikiInstanceType },
			{ "ParameterKey": "WikiVersion", "ParameterValue": clientData.WikiVersion },

			// { "ParameterKey": "VpnEipAllocationId", "ParameterValue": vpnEipAloocationId },

			{ "ParameterKey": "WikiDatabasePassword", "ParameterValue": creds.WikiDbPassword },
			{ "ParameterKey": "BuildDatabasePassword", "ParameterValue": creds.BuildDbPassword },
			{ "ParameterKey": "ScmDatabasePassword", "ParameterValue": creds.ScmDbPassword },


			{ "ParameterKey": "AllDestinationCidrBlock", "ParameterValue": para_basesys_vpc.AllDestinationCidrBlock },
			{ "ParameterKey": "VpcCidrBlock", "ParameterValue": para_basesys_vpc.VpcCidrBlock },
			{ "ParameterKey": "PeeredVpcCidr1", "ParameterValue": para_basesys_vpc.PeeredVpcCidr1 },
			{ "ParameterKey": "PublicRoutingSubnetZone1CidrBlock", "ParameterValue": para_basesys_vpc.PublicRoutingSubnetZone1CidrBlock },
			{ "ParameterKey": "PublicRoutingSubnetZone2CidrBlock", "ParameterValue": para_basesys_vpc.PublicRoutingSubnetZone2CidrBlock },
			{ "ParameterKey": "PrivateScmSubnetZone1CidrBlock", "ParameterValue": para_basesys_vpc.PrivateScmSubnetZone1CidrBlock },
			{ "ParameterKey": "PrivateScmSubnetZone2CidrBlock", "ParameterValue": para_basesys_vpc.PrivateScmSubnetZone2CidrBlock },
			{ "ParameterKey": "PrivateBuildSubnetZone1CidrBlock", "ParameterValue": para_basesys_vpc.PrivateBuildSubnetZone1CidrBlock },
			{ "ParameterKey": "PrivateBuildSubnetZone2CidrBlock", "ParameterValue": para_basesys_vpc.PrivateBuildSubnetZone2CidrBlock },
			{ "ParameterKey": "PrivateRepoSubnetZone1CidrBlock", "ParameterValue": para_basesys_vpc.PrivateRepoSubnetZone1CidrBlock },
			{ "ParameterKey": "PrivateRepoSubnetZone2CidrBlock", "ParameterValue": para_basesys_vpc.PrivateRepoSubnetZone2CidrBlock },
			{ "ParameterKey": "PrivateWikiSubnetZone1CidrBlock", "ParameterValue": para_basesys_vpc.PrivateWikiSubnetZone1CidrBlock },
			{ "ParameterKey": "PrivateWikiSubnetZone2CidrBlock", "ParameterValue": para_basesys_vpc.PrivateWikiSubnetZone2CidrBlock },
			{ "ParameterKey": "Region", "ParameterValue": para_basesys_vpc.Region },
			{ "ParameterKey": "VpnSubnetRange", "ParameterValue": para_basesys_vpc.VpnSubnetRange },
			{ "ParameterKey": "VpnSubnetCidr", "ParameterValue": para_basesys_vpc.VpnSubnetCidr },
			{ "ParameterKey": "VpnPushRoute1", "ParameterValue": para_basesys_vpc.VpnPushRoute1 },
			{ "ParameterKey": "VpnPushRoute2", "ParameterValue": para_basesys_vpc.VpnPushRoute2 },
			{ "ParameterKey": "VpnPushRoute3", "ParameterValue": para_basesys_vpc.VpnPushRoute3 }
		];

		grunt.config.set("updateStack.devopsinfra.parameters", params);
		grunt.task.run("updateStack:devopsinfra");
	});


	//--------------------------------------UPDATE DEMO ENV TO CLIENT CLOUD FORMATION--------------------------------------

	grunt.registerTask("update-demoenv", [ "init", "copy:dist", "s3:infofrontier", "update-demoenv-main", "write-demoenv-output" ])

	grunt.registerTask("update-demoenv-main", function() {
		var clientData = grunt.file.readJSON("clients/infofrontier.json");
	 	var basesysOutput = grunt.file.readJSON("outputs/outputs-" + getRegionName(para_basesys_vpc.Region) + "-prereq.json");
	 	var devopsinfraOutput = grunt.file.readJSON("outputs/outputs-" + getRegionName(para_basesys_vpc.Region) + "-devopsinfra.json");
	 	var basesysPara = grunt.file.readJSON("parameters/basesys-vpc.json");
	 	var demoenv_vpc = grunt.file.readJSON("parameters/devenv-vpc.json");

	 	grunt.task.run("processTemplate:demoenv");

	 	var params = [
	 		{ "ParameterKey": "InternalDnsHostedZoneId", "ParameterValue": basesysOutput.InternalDnsHostedZoneId },

			{ "ParameterKey": "SgBuildSvr", "ParameterValue": devopsinfraOutput.SgBuildSvr },
			{ "ParameterKey": "BasesysVpcId", "ParameterValue": devopsinfraOutput.VpcId },
	 		{ "ParameterKey": "BaseSysVpcPrivateRouteTableZone1", "ParameterValue": devopsinfraOutput.PrivateRouteTableZone1 },
	 		{ "ParameterKey": "BaseSysVpcPrivateRouteTableZone2", "ParameterValue": devopsinfraOutput.PrivateRouteTableZone2 },


	 		{ "ParameterKey": "BasesysVpcCidrBlock", "ParameterValue": basesysPara.VpcCidrBlock },
	 		{ "ParameterKey": "AllDestinationCidrBlock", "ParameterValue": para_basesys_vpc.AllDestinationCidrBlock },
	 		{ "ParameterKey": "NexusSubnetCidr", "ParameterValue": para_basesys_vpc.NexusSubnetCidr },
	 		{ "ParameterKey": "VpnSubnetCidr", "ParameterValue": para_basesys_vpc.VpnSubnetCidr },

	 		{ "ParameterKey": "CreateBasesysVpcPeering", "ParameterValue": demoenv_vpc.CreateBasesysVpcPeering},
	 		{ "ParameterKey": "VpcCidrBlock", "ParameterValue": demoenv_vpc.VpcCidrBlock },
	 		{ "ParameterKey": "PublicRoutingSubnetZone1CidrBlock", "ParameterValue": demoenv_vpc.PublicRoutingSubnetZone1CidrBlock },
	 		{ "ParameterKey": "PublicRoutingSubnetZone2CidrBlock", "ParameterValue": demoenv_vpc.PublicRoutingSubnetZone2CidrBlock },
	 		{ "ParameterKey": "PrivateFrontEndAppSubnetZone1CidrBlock", "ParameterValue": demoenv_vpc.PrivateFrontEndAppSubnetZone1CidrBlock },
	 		{ "ParameterKey": "PrivateFrontEndAppSubnetZone2CidrBlock", "ParameterValue": demoenv_vpc.PrivateFrontEndAppSubnetZone2CidrBlock },
	 		{ "ParameterKey": "PrivateBackEndAppSubnetZone1CidrBlock", "ParameterValue": demoenv_vpc.PrivateBackEndAppSubnetZone1CidrBlock },
	 		{ "ParameterKey": "PrivateBackEndAppSubnetZone2CidrBlock", "ParameterValue": demoenv_vpc.PrivateBackEndAppSubnetZone2CidrBlock },

	 		{ "ParameterKey": "CompanyName", "ParameterValue": clientData.CompanyName },
	 		{ "ParameterKey": "NotificationEmail", "ParameterValue": clientData.NotificationEmail },
	 		{ "ParameterKey": "CriticalAlertEmail", "ParameterValue": clientData.CriticalAlertEmail },
	 		{ "ParameterKey": "InternalDnsSuffix", "ParameterValue": clientData.InternalDnsSuffix },
	 		{ "ParameterKey": "BucketSuffix", "ParameterValue": clientData.BucketSuffix },
	 		{ "ParameterKey": "BucketKeysPrefix", "ParameterValue": clientData.BucketKeysPrefix },
	 		{ "ParameterKey": "BucketStacksPrefix", "ParameterValue": clientData.BucketStacksPrefix },
	 		{ "ParameterKey": "BucketScriptsPrefix", "ParameterValue": clientData.BucketScriptsPrefix },
	 		{ "ParameterKey": "BucketBinariesPrefix", "ParameterValue": clientData.BucketBinariesPrefix },
	 		{ "ParameterKey": "TimeZone", "ParameterValue": clientData.TimeZone }
	  ];

	  grunt.config.set("updateStack.demoenv.parameters", params);
	  grunt.task.run("updateStack:demoenv")
	});

	//--------------------------------------UPDATE PROD ENV TO CLIENT CLOUD FORMATION--------------------------------------

	grunt.registerTask("update-prodenv", [ "init", "copy:dist", "s3:infofrontier", "update-prodenv-main", "write-prodenv-output" ] )

	grunt.registerTask("update-prodenv-main", function() {
		var clientData = grunt.file.readJSON("clients/infofrontier.json");
		var basesysOutput = grunt.file.readJSON("outputs/outputs-" + getRegionName(para_basesys_vpc.Region) + "-prereq.json");
		var devopsinfraOutput = grunt.file.readJSON("outputs/outputs-" + getRegionName(para_basesys_vpc.Region) + "-devopsinfra.json");
		var basesysPara = grunt.file.readJSON("parameters/basesys-vpc.json");
		var prodenv_vpc = grunt.file.readJSON("parameters/prodenv-vpc.json");

		grunt.task.run("processTemplate:prodenv");

		var params = [
			{ "ParameterKey": "InternalDnsHostedZoneId", "ParameterValue": basesysOutput.InternalDnsHostedZoneId },

      { "ParameterKey": "SgBuildSvr", "ParameterValue": devopsinfraOutput.SgBuildSvr },
			{ "ParameterKey": "BasesysVpcId", "ParameterValue": devopsinfraOutput.VpcId },
			{ "ParameterKey": "BaseSysVpcPrivateRouteTableZone1", "ParameterValue": devopsinfraOutput.PrivateRouteTableZone1 },
			{ "ParameterKey": "BaseSysVpcPrivateRouteTableZone2", "ParameterValue": devopsinfraOutput.PrivateRouteTableZone2 },

			{ "ParameterKey": "BasesysVpcCidrBlock", "ParameterValue": basesysPara.VpcCidrBlock },


			{ "ParameterKey": "AllDestinationCidrBlock", "ParameterValue": para_basesys_vpc.AllDestinationCidrBlock },
			{ "ParameterKey": "NexusSubnetCidr", "ParameterValue": para_basesys_vpc.NexusSubnetCidr },
			{ "ParameterKey": "VpnSubnetCidr", "ParameterValue": para_basesys_vpc.VpnSubnetCidr },

			{ "ParameterKey": "CreateBasesysVpcPeering", "ParameterValue": prodenv_vpc.CreateBasesysVpcPeering},
			{ "ParameterKey": "VpcCidrBlock", "ParameterValue": prodenv_vpc.VpcCidrBlock },
			{ "ParameterKey": "PublicRoutingSubnetZone1CidrBlock", "ParameterValue": prodenv_vpc.PublicRoutingSubnetZone1CidrBlock },
			{ "ParameterKey": "PublicRoutingSubnetZone2CidrBlock", "ParameterValue": prodenv_vpc.PublicRoutingSubnetZone2CidrBlock },
			{ "ParameterKey": "PrivateFrontEndAppSubnetZone1CidrBlock", "ParameterValue": prodenv_vpc.PrivateFrontEndAppSubnetZone1CidrBlock },
			{ "ParameterKey": "PrivateFrontEndAppSubnetZone2CidrBlock", "ParameterValue": prodenv_vpc.PrivateFrontEndAppSubnetZone2CidrBlock },
			{ "ParameterKey": "PrivateBackEndAppSubnetZone1CidrBlock", "ParameterValue": prodenv_vpc.PrivateBackEndAppSubnetZone1CidrBlock },
			{ "ParameterKey": "PrivateBackEndAppSubnetZone2CidrBlock", "ParameterValue": prodenv_vpc.PrivateBackEndAppSubnetZone2CidrBlock },

			{ "ParameterKey": "CompanyName", "ParameterValue": clientData.CompanyName },
			{ "ParameterKey": "NotificationEmail", "ParameterValue": clientData.NotificationEmail },
			{ "ParameterKey": "CriticalAlertEmail", "ParameterValue": clientData.CriticalAlertEmail },
			{ "ParameterKey": "InternalDnsSuffix", "ParameterValue": clientData.InternalDnsSuffix },
			{ "ParameterKey": "BucketSuffix", "ParameterValue": clientData.BucketSuffix },
			{ "ParameterKey": "BucketKeysPrefix", "ParameterValue": clientData.BucketKeysPrefix },
			{ "ParameterKey": "BucketStacksPrefix", "ParameterValue": clientData.BucketStacksPrefix },
			{ "ParameterKey": "BucketScriptsPrefix", "ParameterValue": clientData.BucketScriptsPrefix },
			{ "ParameterKey": "BucketBinariesPrefix", "ParameterValue": clientData.BucketBinariesPrefix },
			{ "ParameterKey": "TimeZone", "ParameterValue": clientData.TimeZone }
	  ];

	  grunt.config.set("updateStack.prodenv.parameters", params);
	  grunt.task.run("updateStack:prodenv")
	});

//---------------------------------------- INJECT CONFIG VALUES INTO TEMPLATES ----------------------------------------

//----------------------------------------Deploy App Single Instance-------------------------------------------------
grunt.registerTask("deployapp", function(target, ref) {

	var name = "app-deploy-" + target + "-" + ref;
	grunt.config.set("createStack." + target + "_app_infofrontier.name", name);


	var prereq = grunt.file.readJSON("outputs/outputs-" + getRegionName(para_basesys_vpc.Region) + "-prereq.json");
	var demoenvOutput = grunt.file.readJSON("outputs/outputs-" + getRegionName(para_basesys_vpc.Region) + "-demoenv.json");
	var clientData = grunt.file.readJSON("clients/infofrontier.json");
	var config = grunt.file.readJSON("config/" + name + ".json");

	var params = [
		{ "ParameterKey": "DemoPhpInstanceType", "ParameterValue": config.DemoPhpInstanceType },
		{ "ParameterKey": "PhpCodeVersion", "ParameterValue": config.PhpCodeVersion },
		{ "ParameterKey": "RefId", "ParameterValue": ref },
		{ "ParameterKey": "Target", "ParameterValue": target },

		{ "ParameterKey": "InternalDnsHostedZoneId", "ParameterValue": prereq.InternalDnsHostedZoneId },

    { "ParameterKey": "InternalDnsSuffix", "ParameterValue": clientData.InternalDnsSuffix },
		{ "ParameterKey": "ExternalDnsSuffix", "ParameterValue": clientData.ExternalDnsSuffix },
		{ "ParameterKey": "ExternalDnsHostedZoneId", "ParameterValue": clientData.ExternalDnsHostedZoneId },
		{ "ParameterKey": "TimeZone", "ParameterValue": clientData.TimeZone },
		{ "ParameterKey": "SupportEmail", "ParameterValue": clientData.NotificationEmail },

		{ "ParameterKey": "AvailabilityZone1", "ParameterValue": demoenvOutput.AvailabilityZone1 },
		{ "ParameterKey": "AvailabilityZone2", "ParameterValue": demoenvOutput.AvailabilityZone2 },
		{ "ParameterKey": "PrivateFrontEndAppSubnetZone1", "ParameterValue": demoenvOutput.PrivateFrontEndAppSubnetZone1 },
		{ "ParameterKey": "PrivateFrontEndAppSubnetZone2", "ParameterValue": demoenvOutput.PrivateFrontEndAppSubnetZone2 },
		{ "ParameterKey": "ProfileTest", "ParameterValue": demoenvOutput.ProfileTest },
		{ "ParameterKey": "RoleTest", "ParameterValue": demoenvOutput.RoleTest },
		{ "ParameterKey": "SecurityGroupLinuxServer", "ParameterValue": demoenvOutput.SecurityGroupLinuxServer },
		{ "ParameterKey": "SecurityGroupDemoAppSingle", "ParameterValue": demoenvOutput.SecurityGroupDemoAppSingle },
    { "ParameterKey": "SnsTest", "ParameterValue": demoenvOutput.SnsTest }
	]
	grunt.config.set("createStack." + target + "_app_infofrontier.parameters", params);

	grunt.task.run([ "processTemplate:" + target + "_app_infofrontier", "createStack:" + target + "_app_infofrontier" ]);
});

//----------------------------------------Deploy App Cluster Production-------------------------------------------------
grunt.registerTask("deployprodcluster", function(target, ref) {

	var name = "app-deploy-" + target + "-" + ref;
	grunt.config.set("createStack." + target + "_app_infofrontier.name", name);


	var prereq = grunt.file.readJSON("outputs/outputs-" + getRegionName(para_basesys_vpc.Region) + "-prereq.json");
	var prodenvOutput = grunt.file.readJSON("outputs/outputs-" + getRegionName(para_basesys_vpc.Region) + "-prodenv.json");
	var clientData = grunt.file.readJSON("clients/infofrontier.json");
	var config = grunt.file.readJSON("config/" + name + ".json");

	var params = [
		{ "ParameterKey": "ProdPhpInstanceType", "ParameterValue": config.ProdPhpInstanceType },
		{ "ParameterKey": "PhpCodeVersion", "ParameterValue": config.PhpCodeVersion },
		{ "ParameterKey": "RefId", "ParameterValue": ref },
		{ "ParameterKey": "Target", "ParameterValue": target },

		{ "ParameterKey": "InternalDnsHostedZoneId", "ParameterValue": prereq.InternalDnsHostedZoneId },

    { "ParameterKey": "InternalDnsSuffix", "ParameterValue": clientData.InternalDnsSuffix },
		{ "ParameterKey": "TimeZone", "ParameterValue": clientData.TimeZone },
		{ "ParameterKey": "SupportEmail", "ParameterValue": clientData.NotificationEmail },
		{ "ParameterKey": "ClusterDesiredSizeWeb", "ParameterValue": clientData.ClusterDesiredSizeWeb },
		{ "ParameterKey": "ClusterMinSizeWeb", "ParameterValue": clientData.ClusterMinSizeWeb },
		{ "ParameterKey": "ClusterMaxSizeWeb", "ParameterValue": clientData.ClusterMaxSizeWeb },

		{ "ParameterKey": "AvailabilityZone1", "ParameterValue": prodenvOutput.AvailabilityZone1 },
		{ "ParameterKey": "AvailabilityZone2", "ParameterValue": prodenvOutput.AvailabilityZone2 },
		{ "ParameterKey": "PublicRoutingSubnetZone1", "ParameterValue": prodenvOutput.PublicRoutingSubnetZone1 },
		{ "ParameterKey": "PublicRoutingSubnetZone2", "ParameterValue": prodenvOutput.PublicRoutingSubnetZone2 },
		{ "ParameterKey": "PrivateFrontEndAppSubnetZone1", "ParameterValue": prodenvOutput.PrivateFrontEndAppSubnetZone1 },
		{ "ParameterKey": "PrivateFrontEndAppSubnetZone2", "ParameterValue": prodenvOutput.PrivateFrontEndAppSubnetZone2 },
		{ "ParameterKey": "PrivateBackEndAppSubnetZone1", "ParameterValue": prodenvOutput.PrivateBackEndAppSubnetZone1 },
		{ "ParameterKey": "PrivateBackEndAppSubnetZone2", "ParameterValue": prodenvOutput.PrivateBackEndAppSubnetZone2 },
		{ "ParameterKey": "ProfileProdFrontEnd", "ParameterValue": prodenvOutput.ProfileProdFrontEnd },
		{ "ParameterKey": "RoleProdFrontEnd", "ParameterValue": prodenvOutput.RoleProdFrontEnd },
		{ "ParameterKey": "SecurityGroupLinuxServer", "ParameterValue": prodenvOutput.SecurityGroupLinuxServer },
		{ "ParameterKey": "SecurityGroupProdFrontEnd", "ParameterValue": prodenvOutput.SecurityGroupProdFrontEnd },
		{ "ParameterKey": "SecurityGroupProdFrontEndElb", "ParameterValue": prodenvOutput.SecurityGroupProdFrontEndElb },
    { "ParameterKey": "SnsProd", "ParameterValue": prodenvOutput.SnsProd }
	]
	grunt.config.set("createStack." + target + "_app_infofrontier.parameters", params);

	grunt.task.run([ "processTemplate:" + target + "_app_infofrontier", "createStack:" + target + "_app_infofrontier" ]);
});


//------------------------------------------------- CODE DEPLOY TASKS -------------------------------------------------

	grunt.registerTask("local", [ "clean:dist", "init", "copy:dist", "copy:easyrsa"]);
	grunt.registerTask("push", [ "clean:dist", "init", "copy:dist", "copy:easyrsa", "s3:basesys", "s3:infofrontier" ])


//--------------------------------------------- OPENVPN PKI AND SERVER KEYS -------------------------------------------

	grunt.registerTask("init_openvpn_keys", function() {

		grunt.task.run("create_pki");

		grunt.task.run("build_ca");

		grunt.task.run("shell:genreq");

		grunt.task.run("shell:signreq");

		grunt.task.run("shell:gencrl");

		grunt.task.run("shell:gendh");

		grunt.task.run("deploy_openvpn_assets")
	});

	grunt.registerTask("create_pki", [ "clean:pki", "copy:easyrsa", "shell:setperm", "shell:initpki" ]);

	grunt.registerTask("build_ca", function() {

		grunt.task.run("create_pki");

		var clientData = grunt.file.readJSON("clients/infofrontier.json");

		var varData = {
			country: clientData.CA_Country,
			province: clientData.CA_Province,
			city: clientData.CA_City,
			org: clientData.CA_Org,
			email: clientData.CA_Email,
			ou: clientData.CA_OU
		}

		grunt.config.set("compile-handlebars.easyrsavar.templateData", varData);

		grunt.task.run("compile-handlebars:easyrsavar");

		grunt.task.run("shell:buildca");
	});

	grunt.registerTask("deploy_openvpn_assets", function() {

		var clientData = grunt.file.readJSON("clients/infofrontier.json");
		var creds = grunt.file.readJSON("creds/creds.json");

		grunt.config.set("s3.open_vpn_pki.options.accessKeyId", creds.AccessKeyId);
		grunt.config.set("s3.open_vpn_pki.options.secretAccessKey", creds.SecretAccessKey);
		grunt.config.set("s3.open_vpn_pki.options.region", clientData.Region);
		grunt.config.set("s3.open_vpn_pki.options.bucket", clientData.BucketKeysPrefix + "-" + getRegionName(clientData.Region) + "-" + clientData.BucketSuffix);
		grunt.config.set("s3.open_vpn_pki.options.access", "private");
		grunt.config.set("s3.open_vpn_pki.options.gzip", false);
		grunt.config.set("s3.open_vpn_pki.cwd", "easyrsa3");
		grunt.config.set("s3.open_vpn_pki.src", "**/*");
		grunt.config.set("s3.open_vpn_pki.dest", "openvpn/pki/easyrsa/");
		grunt.config.set("s3.open_vpn_pki.options.cache", false);
		grunt.config.set("s3.open_vpn_pki.options.overwrite", true);

		grunt.task.run("s3:open_vpn_pki");

		grunt.config.set("s3.open_vpn_server_ca.options.accessKeyId", creds.AccessKeyId);
		grunt.config.set("s3.open_vpn_server_ca.options.secretAccessKey", creds.SecretAccessKey);
		grunt.config.set("s3.open_vpn_server_ca.options.region", clientData.Region);
		grunt.config.set("s3.open_vpn_server_ca.options.bucket", clientData.BucketKeysPrefix + "-" + getRegionName(clientData.Region) + "-" + clientData.BucketSuffix);
		grunt.config.set("s3.open_vpn_server_ca.options.access", "private");
		grunt.config.set("s3.open_vpn_server_ca.options.gzip", false);
		grunt.config.set("s3.open_vpn_server_ca.cwd", "easyrsa3/pki");
		grunt.config.set("s3.open_vpn_server_ca.options.cache", false);
		grunt.config.set("s3.open_vpn_server_ca.options.overwrite", true);

		grunt.config.set("s3.open_vpn_server_ca.src", "ca.crt");
		grunt.config.set("s3.open_vpn_server_ca.dest", "openvpn/server/");

		grunt.task.run("s3:open_vpn_server_ca");

		grunt.config.set("s3.open_vpn_server_crl.options.accessKeyId", creds.AccessKeyId);
		grunt.config.set("s3.open_vpn_server_crl.options.secretAccessKey", creds.SecretAccessKey);
		grunt.config.set("s3.open_vpn_server_crl.options.region", clientData.Region);
		grunt.config.set("s3.open_vpn_server_crl.options.bucket", clientData.BucketKeysPrefix + "-" + getRegionName(clientData.Region) + "-" + clientData.BucketSuffix);
		grunt.config.set("s3.open_vpn_server_crl.options.access", "private");
		grunt.config.set("s3.open_vpn_server_crl.options.gzip", false);
		grunt.config.set("s3.open_vpn_server_crl.cwd", "easyrsa3/pki");
		grunt.config.set("s3.open_vpn_server_crl.options.cache", false);
		grunt.config.set("s3.open_vpn_server_crl.options.overwrite", true);

		grunt.config.set("s3.open_vpn_server_crl.src", "crl.pem");
		grunt.config.set("s3.open_vpn_server_crl.dest", "openvpn/server/");

		grunt.task.run("s3:open_vpn_server_crl");

		grunt.config.set("s3.open_vpn_server_dh.options.accessKeyId", creds.AccessKeyId);
		grunt.config.set("s3.open_vpn_server_dh.options.secretAccessKey", creds.SecretAccessKey);
		grunt.config.set("s3.open_vpn_server_dh.options.region", clientData.Region);
		grunt.config.set("s3.open_vpn_server_dh.options.bucket", clientData.BucketKeysPrefix + "-" + getRegionName(clientData.Region) + "-" + clientData.BucketSuffix);
		grunt.config.set("s3.open_vpn_server_dh.options.access", "private");
		grunt.config.set("s3.open_vpn_server_dh.options.gzip", false);
		grunt.config.set("s3.open_vpn_server_dh.cwd", "easyrsa3/pki");
		grunt.config.set("s3.open_vpn_server_dh.options.cache", false);
		grunt.config.set("s3.open_vpn_server_dh.options.overwrite", true);

		grunt.config.set("s3.open_vpn_server_dh.src", "dh.pem");
		grunt.config.set("s3.open_vpn_server_dh.dest", "openvpn/server/");

		grunt.task.run("s3:open_vpn_server_dh");

		grunt.config.set("s3.open_vpn_server_crt.options.accessKeyId", creds.AccessKeyId);
		grunt.config.set("s3.open_vpn_server_crt.options.secretAccessKey", creds.SecretAccessKey);
		grunt.config.set("s3.open_vpn_server_crt.options.region", clientData.Region);
		grunt.config.set("s3.open_vpn_server_crt.options.bucket", clientData.BucketKeysPrefix + "-" + getRegionName(clientData.Region) + "-" + clientData.BucketSuffix);
		grunt.config.set("s3.open_vpn_server_crt.options.access", "private");
		grunt.config.set("s3.open_vpn_server_crt.options.gzip", false);
		grunt.config.set("s3.open_vpn_server_crt.options.cache", false);
		grunt.config.set("s3.open_vpn_server_crt.options.overwrite", true);

		grunt.config.set("s3.open_vpn_server_crt.cwd", "easyrsa3/pki/issued");
		grunt.config.set("s3.open_vpn_server_crt.src", "openvpn.server.crt");
		grunt.config.set("s3.open_vpn_server_crt.dest", "openvpn/server/");

		grunt.task.run("s3:open_vpn_server_crt");

		grunt.config.set("s3.open_vpn_server_key.options.accessKeyId", creds.AccessKeyId);
		grunt.config.set("s3.open_vpn_server_key.options.secretAccessKey", creds.SecretAccessKey);
		grunt.config.set("s3.open_vpn_server_key.options.region", clientData.Region);
		grunt.config.set("s3.open_vpn_server_key.options.bucket", clientData.BucketKeysPrefix + "-" + getRegionName(clientData.Region) + "-" + clientData.BucketSuffix);
		grunt.config.set("s3.open_vpn_server_key.options.access", "private");
		grunt.config.set("s3.open_vpn_server_key.options.gzip", false);
		grunt.config.set("s3.open_vpn_server_key.options.cache", false);
		grunt.config.set("s3.open_vpn_server_key.options.overwrite", true);

		grunt.config.set("s3.open_vpn_server_key.cwd", "easyrsa3/pki/private");
		grunt.config.set("s3.open_vpn_server_key.src", "openvpn.server.key");
		grunt.config.set("s3.open_vpn_server_key.dest", "openvpn/server/");

		grunt.task.run("s3:open_vpn_server_key");
	});

//--------------------------------------------------- UTIL FUNCTIONS --------------------------------------------------

}

var getRegionName = function(region) {

	var regionName;

	switch(region) {

		case "us-east-1":
			regionName = "virginia";
			break;
		case "us-west-1":
			regionName = "california";
			break;
		case "us-west-2":
			regionName = "oregon";
			break;
		case "eu-west-1":
			regionName = "ireland";
			break;
		case "eu-central-1":
			regionName = "frankfurt";
			break;
		case "ap-northeast-1":
			regionName = "tokyo";
			break;
		case "ap-southeast-1":
			regionName = "singapore";
			break;
		case "ap-southeast-2":
			regionName = "sydney";
			break;
		case "sa-east-1":
			regionName = "brazil";
			break;
	}

	return regionName;
}

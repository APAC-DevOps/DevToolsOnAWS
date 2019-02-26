#!/bin/bash
#title           :route53.sh
#This script provides a simple interface to update Route53 records.
#date            :2014 05 24
#version         :0.1
#
# The following route53 policy example will authorise the users to perform:
#		"polRoute53": {
#			"Type": "AWS::IAM::Policy",
#			"Properties": {
#				"PolicyName": "UpdateRoute53",
#				"PolicyDocument": {
#					"Statement": [
#						{
#							"Action": [
#								"route53:ChangeResourceRecordSets",
#								"route53:GetChange",
#								"route53:GetHostedZone",
#								"route53:ListHostedZones",
#								"route53:ListResourceRecordSets"
#							],
#							"Resource": [ "*" ],
#							"Effect": "Allow"
#						}
#					]
#				},
#				"Roles": [
#					{ "Ref": "role" }
#				]
#			}
#		},
#==============================================================================

HOSTED_ZONE_ID=""
NAME=""
ACTION="UPSERT"
TTL=""
TYPE=""
RECORD=""
TYPE=""
FILENAME=""
CLEAN_UP=0

TEMP_FILE=""

function update_route53() {

	UPDATED_JSON=`sed s/"<RECORD>"/"$RECORD"/g $FILENAME`
	UPDATED_JSON=`echo $UPDATED_JSON | sed s/"<NAME>"/"$NAME"/g`
	UPDATED_JSON=`echo $UPDATED_JSON | sed s/"<ACTION>"/"$ACTION"/g`
	UPDATED_JSON=`echo $UPDATED_JSON | sed s/"<TTL>"/"$TTL"/`
	UPDATED_JSON=`echo $UPDATED_JSON | sed s/"<TYPE>"/"$TYPE"/`
	echo "$UPDATED_JSON" > "$TEMP_FILE"

	OUTPUT=`aws route53 change-resource-record-sets --region ap-southeast-2 --hosted-zone-id $HOSTED_ZONE_ID --change-batch file://$TEMP_FILE`

	if [ -e "$TEMP_FILE" ]; then
		log "Removing temporary files"
		rm $TEMP_FILE
	fi
}

function write_clean_up_record() {

	mkdir -p /opt/p7/dns/clean-up

	echo "Writing out clean up file $NAME.json"

	CLEAN_UP_JSON=`sed s/"<RECORD>"/"$RECORD"/g $FILENAME`
	CLEAN_UP_JSON=`echo $CLEAN_UP_JSON | sed s/"<NAME>"/"$NAME"/g`
	CLEAN_UP_JSON=`echo $CLEAN_UP_JSON | sed s/"<ACTION>"/"DELETE"/g`
	CLEAN_UP_JSON=`echo $CLEAN_UP_JSON | sed s/"<TTL>"/"$TTL"/`
	CLEAN_UP_JSON=`echo $CLEAN_UP_JSON | sed s/"<TYPE>"/"$TYPE"/`
	echo "$CLEAN_UP_JSON" > /opt/p7/dns/clean-up/$NAME.json

	touch /var/lock/subsys/route53-cleanup
}

function setup() {
	while getopts "n:t:e:z:r:f:a:psc" OPTION; do
		case $OPTION in
			f)
				FILENAME=$OPTARG
				;;
			a)
				ACTION=$OPTARG
				;;
			r)
				RECORD=$OPTARG
				;;
			t)
				TYPE=$OPTARG
				;;
			n)
				NAME=$OPTARG
				;;
			p)
				RECORD=$(curl -s 169.254.169.254/2014-02-25/meta-data/public-ipv4/)
				TYPE="A"
				;;
			s)
				RECORD=$(curl -s 169.254.169.254/2014-02-25/meta-data/local-ipv4)
				TYPE="A"
				;;
			e)
				TTL=$OPTARG
				;;
			z)
				HOSTED_ZONE_ID=$OPTARG
				;;
			c)
				CLEAN_UP=1
				;;
			*)
				quit_with_error "Unimplemented option $OPTION chosen."
				;;
		esac
	done

	TEMP_FILE="/tmp/$NAME.json"

	log "(NAME: $NAME, ACTION: $ACTION, TTL: $TTL, HOSTED_ZONE_ID: $HOSTED_ZONE_ID, TYPE: $TYPE, RECORD: $RECORD, CLEAN_UP, $CLEAN_UP)"
}

function quit_with_error() {
	exit 1
}

function log() {
	echo "$*"
}

function main() {
	setup $*
	update_route53
	if [ $CLEAN_UP -eq 1 ]; then
		write_clean_up_record
	fi
}

main $*

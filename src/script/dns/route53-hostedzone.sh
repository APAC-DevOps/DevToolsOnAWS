#!/bin/bash

HOSTED_ZONE_ID=""
VPC_ID=""
VPC_REGION=""
OUTPUT=""

function associate_vpc_with_hosted_zone() {
	OUTPUT=`aws route53 associate-vpc-with-hosted-zone --hosted-zone-id=$HOSTED_ZONE_ID --vpc VPCRegion=$VPC_REGION,VPCId=$VPC_ID 2>&1`
	echo $OUTPUT >>"/tmp/associate_vpc_with_hosted_zone.json"
}
function setup() {
	while getopts "h:i:r:" OPTION; do
		case $OPTION in
			h)
				HOSTED_ZONE_ID=$OPTARG
				;;
			i)
				VPC_ID=$OPTARG
				;;
			r)
				VPC_REGION=$OPTARG
				;;
			*)
				quit_with_error "Unimplemented option $OPTION chosen."
				;;
		esac
	done


	log "(HOSTED_ZONE_ID: $HOSTED_ZONE_ID, VPC_ID: $VPC_ID, VPC_Region: $VPC_REGION)"
}

function quit_with_error() {
	exit 1
}

function log() {
	echo "$*"
}

function main() {
	setup $*
	associate_vpc_with_hosted_zone
}

main $*

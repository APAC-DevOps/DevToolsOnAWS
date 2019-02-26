#!/bin/bash

ROUTE_TABLE_ID=""
CIDR_BLOCK=""
INSTANCE_ID=""
REGION=""

function replace_route() {
	OUTPUT=`aws ec2 replace-route --route-table-id $ROUTE_TABLE_ID --destination-cidr-block "$CIDR_BLOCK" --instance-id $INSTANCE_ID --region $REGION`
	EXIT_STATUS=`echo $?`
	check_exit_status "Unable to replace route in Route Table $ROUTE_TABLE_ID to $INSTANCE_ID."
}

function setup() {
	while getopts "t:c:i:r:h" OPTION; do
		case $OPTION in
			t)
				ROUTE_TABLE_ID=$OPTARG
				;;
			c)
				CIDR_BLOCK=$OPTARG
				;;
			i)
				INSTANCE_ID=$OPTARG
				;;
			r)
				REGION=$OPTARG
				;;
			h)
				help
				exit 0
				;;
			*)
				quit_with_error "Unimplemented option $OPTION chosen."
				;;
		esac
	done

	if [ -z "$ROUTE_TABLE_ID" ]; then
		quit_with_error_no_cleanup "An Route Table Id must be set."
	fi

	if [ -z "$CIDR_BLOCK" ]; then
		CIDR_BLOCK="0.0.0.0/0"
	fi

	if [ -z "$REGION" ]; then
		quit_with_error_no_cleanup "A region must be set."
	fi

	if [ -z "$INSTANCE_ID" ]; then
		INSTANCE_ID=$(curl -s 169.254.169.254/2014-02-25/meta-data/instance-id)
	fi

	log "(ROUTE_TABLE_ID: $ROUTE_TABLE_ID, INSTANCE_ID: $INSTANCE_ID)"
}

function check_exit_status() {
	if [ "$EXIT_STATUS" != "0" ]; then
		quit_with_error "$1"
	fi
}

function quit_with_error_no_cleanup() {
	log $1
	exit 2
}

function quit_with_error() {
	log $1
	exit 1
}

function log() {
	echo "$*"
}

function help() {
	log "Used to replace a route with one that points to the instance."
	log "  -i: Instance ID (Optional)"
	log "  -r: Route Table Id"
}

function main() {
	setup "$@"
	replace_route
}

main "$@"

#!/bin/bash

INSTANCE_ID=""
REGION=""

function no_source_dest_check() {
	OUTPUT=`aws ec2 modify-instance-attribute --instance-id $INSTANCE_ID --region $REGION --no-source-dest-check`
	EXIT_STATUS=`echo $?`
	check_exit_status "Unable to set source dest check to false."
}

function setup() {
	while getopts "t:i:r:h" OPTION; do
		case $OPTION in
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

	if [ -z "$REGION" ]; then
		quit_with_error_no_cleanup "A region must be set."
	fi

	if [ -z "$INSTANCE_ID" ]; then
		INSTANCE_ID=$(curl -s 169.254.169.254/2014-02-25/meta-data/instance-id)
	fi

	log "(INSTANCE_ID: $INSTANCE_ID)"
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
}

function main() {
	setup "$@"
	no_source_dest_check
}

main "$@"

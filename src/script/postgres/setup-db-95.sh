#!/bin/bash

DATABASE_NAME=""
DATABASE_USER=""
DATABASE_PASSWORD="{{password}}"

function setup_db() {

	USER_EXISTS=`su -l postgres -c "psql -d postgres -c \"create user $DATABASE_USER with password '$DATABASE_PASSWORD';\""`
	if [ "$USER_EXISTS" != "CREATE ROLE" ]; then
		log "User already configured. Exiting."
		exit 0
	fi
	DATABASE_EXISTS=`su -l postgres -c "/usr/bin/createdb -O $DATABASE_USER $DATABASE_NAME"`
	exit 0
}

function setup() {
	while getopts "n:u:p:h" OPTION; do
		case $OPTION in
			n)
				DATABASE_NAME=$OPTARG
				;;
			u)
				DATABASE_USER=$OPTARG
				;;
			p)
				DATABASE_PASSWORD=$OPTARG
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

	if [ -z "$DATABASE_NAME" ]; then
		quit_with_error_no_cleanup "An database name must be provided."
	fi

	if [ -z "$DATABASE_USER" ]; then
		quit_with_error_no_cleanup "A user must be provided."
	fi

	if [ -z "$DATABASE_PASSWORD" ]; then
		quit_with_error_no_cleanup "A password must be provided."
	fi

	log "(DATABASE_NAME: $DATABASE_NAME, DATABASE_USER: $DATABASE_USER)"
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
	log "Used to create a user and database with the user as owner."
	log "  -n: Database name"
	log "  -u: User name"
	log "  -p: User password"
}

function main() {
	setup "$@"
	setup_db
}

main "$@"

#!/bin/bash

CW_WEB_VERSION=""

function pull_all() {
	if [ "$CW_WEB_VERSION" != "" ]; then

		rm -rf /opt/infofrontier/php-web
		mkdir -p /opt/infofrontier/php-web

		/opt/infofrontier/nexus/pull-deploy.sh -i org.infofrontier:demo-site:$CW_WEB_VERSION -c assembly -p zip -t /opt/infofrontier/php-web
		EXIT_STATUS=`echo $?`
		check_exit_status "Errors occurred with web deployment."

		/usr/bin/unzip /opt/infofrontier/php-web/demo-site-$CW_WEB_VERSION.zip -d /opt/infofrontier/php-web
		ln -s /opt/infofrontier/php-web/demo-site-$CW_WEB_VERSION/web-app /opt/infofrontier/php-web/web-app
	fi
}

function setup() {
	while getopts "w:h" OPTION; do
		case $OPTION in
			w)
				CW_WEB_VERSION=$OPTARG
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

	log "(CW_WEB_VERSION: $CW_WEB_VERSION)"
}

function check_exit_status() {
	if [ "$EXIT_STATUS" != "0" ]; then
		quit_with_error "$1"
	fi
}

function quit_with_error() {
	log $1
	exit 1
}

function log() {
	echo "$*"
}

function help() {
	log "Used to associate an EIP to an instance."
	log "  -w: php-web version"
}

function main() {
	setup "$@"
	pull_all
}

main "$@"

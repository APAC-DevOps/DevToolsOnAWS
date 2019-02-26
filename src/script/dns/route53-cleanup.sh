#!/bin/bash
#
#	route53-cleanup - this script cleans up route53 records on shutdown
#
#	chkconfig:		0 95 5
#	description:	route53-cleanup cleans up any route53 records created by route53.sh

stop() {
	echo "executing route53-cleanup"
	for FILE in /opt/p7/dns/clean-up/*.json; do
		aws route53 change-resource-record-sets --hosted-zone-id {{hosted_zone_id}} --change-batch "file://$FILE" &
	done
}
case "$1" in
  stop)
    stop
    ;;
esac

#!/bin/bash

VOLUME_ID=""
MOUNT_POINT=""
DEVICE=""
VOLUME_TYPE=""
PARTITION=""
FSTAB="false"
INSTANCE_ID=""
LATEST_SNAPSHOT=""

function mount_device() {
	mkdir -p $MOUNT_POINT

	aws ec2 attach-volume --volume-id $VOLUME_ID --instance-id $INSTANCE_ID --device $DEVICE --region {{region}}
	NEXT_WAIT_TIME=0
	until mount -t $VOLUME_TYPE $PARTITION $MOUNT_POINT || [ $NEXT_WAIT_TIME -eq 20 ]; do
	sleep $(( NEXT_WAIT_TIME++ ))
	done

	if [ "$FSTAB" == "true" ]; then
	    echo "$PARTITION $MOUNT_POINT $VOLUME_TYPE defaults 0 2" >> /etc/fstab
	fi
}

function setup() {
	while getopts "v:m:d:t:p:fs" OPTION; do
		case $OPTION in
			v)
				VOLUME_ID=$OPTARG
				;;
			m)
				MOUNT_POINT=$OPTARG
				;;
			d)
				DEVICE=$OPTARG
				;;
			t)
				VOLUME_TYPE=$OPTARG
				;;
			p)
				PARTITION=$OPTARG
				;;
			f)
				FSTAB="true"
				;;
			s)
				LATEST_SNAPSHOT="true"
				;;
			*)
				quit_with_error "Unimplemented option $OPTION chosen."
				;;
		esac
	done

	if [ -z "$PARTITION" ]; then
		PARTITION=$DEVICE
	fi

	INSTANCE_ID=$(curl -s 169.254.169.254/2014-02-25/meta-data/instance-id)

	log "(VOLUME_ID: $VOLUME_ID, MOUNT_POINT: $MOUNT_POINT, DEVICE: $DEVICE, PARTITION: $PARTITION, VOLUME_TYPE: $VOLUME_TYPE, FSTAB: $FSTAB, LATEST_SNAPSHOT: $LATEST_SNAPSHOT)"
}

function quit_with_error() {
	log $1
	exit 1
}

function log() {
	echo "$*"
}


function main() {
	setup $*
	mount_device
}

main $*
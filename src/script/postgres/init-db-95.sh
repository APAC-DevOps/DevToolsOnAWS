#!/bin/bash

INITDB=`service postgresql95 initdb`
if [ "$INITDB" != "0" ]; then
	echo "Data cluster already initialized."
fi
exit 0

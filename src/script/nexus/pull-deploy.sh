#!/bin/bash
# Argument = -h -v -i groupId:artifactId:version -c classifier -p packaging

#shopt -o -s xtrace

# Define Nexus Configuration
NEXUS_HOST=repo.infofrontier.org:8081/nexus

usage()
{
cat <<EOF

usage: $0 options

This script will fetch an artifact from a Nexus server using the Nexus REST redirect service.

OPTIONS:
	-h 		Show this message
	-i 		GAV coordinate groupId:artifactId:version
	-c 		Artifact Classifier
	-p 		Artifact Packaging
	-t 		Target path for artifact

EOF
}

# Read in Complete Set of Coordinates from the Command Line
GROUP_ID=
ARTIFACT_ID=
CLASSIFIER=""
PACKAGING=jar
VERSION=
TARGET=

while getopts "hi:c:p:t:" OPTION
do
	case $OPTION in
		h)
			usage
			exit 1
			;;
		i)
			OIFS=$IFS
			IFS=":"
			GAV_COORD=( $OPTARG )
			GROUP_ID=${GAV_COORD[0]}
			ARTIFACT_ID=${GAV_COORD[1]}
			VERSION=${GAV_COORD[2]}
			IFS=$OIFS
			;;
		c)
			CLASSIFIER=$OPTARG
			;;
		p)
			PACKAGING=$OPTARG
			;;
		t)
			TARGET=$OPTARG
			;;
		?)
			usage
			exit
			;;
	esac
done

if [[ -z $GROUP_ID ]] || [[ -z $ARTIFACT_ID ]] || [[ -z $VERSION ]] || [[ -z $TARGET ]]
then
	echo "BAD ARGUMENTS: Either groupId, artifactId, version, or target was not supplied" >&2
	usage
	exit 1
fi

if [ "$CLASSIFIER" == "" ]; then
	echo "python nexus-redirect-url.py $NEXUS_HOST $GROUP_ID $ARTIFACT_ID $VERSION $PACKAGING"
	REDIRECT_URL=`python /opt/infofrontier/nexus/nexus-redirect-url.py $NEXUS_HOST $GROUP_ID $ARTIFACT_ID $VERSION $PACKAGING`
else
	echo "python nexus-redirect-url.py $NEXUS_HOST $GROUP_ID $ARTIFACT_ID $VERSION $PACKAGING -c $CLASSIFIER"
	REDIRECT_URL=`python /opt/infofrontier/nexus/nexus-redirect-url.py $NEXUS_HOST $GROUP_ID $ARTIFACT_ID $VERSION $PACKAGING -c $CLASSIFIER`
fi

echo "Fetching Artifact from $REDIRECT_URL..." >&2
mkdir -p $TARGET
/usr/bin/curl -o $TARGET/$ARTIFACT_ID-$VERSION.$PACKAGING -L ${REDIRECT_URL}

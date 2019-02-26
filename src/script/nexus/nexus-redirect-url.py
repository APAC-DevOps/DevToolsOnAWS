import argparse, urllib
from xml.etree import ElementTree as ET

parser = argparse.ArgumentParser()
parser.add_argument("server", help="nexus server hostname")
parser.add_argument("groupid", help="group id")
parser.add_argument("artifactid", help="artifact id")
parser.add_argument("version", help="version with or without build id")
parser.add_argument("packaging", help="artifact packaging")
parser.add_argument("-c", help="artifact classifier")
parser.add_argument("--ssl", help="enable https", action="store_true")
args = parser.parse_args()

#protocol_prefix = "https://" if args.ssl is not None else "http://"
protocol_prefix = "http://"
server = args.server
group_id = args.groupid
artifact_id = args.artifactid
version_id = args.version
classifier = args.c
packaging = args.packaging
snapshot = True if "snapshot" in version_id else False
repository = "snapshots"

url = protocol_prefix + server + "/service/local/artifact/maven/redirect?"
url = url + "g=" + group_id
url = url + "&a=" + artifact_id
url = url + "&r=" + repository
url = url + "&p=" + packaging

if classifier is not None:
	url = url + "&c=" + classifier


url = url + "&v=" + version_id

print url

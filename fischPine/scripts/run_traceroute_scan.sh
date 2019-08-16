#!/bin/sh

MYTIME=`date +%s`
MYCMD=`cat /tmp/traceroute.run`

if [ "$1" = "start" ]; then
	eval ${MYCMD}
	mv /tmp/traceroute.scan /pineapple/modules/PabloPine/scan/traceroute_${MYTIME}
	rm -rf /tmp/traceroute.scan
	rm -rf /tmp/traceroute.run
elif [ "$1" = "stop" ]; then
  	killall -9 traceroute
	rm -rf /tmp/traceroute.run
	rm -rf /tmp/traceroute.scan
fi
#!/bin/sh

MYTIME=`date +%s`
MYCMD=`cat /tmp/nmap.run`

if [ "$1" = "start" ]; then
	eval ${MYCMD}
	mv /tmp/nmap.scan /pineapple/modules/PabloPine/scan/scan_${MYTIME}
	rm -rf /tmp/nmap.run
elif [ "$1" = "stop" ]; then
  	killall -9 nmap
	rm -rf /tmp/nmap.run
	rm -rf /tmp/nmap.scan
fi
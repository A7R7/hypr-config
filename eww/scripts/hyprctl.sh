#!/usr/bin/env bash
#

socat -u UNIX-CONNECT:/tmp/hypr/"$HYPRLAND_INSTANCE_SIGNATURE"/.socket2.sock - |
	# rg --line-buffered "workspace|mon(itor)?" |
	while read -r line; do
		echo $line
	done

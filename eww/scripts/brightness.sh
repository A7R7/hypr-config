#!/usr/bin/env bash

# initial
echo '{ "value": '"$(light)"'}'
udevadm monitor | rg --line-buffered "backlight" | while read -r _; do
	echo '{ "value": '"$(light)"'}'
done

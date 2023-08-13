#!/usr/bin/env bash

restore_var() {
	if [ -f '.saved' ]; then
		eww update weather="$(jq -r '.weather' '.saved')"
	fi
}

save_var() {
	vars="{"
	vars+='"weather":'"$(eww get weather)"
	vars+="}"
	echo $vars >.saved
}

eww kill
eww daemon
eww open bar0
eww open bar1
eww open bar2

restore_var
trap 'save_var' SIGTERM

while true; do
	sleep 1
done

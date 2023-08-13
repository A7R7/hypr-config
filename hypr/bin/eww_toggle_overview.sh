#!/usr/bin/env bash

if $(eww get show_overview); then
	eww update show_overview=false
	eww close overview0
	eww close overview1
	eww close overview2
else
	eww open overview0
	eww open overview1
	eww open overview2
	eww update show_overview=true
	node $HOME/.config/eww/scripts/overview.js
fi

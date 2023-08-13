#!/usr/bin/env bash

vol() {
	wpctl get-volume @DEFAULT_AUDIO_$1@ | awk '{print int($2*100)}'
}
ismuted() {
	wpctl get-volume @DEFAULT_AUDIO_"$1"@ | rg -i muted
	echo $?
}
setvol() {
	wpctl set-volume @DEFAULT_AUDIO_"$1"@ "$(awk -v n="$2" 'BEGIN{print (n / 100)}')"
}
setmute() {
	wpctl set-mute @DEFAULT_AUDIO_"$1"@ toggle
}

# echo '{"icon":"'"$icon"'","audio":"'"$audio"'","value":"'"$(vol "SINK")"'","microphone":"'"$(vol "SOURCE")"'"}'
echo '{"value":"'"$(vol "SINK")"'","microphone":"'"$(vol "SOURCE")"'"}'

# event loop
pactl subscribe |
	rg --line-buffered "on sink" |
	while read -r _; do
		# echo '{"icon":"'"$icon"'","audio":"'"$audio"'","value":"'"$(vol "SINK")"'","microphone":"'"$(vol "SOURCE")"'"}'
		echo '{"value":"'"$(vol "SINK")"'","microphone":"'"$(vol "SOURCE")"'"}'
	done

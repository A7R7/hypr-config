#!/usr/bin/env bash

if ! [ -p /tmp/hypr/workspace_states ]; then
	mkfifo /tmp/hypr/workspace_states
fi

# declare variables
monitor_number=$(hyprctl -j monitors | jq length)

declare -a workspace_exist
declare -a active_workspace_on_monitor
declare -a monitor_for_workspace
declare -i focused_workspace_id
declare -i focused_monitor_id

# initialize_monitor_for_workspace
for ((i = 0; i < $monitor_number; i++)); do
	for ((j = $i * 10 + 1; j <= $i * 10 + 10; j++)); do
		monitor_for_workspace[$j]=$i
	done
done

# initialize_exist_workspace
while read -r i; do
	if [ $i -gt 0 ] && [ $i -le $((monitor_number * 10)) ]; then
		workspace_exist[$i]=1
	fi
done < <(hyprctl -j workspaces | jq -r '.[] |.id')

# initialize_active_workspace
while read -r k v; do
	active_workspace_on_monitor[$k]=$v
done < <(hyprctl -j monitors | jq -r '.[] | "\(.id) \(.activeWorkspace.id)"')

# initialize_focused_workspace
focused_workspace_id=$(hyprctl -j monitors | jq -r '.[] | select(.focused == true) | .activeWorkspace.id')
focused_monitor_id=${monitor_for_workspace[$focused_workspace_id]}

get_workspace_state() {
	if [ "${workspace_exist[$1]}" == 1 ]; then
		id=${monitor_for_workspace[$1]}
		if [ "${active_workspace_on_monitor[$id]}" -eq "$1" ]; then
			if [ "$focused_workspace_id" -eq "$1" ]; then
				return "3"         # focused
			else return "2"; fi # active
		else return "1"; fi  # exist
	else return "0"; fi   # null
}

# generate json for eww
# [
#   focused_monitor_id, \
#   [
#     [active_workspace_on_monitor[0], workspace_states(on monitor 0)],
#     [active_workspace_on_monitor[1], workspace_states(on monitor 1)],
#   ]
#    ...
# ]
generate_json_for_eww() {
	local output=
	output+='['
	output+="$focused_monitor_id"", "
	output+='['
	for i in $(seq 0 $((monitor_number - 1))); do
		if ! [ "$i" -eq 0 ]; then output+=", "; fi
		output+='['
		output+="${active_workspace_on_monitor[$i]}"
		for j in $(seq $(($i * 10 + 1)) $(($i * 10 + 10))); do
			get_workspace_state $j
			output+=", $?"
		done
		output+=']'
	done
	output+=']'
	output+=']'
	echo $output
}

generate_json_for_eww

# main loop
socat -u UNIX-CONNECT:/tmp/hypr/"$HYPRLAND_INSTANCE_SIGNATURE"/.socket2.sock - |
	rg --line-buffered "workspace|mon(itor)?" |
	while read -r line; do
		case ${line%>>*} in
		"focusedmon")
			focused_workspace_id=${line#*,}
			;;
		"workspace")
			focused_workspace_id=${line#*>>}
			;;
		"createworkspace")
			if [[ "$line" =~ "special" ]]; then continue; fi
			workspace_exist["${line#*>>}"]=1
			;;
		"destroyworkspace")
			if [[ "$line" =~ "special" ]]; then continue; fi
			workspace_exist["${line#*>>}"]=0
			;;
		"monitor"*)
			hyprctl reload
			;;
		esac

		# echo $line
		focused_monitor_id=${monitor_for_workspace[$focused_workspace_id]}
		active_workspace_on_monitor[$focused_monitor_id]=$focused_workspace_id
		generate_json_for_eww

	done

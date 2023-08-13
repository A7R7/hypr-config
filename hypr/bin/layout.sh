#!/bin/bash
# proudly stolen from https://github.com/Moerliy/dotfiles/blob/f9dda76994838a31259a0c02081ade9a8378cfe3/.config/hypr/scripts/changeLayout
LAYOUT=$(hyprctl -j getoption general:layout | jq '.str' | sed 's/"//g')

case $LAYOUT in
"master")
	hyprctl keyword general:layout dwindle
	hyprctl keyword unbind SUPER,J
	hyprctl keyword unbind SUPER,K
	# hyprctl keyword unbind SUPER,I
	# hyprctl keyword unbind SUPER,D
	hyprctl keyword unbind SUPERSHIFT,Return
	hyprctl keyword unbind SUPERSHIFT,period
	hyprctl keyword unbind SUPERSHIFT,comma
	hyprctl keyword unbind SUPERCTRL,Return
	hyprctl keyword bind SUPER,J,cyclenext
	hyprctl keyword bind SUPER,K,cyclenext,prev
	hyprctl keyword bind SUPER,O,togglesplit
	hyprctl keyword bind SUPER,P,pseudo
	hyprctl keyword bind SUPERSHIFT,P,exec,hyprctl dispatch workspaceopt allpseudo
	notify-send -i "$HOME/.config/hypr/mako/icons/hyprland.png" "Layout" "Dwindle"
	;;
"dwindle")
	hyprctl keyword general:layout master
	hyprctl keyword unbind SUPER,J
	hyprctl keyword unbind SUPER,K
	hyprctl keyword unbind SUPER,O
	hyprctl keyword unbind SUPER,P
	hyprctl keyword unbind SUPERSHIFT,P
	hyprctl keyword bind SUPER,J,layoutmsg,cyclenext
	hyprctl keyword bind SUPER,K,layoutmsg,cycleprev
	# hyprctl keyword bind SUPER,I,layoutmsg,addmaster
	# hyprctl keyword bind SUPER,D,layoutmsg,removemaster
	hyprctl keyword bind SUPERSHIFT,Return,layoutmsg,swapwithmaster
	hyprctl keyword bind SUPERSHIFT,period,layoutmsg,orientationnext
	hyprctl keyword bind SUPERSHIFT,comma,layoutmsg,orientationprev
	hyprctl keyword bind SUPERCTRL,Return,layoutmsg,focusmaster
	notify-send -i "$HOME/.config/hypr/mako/icons/hyprland.png" "Layout" "Master"
	;;
*) ;;

esac

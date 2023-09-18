- [Variables](#orgabf4d64)
  - [Input](#orgfe2b883)
  - [General](#orgb88da99)
  - [Decoration](#org3a8dec8)
  - [Layout](#orge2cc15c)
  - [Gestures](#org75cc758)
  - [Devices](#org9de05a6)
  - [Misc](#orgd243609)
- [Keywords](#org5256e1a)
  - [Monitors](#orgd9ed49c)
  - [Executes](#org89e9e65)
  - [Keybinds](#org62cddd8)
  - [Window rules](#org38f8150)
  - [Workspace Rules](#orga3aee38)
  - [Animations](#orgead7e94)
- [Pyprland](#org702f1e6)
  - [Core](#orge3cc7b8)
  - [Scratchpads](#orgde469e6)
  - [Lost Windows](#org1515f8e)




<a id="orgabf4d64"></a>

# Variables

Variables are "options" of hyprland. Each variable has a unique value assigned to it.


<a id="orgfe2b883"></a>

## Input

```conf
input {
  kb_layout = us
    kb_variant =
    kb_model =
    kb_options = caps:escape,shift:both_capslock
    kb_rules =

    follow_mouse = 1

    touchpad {
      natural_scroll = true
    }
  sensitivity = 1 # -1.0 - 1.0, 0 means no modification.
    repeat_rate = 28
    repeat_delay = 400
}
```


<a id="orgb88da99"></a>

## General

See [Configuring/Variables](https://wiki.hyprland.org/Configuring/Variables/) for more

```conf
general {
# See https://wiki.hyprland.org/Configuring/Variables/ for more

  gaps_in = 10 
    gaps_out = 20
    border_size = 4
    col.active_border = rgba(33ccffee) rgba(00ff99ee) 45deg
    col.inactive_border = rgba(24283be6)

    layout = dwindle
# layout = master
}
```


<a id="org3a8dec8"></a>

## Decoration

See [Configuring/Variables](https://wiki.hyprland.org/Configuring/Variables/) for more

```conf
decoration {
  active_opacity=1.0
  fullscreen_opacity=1.0
  rounding = 11
  multisample_edges=true
  drop_shadow = true
  shadow_range = 4
  shadow_render_power = 3
  col.shadow = rgba(1a1a1aee)
 #    blur = false
  blur {
    enabled = false #enable kawase window background blur bool true
    size = 8 #blur size (distance) int 8
    passes = 1 #the amount of passes to perform int 1
    ignore_opacity = false #make the blur layer ignore the opacity of the window bool false
    new_optimizations = true #whether to enable further optimizations to the blur. Recommended to leave on, as it will massively improve performance. bool true
    xray = true #if enabled, floating windows will ignore tiled windows in their blur. Only available if blur_new_optimizations is true. Will reduce overhead on floating blur significantly. bool false
    noise = 0.0117 #how much noise to apply. 0.0 - 1.0 float 0.0117
    contrast = 0.8916 #contrast modulation for blur. 0.0 - 2.0 float 0.8916
    brightness = 0.8172 #brightness modulation for blur. 0.0 - 2.0 float 0.8172
   }
 }
```


<a id="orge2cc15c"></a>

## Layout

[Dwindle-Layout](https://wiki.hyprland.org/Configuring/Dwindle-Layout/)

```conf
dwindle {
  pseudotile = true # master switch for pseudotiling. Enabling is bound to mainMod + P in the keybinds section below
    preserve_split = true # you probably want this
}
```

[Master-Layout](https://wiki.hyprland.org/Configuring/Master-Layout/)

```conf
master {
  new_is_master = true
}
```


<a id="org75cc758"></a>

## Gestures

See <https://wiki.hyprland.org/Configuring/Variables/> for more

```conf
gestures {
  workspace_swipe = true
  workspace_swipe_fingers = 3;
  workspace_swipe_distance = 2500;
}
```


<a id="org9de05a6"></a>

## Devices

See <https://wiki.hyprland.org/Configuring/Keywords/#executing> for more

```conf
# Example per-device config
device:epic mouse V1 {
         sensitivity = -0.5
       }
```


<a id="orgd243609"></a>

## Misc

```conf
misc {
  disable_hyprland_logo = true
    disable_splash_rendering = true
    vrr = 2
}
```


<a id="org5256e1a"></a>

# Keywords

Keywords are not variables, but “commands” for more advanced configuring. ALL arguments separated by a comma, if you want to leave one of them empty, you cannot reduce the number of commas


<a id="orgd9ed49c"></a>

## Monitors

```conf
$M1=Dell Inc. DELL P190S
$M2=Philips Consumer Electronics Company PHL24E1N5600
$M3=BOE 0x092F

$port1=eDP-1
$port2=DP-1
$port3=DP-2
$port4=HDMI-A-1

$screen1=$port4
$screen2=$port3
$screen3=$port1

# monitor=$screen1,1280x1024@60Hz,0x0,1
# monitor=$screen2,2560x1440@75Hz,1280x0,1
# monitor=$screen3,2520x1680@60Hz,3840x0,1

monitor=$screen1,1280x1024@60Hz,0x0,1, transform, 1
monitor=$screen2,2560x1440@75Hz,1024x0,1
monitor=$screen3,2520x1680@60Hz,3584x0,1

# monitor=$screen3,2520x1680@60Hz,0x0,1

workspace = $screen3, 1
workspace = $screen1, 11
workspace = $screen2, 21
```


<a id="org89e9e65"></a>

## Executes

Execute a shell script on startup of the compositor or on each time it's reloaded.

-   **exec-once=command:** will execute only on launch
-   **exec=command:** will execute on each reload

```conf
# exec-once = dbus-update-activation-environment --all
exec-once = /usr/bin/gnome-keyring-daemon --start --components=secrets
exec-once = /usr/lib/polkit-gnome/polkit-gnome-authentication-agent-1 &
exec-once = dunst &
exec-once = fcitx5 -d
exec-once = pulseaudio -D

exec-once = wl-paste --type text --watch cliphist store #Stores only text data
exec-once = wl-paste --type image --watch cliphist store #Stores only image data

# exec-once = clash-verge;
exec-once = pkill eww; eww daemon; eww open-many bar0 bar1 bar2;
exec-once = pkill hyprpaper; hyprpaper;

# exec-once = bash -c ~/.config/hypr/bin/init.sh

# emacs client has bugs
# exec-once = emacs --init-directory=~/.doomemacs.d --daemon 
```


<a id="org62cddd8"></a>

## Keybinds


### Helpful variables

```conf
# helpful variables
$activeMonitorId="$(hyprctl -j monitors | jq -r '.[] | select(.focused == true) | .id')"
$activeWorkspaceId="$(hyprctl -j activeworkspace | jq -r '.id')"
$focusWorkspace="hyprctl dispatch workspace"
$focusMonitor="hyprctl dispatch focusmonitor"
$move2Workspace="hyprctl dispatch movetoworkspace" 
$specialWorkspaceId="$(hyprctl -j activewindow | jq -r '.workspace.name' | cut -d':' -f2)"
$toggleOverview=
$mainMod = SUPER

```


### Launch applications

```conf
# applications
bind = $mainMod, Return, exec, kitty --single-instance
bind = $mainMod, E, exec, thunar
bind = $mainMod, B, exec, vivaldi-stable
bind = $mainMod, N, exec, neovide --multigrid
bind = $mainMod, M, exec, emacs

bind = $mainMod, R, exec, ~/.config/rofi/launcher.sh
bind = $mainMod, F, exec, ~/.config/rofi/file.sh
bind = $mainMod, V, exec, ~/.config/rofi/clipboard.sh

```

-   Grimblast

```conf
bind=,Print,execr, grimblast --notify --cursor copysave area
bind=SUPER,Print,exec,grimblast --notify save output $(xdg-user-dir PICTURES)/Screenshots/$(date +'%Y%m%d%H%M%S_1.png')
bind=SUPERSHIFT,Print,exec,grimblast save output - | swappy -f -
```


### Window Functions

```conf
#function 
bind = $mainMod , Q, killactive,
bind = $mainMod , S, togglesplit, # dwindle
bind = $mainMod , G, togglegroup,
# bind = $mainMod , O, execr, ~/.config/hypr/bin/eww_toggle_overview.sh 
bind = $mainMod ALT, F9,  pseudo, # dwindle
bind = $mainMod ALT, F10, togglefloating,
bind = $mainMod ALT, F11, fullscreen, 0
```


### Desktop Functions

```conf
bind = $mainMod ALT, Delete, exec, wlogout  
bind = $mainMod CTRL ALT, Delete, exec, kill  
bindle = , XF86AudioRaiseVolume,    exec, pactl set-sink-volume @DEFAULT_SINK@ +1%
bindle = , XF86AudioLowerVolume,    exec, pactl set-sink-volume @DEFAULT_SINK@ -1%
bindle = , XF86MonBrightnessUp,     exec, brightnessctl set 5%+ -q
bindle = , XF86MonBrightnessDown,   exec, brightnessctl set 5%- -q
bindle = , XF86KbdBrightnessUp,     exec, bash ~/.config/eww/scripts/brightness kbd up
bindle = , XF86KbdBrightnessDown,   exec, bash ~/.config/eww/scripts/brightness kbd down
bindl  = , XF86AudioStop,           exec, playerctl stop
bindl  = , XF86AudioPause,          exec, playerctl pause
bindl  = , XF86AudioPrev,           exec, playerctl previous
bindl  = , XF86AudioNext,           exec, playerctl next
bindl  = , XF86AudioPlay,           exec, playerctl play-pause

bind = CTRL ALT, F1, exec, notify-send "CTRL ALT F1"
bind = CTRL ALT, F2, exec, notify-send "CTRL ALT F2"
```


### Move Focus

```conf
bind = $mainMod, left, movefocus, l
bind = $mainMod, right, movefocus, r
bind = $mainMod, up, movefocus, u
bind = $mainMod, down, movefocus, d
bind = $mainMod, H, movefocus, l
bind = $mainMod, J, movefocus, d
bind = $mainMod, K, movefocus, u
bind = $mainMod, L, movefocus, r

bind = $mainMod, 1, execr, "$focusWorkspace $activeMonitorId"1
bind = $mainMod, 2, execr, "$focusWorkspace $activeMonitorId"2
bind = $mainMod, 3, execr, "$focusWorkspace $activeMonitorId"3
bind = $mainMod, 4, execr, "$focusWorkspace $activeMonitorId"4
bind = $mainMod, 5, execr, "$focusWorkspace $activeMonitorId"5
bind = $mainMod, 6, execr, "$focusWorkspace $activeMonitorId"6
bind = $mainMod, 7, execr, "$focusWorkspace $activeMonitorId"7
bind = $mainMod, 8, execr, "$focusWorkspace $activeMonitorId"8
bind = $mainMod, 9, execr, "$focusWorkspace $activeMonitorId"9
bind = $mainMod, 0, execr, "$focusWorkspace $((1+$activeMonitorId))"0

bind = $mainMod, i, focusmonitor, $screen1
bind = $mainMod, o, focusmonitor, $screen2
bind = $mainMod, p, focusmonitor, $screen3

#    Move focuse inside focusing monitor
# bind = $mainMod ALT, H, execr, "$focusWorkspace" "$activeMonitorId""$(((activeWorkspaceId-1)%10))"
# bind = $mainMod ALT, L, execr, "$focusWorkspace" "$activeMonitorId""$(((activeWorkspaceId+1)%10))"
bind = $mainMod , COMMA,       execr, `if [ $(("$activeWorkspaceId" % 10)) -eq 1 ]; then "$focusWorkspace $(($activeWorkspaceId+9))"; else "$focusWorkspace $(($activeWorkspaceId-1))" ;fi`
bind = $mainMod , PERIOD,      execr, `if [ $(("$activeWorkspaceId" % 10)) -eq 0 ]; then "$focusWorkspace $(($activeWorkspaceId-9))"; else "$focusWorkspace $(($activeWorkspaceId+1))" ;fi`
bind = $mainMod , BracketLeft, execr, `if [ $(("$activeWorkspaceId" % 10)) -eq 1 ]; then "$focusWorkspace $(($activeWorkspaceId+9))"; else "$focusWorkspace $(($activeWorkspaceId-1))" ;fi`
bind = $mainMod , BracketRight,execr, `if [ $(("$activeWorkspaceId" % 10)) -eq 0 ]; then "$focusWorkspace $(($activeWorkspaceId-9))"; else "$focusWorkspace $(($activeWorkspaceId+1))" ;fi`
bind = $mainMod SHIFT, COMMA,  execr, `if [ $(("$activeWorkspaceId" % 10)) -eq 1 ]; then "$move2Workspace $(($activeWorkspaceId+9))"; else "$move2Workspace $(($activeWorkspaceId-1))" ;fi`
bind = $mainMod SHIFT, PERIOD, execr, `if [ $(("$activeWorkspaceId" % 10)) -eq 0 ]; then "$move2Workspace $(($activeWorkspaceId-9))"; else "$move2Workspace $(($activeWorkspaceId+1))" ;fi`
bind = $mainMod ALT, h, workspace, m-1
bind = $mainMod ALT, l, workspace, m+1

bind = $mainMod , Tab, workspace, previous
# bind = $mainMod , COMMA,  workspace, m-1
# bind = $mainMod , PERIOD, workspace, m+1
```


### Move Window

```conf
#  Move window{{{2
#    Move window to direction{{{
bind = $mainMod SHIFT, left, movewindow, l
bind = $mainMod SHIFT, right, movewindow, r
bind = $mainMod SHIFT, up, movewindow, u
bind = $mainMod SHIFT, down, movewindow, d
bind = $mainMod SHIFT, H, movewindow, l
bind = $mainMod SHIFT, J, movewindow, d
bind = $mainMod SHIFT, K, movewindow, u
bind = $mainMod SHIFT, L, movewindow, r
#}}}
```

```conf
#    Move window to workspace {{{
bind = $mainMod SHIFT, 1, execr, "$move2Workspace" "$activeMonitorId"1
bind = $mainMod SHIFT, 2, execr, "$move2Workspace" "$activeMonitorId"2
bind = $mainMod SHIFT, 3, execr, "$move2Workspace" "$activeMonitorId"3
bind = $mainMod SHIFT, 4, execr, "$move2Workspace" "$activeMonitorId"4
bind = $mainMod SHIFT, 5, execr, "$move2Workspace" "$activeMonitorId"5
bind = $mainMod SHIFT, 6, execr, "$move2Workspace" "$activeMonitorId"6
bind = $mainMod SHIFT, 7, execr, "$move2Workspace" "$activeMonitorId"7
bind = $mainMod SHIFT, 8, execr, "$move2Workspace" "$activeMonitorId"8
bind = $mainMod SHIFT, 9, execr, "$move2Workspace" "$activeMonitorId"9
bind = $mainMod SHIFT, 0, execr, "$move2Workspace" "$((1+$activeMonitorId))"0
#}}}
```

```conf
#    Move window to monitor {{{
bind = $mainMod SHIFT, F1, movewindow, mon:$screen1
bind = $mainMod SHIFT, F2, movewindow, mon:$screen2
bind = $mainMod SHIFT, F3, movewindow, mon:$screen3
#}}}
```

```conf

#    Move window to special workspace {{{
bind = $mainMod SHIFT, S,   movetoworkspace, special
bind = $mainMod SHIFT, F1,  movetoworkspace, special:1
bind = $mainMod SHIFT, F2,  movetoworkspace, special:2
bind = $mainMod SHIFT, F3,  movetoworkspace, special:3
bind = $mainMod SHIFT, F4,  movetoworkspace, special:4
bind = $mainMod SHIFT, F5,  movetoworkspace, special:5
bind = $mainMod SHIFT, F6,  movetoworkspace, special:6
bind = $mainMod SHIFT, F7,  movetoworkspace, special:7
bind = $mainMod SHIFT, F8,  movetoworkspace, special:8
bind = $mainMod SHIFT, F9,  movetoworkspace, special:9 
bind = $mainMod SHIFT, F10, movetoworkspace, special:10 
bind = $mainMod SHIFT, F11, movetoworkspace, special:11 
bind = $mainMod SHIFT, F12, movetoworkspace, special:12 
#}}}
```

```conf

#    Move float window position{{{
binde = $mainMod ALT, left,moveactive,-50 0
binde = $mainMod ALT, down,moveactive, 0 50 
binde = $mainMod ALT, up,moveactive, 0 -50
binde = $mainMod ALT, right,moveactive, 50 0
binde = $mainMod ALT, H,moveactive,-50 0
binde = $mainMod ALT, J,moveactive, 0 50
binde = $mainMod ALT, K,moveactive, 0 -50
binde = $mainMod ALT, L,moveactive, 50 0
#}}}
#
#}}}2
```

-   Mouse actions to move window, resize window and swap workspaces.

```conf
#  Mouse window action{{{
bindm= $mainMod, mouse:272, movewindow
bindm= $mainMod, mouse:273, resizewindow
bind = $mainMod, mouse_down, workspace, e+1
bind = $mainMod, mouse_up, workspace, e-1
#}}}
```

-   Special workspace

```conf
#  Special workspace{{{
#  hide a showing specialWorkspace
bind = $mainMod, escape, execr, hyprctl dispatch togglespecialworkspace $specialWorkspaceId
# bind = $mainMod, F1,  togglespecialworkspace, 1
# bind = $mainMod, F2,  togglespecialworkspace, 2
# bind = $mainMod, F3,  togglespecialworkspace, 3
# bind = $mainMod, F4,  togglespecialworkspace, 4
# bind = $mainMod, F5,  togglespecialworkspace, 5
# bind = $mainMod, F6,  togglespecialworkspace, 6
# bind = $mainMod, F7,  togglespecialworkspace, 7
# bind = $mainMod, F8,  togglespecialworkspace, 8
# bind = $mainMod, F9,  togglespecialworkspace, 9 
# bind = $mainMod, F10, togglespecialworkspace, 10 
# bind = $mainMod, F11, togglespecialworkspace, 11 
# bind = $mainMod, F12, togglespecialworkspace, 12 
#}}}

#}}}1
```


### Window resize

```conf
binde = $mainMod CTRL, left,resizeactive,-50 0
binde = $mainMod CTRL, down,resizeactive, 0 50 
binde = $mainMod CTRL, up,resizeactive, 0 -50
binde = $mainMod CTRL, right,resizeactive, 50 0
binde = $mainMod CTRL, H,resizeactive,-50 0
binde = $mainMod CTRL, J,resizeactive, 0 50
binde = $mainMod CTRL, K,resizeactive, 0 -50
binde = $mainMod CTRL, L,resizeactive, 50 0

bind  = $mainMod CTRL, R, submap, resize
submap = resize
binde = , left , resizeactive,-50 0
binde = , down , resizeactive, 0 50
binde = , up   , resizeactive, 0 -50
binde = , right, resizeactive, 50 0
binde = , h    , resizeactive,-50 0
binde = , j    , resizeactive, 0 50
binde = , k    , resizeactive, 0 -50
binde = , l    , resizeactive, 50 0
bind  = ,escape, submap, reset
bind  = $mainMod SHIFT, R, submap, reset
submap = reset
```


<a id="org38f8150"></a>

## Window rules

```conf
# floats
windowrule = float, ^(Rofi)$
windowrule = float, ^(wlogout)$
windowrule = float, ^(org.gnome.Calculator)$
windowrule = float, ^(org.gnome.Nautilus)$
windowrule = float, ^(org.gnome.Settings)$
windowrule = float, ^(org.gnome.design.Palette)$
windowrule = float, ^(eww)$
windowrule = float, ^(pavucontrol)$
windowrule = float, ^(nm-connection-editor)$


windowrule = float, ^(Color Picker)$
windowrule = float, ^(Network)$
windowrule = float, ^(xdg-desktop-portal)$
windowrule = float, ^(xdg-desktop-portal-gnome)$
windowrule = float, ^(transmission-gtk)$
windowrule = float, ^(hmcl)$
windowrulev2 = float, class:^(thunar)$,title:^(?!.* - Thunar$).*$
windowrule = float, ^(org.fcitx.fcitx5-config-qt)
windowrule = float, ^(file-roller)$

windowrulev2 = float, class:^(vlc)$,title:^(Adjustments and Effects — VLC media player)$
windowrulev2 = float, class:^(vlc)$,title:^(Simple Preferences — VLC media player)$

windowrulev2 = float, class:^(Vivaldi-stable)$, mapped:1
```

Emacs rules

```conf
# emacs
## ediff
windowrulev2 = float, class:^(Emacs)$,title:^(Ediff)$
windowrulev2 = noborder, class:^(Emacs)$,title:^(Ediff)$
## minibuf
windowrulev2 = float, class:^(emacs)$,title:^( \*Minibuf-\d+\*)$
windowrulev2 = noborder, class:^(emacs)$,title:^( \*Minibuf-\d+\*)$
## eaf.py
windowrule = float, title:eaf.py*
windowrule = noanim, title:eaf.py*
windowrule = nofocus, title:eaf.py*
## holo_layer
windowrulev2 = float, class:^(python3)$, title:^(holo_layer.py)$
windowrulev2 = nofocus, class:^(python3)$, title:^(holo_layer.py)$
windowrulev2 = noanim, class:^(python3)$, title:^(holo_layer.py)$
```

```conf
# bluetooth
windowrule = float, ^(blueberry.py)$
windowrulev2 = float, class:^(blueman-manager)$, title: ^(Bluetooth Devices)$

# tiles
windowrule = tile, neovide
windowrulev2 = tile, class:^(wps)$, title: - Writer$ 

# xwayland floating window
windowrulev2 = rounding 0, xwayland:1, floating:1, title:^(?!QQ$|Vivaldi Settings$)
windowrulev2 = noinitialfocus, xwayland:1

# deadd
windowrulev2 = noinitialfocus, class:^(deadd-notification-center)$
windowrulev2 = noborder, class:^(deadd-notification-center)$
windowrulev2 = noborder, class:^(deadd-notification-center)$

layerrule = blur, rofi
```


<a id="orga3aee38"></a>

## Workspace Rules

Currently I have no workspace rules.


<a id="orgead7e94"></a>

## Animations

See <https://wiki.hyprland.org/Configuring/Animations/> for more

```conf
animations {
    enabled = true
    bezier = myBezier, 0.05, 0.9, 0.1, 1.05
    animation = windows, 1, 3, default
    animation = windowsOut, 1, 4, default, popin 50%
    animation = border, 1, 5, default
    animation = borderangle, 1, 5, default
    animation = fade, 1, 5, default
    animation = workspaces, 1, 2, default
    animation = specialWorkspace, 1, 2.5, default, slidevert
    # animation = specialWorkspace, 1, 3, default, fade
}
```


<a id="org702f1e6"></a>

# Pyprland

Pyprland hosts process for multiple Hyprland plugins.


<a id="orge3cc7b8"></a>

## Core

First let's launch pyprland on startup.

```conf
exec-once = pypr
```

Pyprland's core configuration goes to `~/.config/hypr/pyprland.json`

```json
{
  "pyprland": {
    "plugins": [
      "scratchpads",
      "lost_windows"
    ]
  },
  "scratchpads": {
    "term": {
      "command": "kitty --class kitty-dropterm",
      "animation": "fromTop",
      "lazy": true
    },
    "files": {
      "command": "thunar",
      "animation": "fromTop",
      "lazy": true
    },
    "dict": {
      "command": "goldendict",
      "animation": "fromTop",
      "lazy": true
    },
    "tty-clock": {
      "command": "kitty --class kitty-tty-clock tty-clock -cs",
      "animation": "fromTop",
      "lazy": true
    },
    "cava": {
      "command": "kitty --class kitty-cava cava",
      "animation": "fromBottom",
      "lazy": true
    },
    "pipes": {
      "command": "kitty --class kitty-pipes pipes",
      "animation": "fromLeft",
      "lazy": true
    },
    "cmatrix": {
      "command": "kitty --class kitty-cmatrix cmatrix",
      "animation": "fromRight",
      "lazy": true
    },
    "music": {
      "command": "tauon",
      "animation": "fromTop",
      "unfocus": "hide",
      "lazy": true
    },
    "volume": {
      "command": "pavucontrol",
      "animation": "fromRight",
      "unfocus": "hide",
      "lazy": true
    },
    "network": {
      "command": "nm-connection-editor",
      "animation": "fromRight",
      "lazy": true
    },
    "bluetooth": {
      "command": "blueman-manager",
      "animation": "fromLeft",
      "lazy": true
    },
    "clash": {
      "command": "clash-verge",
      "animation": "fromTop",
      "lazy": false
    },
    "placeholder": {
      "command": "",
      "lazy": true
    }
  }
}
```


<a id="orgde469e6"></a>

## Scratchpads


### Dropterm

```json
"term": {
  "command": "kitty --class kitty-dropterm",
  "animation": "fromTop",
  "lazy": true
},
```

```conf
bind = $mainMod, F1, exec, pypr toggle term
$dropterm  = ^(kitty-dropterm)$
windowrule = float,$dropterm
windowrule = workspace special silent,$dropterm
windowrule = size 75% 60%,$dropterm
```


### File-manager

```json
"files": {
  "command": "thunar",
  "animation": "fromTop",
  "lazy": true
},
```

```conf
bind = $mainMod, F2, exec, pypr toggle files
windowrule = float,^(thunar)$
windowrule = workspace special silent,^(thunar)$
windowrule = size 75% 60%,^(thunar)$
```


### Dict

```json
"dict": {
  "command": "goldendict",
  "animation": "fromTop",
  "lazy": true
},
```

```conf
bind = $mainMod, F3, exec, pypr toggle dict
windowrule = float,^(GoldenDict)$
windowrule = workspace special silent,^(GoldenDict)$
windowrule = size 75% 60%,^(GoldenDict)$
```


### Fancy-Terms

```conf
bind = $mainMod, F4, exec, pypr toggle pipes; sleep 0.07; pypr toggle cava;
bind = $mainMod, F4, exec, pypr toggle cmatrix; sleep 0.07; pypr toggle tty-clock
```

-   tty-clock

```json
"tty-clock": {
  "command": "kitty --class kitty-tty-clock tty-clock -cs",
  "animation": "fromTop",
  "lazy": true
},
```

```conf
windowrule = float, ^(kitty-tty-clock)$
windowrule = workspace special silent, ^(kitty-tty-clock)$
windowrule = size 40% 45%, ^(kitty-tty-clock)$
```

-   cava

```json
"cava": {
  "command": "kitty --class kitty-cava cava",
  "animation": "fromBottom",
  "lazy": true
},
```

```conf
windowrule = float, ^(kitty-cava)$
windowrule = workspace special silent, ^(kitty-cava)$
windowrule = size 40% 45%, ^(kitty-cava)$
```

-   Pipes

```json
"pipes": {
  "command": "kitty --class kitty-pipes pipes",
  "animation": "fromLeft",
  "lazy": true
},
```

```conf
windowrule = float, ^(kitty-pipes)$
windowrule = workspace special silent, ^(kitty-pipes)$
windowrule = size 25% 60%, ^(kitty-pipes)$
```

-   CMatrix

```json
"cmatrix": {
  "command": "kitty --class kitty-cmatrix cmatrix",
  "animation": "fromRight",
  "lazy": true
},
```

```conf
windowrule = float, ^(kitty-cmatrix)$
windowrule = workspace special silent, ^(kitty-cmatrix)$
windowrule = size 25% 60%, ^(kitty-cmatrix)$
```


### Music

Toggle tauon music box from top of the screen.

```json
"music": {
  "command": "tauon",
  "animation": "fromTop",
  "unfocus": "hide",
  "lazy": true
},
```

```conf
bind = $mainMod, F5, exec, pypr toggle music
windowrule = float,^(tauonmb)$
windowrule = workspace special,^(tauonmb)$
windowrule = size 50% 50%,^(tauonmb)$
```


### Pavucontrol

Toggle pavucontrol from right of the screen.

```json
"volume": {
  "command": "pavucontrol",
  "animation": "fromRight",
  "unfocus": "hide",
  "lazy": true
},
```

```conf
bind = $mainMod, F5, exec, pypr toggle volume
windowrule = float,^(pavucontrol)$
windowrule = workspace special silent,^(pavucontrol)$
windowrule = size 25% 25%,^(pavucontrol)$
```


### Network

Toggle network-manager from right, bluetooth-manager from left, and clash-verge from top.

-   Network-manager

```json
"network": {
  "command": "nm-connection-editor",
  "animation": "fromRight",
  "lazy": true
},
```

```conf
bind = $mainMod, F9, exec, pypr toggle network
windowrule = float, ^(nm-connection-editor)$
windowrulev2 = workspace special silent, class:^(nm-connection-editor)$, title:^(Network Connections)$
windowrule = size 18% 40%,^(nm-connection-editor)$
```

-   Bluetooth

```json
"bluetooth": {
  "command": "blueman-manager",
  "animation": "fromLeft",
  "lazy": true
},
```

```conf
bind = $mainMod, F9, exec, pypr toggle bluetooth
windowrule = float, ^(blueman-manager)
windowrule = workspace special silent, ^(blueman-manager)$
windowrule = size 18% 40%,^(blueman-manager)$
```

-   Clash-Verge

```json
"clash": {
  "command": "clash-verge",
  "animation": "fromTop",
  "lazy": false
},
```

```conf
bind = $mainMod, F9, exec, pypr toggle clash
windowrule = float, ^(clash-verge)$
windowrule = workspace special silent, ^(clash-verge)$
windowrule = size 50% 50%,^(clash-verge)$
```


<a id="org1515f8e"></a>

## Lost Windows

```

```
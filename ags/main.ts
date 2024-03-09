// * imports
const { GLib } = imports.gi;
import Gtk from 'gi://Gtk?version=3.0';
import Gdk from "gi://Gdk"
import { GetClassIcon } from './utils.js';
import brightness from './brightness.js';
import { Cava } from './cava.js'
const hello = Widget.Label(' ');
// * Taskbar
// ** Hyprland
export const hyprland = await Service.import('hyprland');
const activeWs = hyprland.active.workspace;
const activeCli = hyprland.active.client;
const dispatch = (args: string) => hyprland.messageAsync(`dispatch ${args}`)

globalThis.hyprland = hyprland;
// Service:1 ends here

var focusOnHover = true;
const TogglefocusOnHover = () => Widget.Button ({
    class_name: 'on toggle-button',
    child: Widget.Label({
        label: "󰈈",
        class_name: 'nerd-icons',
    }),
    on_clicked: (self) => {
        focusOnHover = !focusOnHover;
        self.toggleClassName("on", focusOnHover);
    },
    tooltip_text: "focus on hover: " + focusOnHover ? "on" : "off",
})

// ** Workspace Box
const TARGET = [Gtk.TargetEntry.new("text/plain", Gtk.TargetFlags.SAME_APP, 0)]
const WsBox = (id, label?) => {
    return Widget.EventBox({
        class_name: 'workspace',
        attribute: { id },
        on_hover: () => {
            if (id > 0) dispatch(`workspace`, id);
        },
        child: Widget.Box({
            vertical: true,
            children: label ? [
                Widget.Label({
                    attribute: {address: 'label'},
                    class_name: 'nerd-icons',
                    label: label,
                }), ] : [],
        }),
        setup: self => {
            self.toggleClassName('hidden', true);
            self.hook(activeWs, () => {
                self.toggleClassName('active', activeWs.id === id)
            });
            self.drag_dest_set(Gtk.DestDefaults.ALL, TARGET, Gdk.DragAction.COPY);
            self.connect("drag-data-received", (_w, _c, _x, _y, data) => {
                const address = new TextDecoder().decode(data.get_data())
                if (focusOnHover) {
                    dispatch(`movetoworkspace ${id},address:${address}`)
                } else {
                    dispatch(`movetoworkspacesilent ${id},address:${address}`)
                }
            });
        }
    })
};

// ** Client Button

const CliMenu = (address: string) => {
    let cli = hyprland.getClient(address);
    const menuItems = [];
    for (const key in cli) {
        menuItems.push(Widget.MenuItem({
            child: Widget.Label({
                hpack: 'start',
                label: `${key} : ${cli[key]}`,
            }),
            on_activate: () => {
                Utils.execAsync(`echo ${cli[key]} | wl-copy`);
            }
        }))
    };
    const menu = Widget.Menu({
        children: menuItems,
        setup: self => self.on("notify::visible", (self) => {
            if (!self.visible) self.destroy()
        })
    });
    return menu;
}
const CliBtn = (address: string) => {
    const cli = hyprland.getClient(address);
    // print('cli-added', address);
    const cliBtn = Widget.Button({
        class_name: 'client',
        hpack: 'center',
        attribute: {address},
        on_clicked: () => {
            let id = hyprland.getClient(address).workspace.id
            id < 0 ? dispatch(`togglespecialworkspace ${id + 99}`)
                : dispatch(`focuswindow address:${address}`)
        },
        on_hover: () => {
            if (focusOnHover) {
                let id = hyprland.getClient(address).workspace.id
                id < 0 ? dispatch(`togglespecialworkspace ${id + 99}`)
                    : dispatch(`focuswindow address:${address}`)
            }
        },
        on_secondary_click: (_, event) => {
            CliMenu(address).popup_at_pointer(event);
        },
        on_middle_click: (_, event) => {
            dispatch(`closewindow address:${address}`)
        },
        child: Widget.Icon({
            hpack: 'center',
            icon: GetClassIcon(cli.class),
            size: 32,
        }),
        tooltip_text: cli.title,
        setup: self => {
            self.hook(activeCli, () => {
                self.toggleClassName('active', activeCli.address === address)
                self.toggleClassName('inactive', activeCli.address != address)
            })
            .on("drag-data-get", (_w, _c, data) => data.set_text(address, address.length))
            .on("drag-begin", (_, context) => {
                // Gtk.drag_set_icon_surface(context, createSurfaceFromWidget(self))
                print("begin to drag")
                self.toggleClassName("drag", true)
            })
            .on("drag-end", () => self.toggleClassName("drag", false))
            .drag_source_set(Gdk.ModifierType.BUTTON1_MASK, TARGET, Gdk.DragAction.COPY)
        }
    });
    print('new clibtn', address);
    print('   ', cliBtn)
    return cliBtn;
};

// ** Taskbar
const getWsId = (wsName: string) => {
    // Assume name === string(id) for normal workspaces.
    const match = /:\d+/.exec(wsName);
    return match ? (Number(match[0].slice(1)) - 99) : (Number(wsName));
}
const wsLabels = ["󰎤","󰎧","󰎪","󰎭","󰎱","󰎳","󰎶","󰎹","󰎼","󰎡"];
const Taskbar = (start, length, className, showLabel) => {
    const addrToWsId = new Map();
    const AddCliBtn = (self, address: string) => {
        if (!address) return;
        let id = hyprland.getClient(address).workspace.id;
        if (!id || id < start || id >= start + length) return;
        addrToWsId.set(address, id);
        const child = self.children.find(w => w.attribute.id === id);
        if (child) {
            child.child.children = [...child.child.children, CliBtn(address)];
            print(start, ':', 'client-added', address, id)
        } else {
            print(start, ':', 'client-add-failed', address, id)
        }
    };
    const RemoveCliBtn = (self, address: string) => {
        if (!address) return;
        let id = addrToWsId.get(address);
        if (!id || id < start || id >= start + length) return;
        addrToWsId.delete(address);
        const child = self.children.find(ws => ws.attribute.id === id);
        if (child) {
            child.child.children = child.child.children
                .filter(cli => cli.attribute.address !== address)
            print(start, ':', 'client-removed', address, id)
        } else {
            print(start, ':', 'client-removed-failed', address, id)
        }
    };
    const AddWsBox = (self, name?: string) => {
        const id = getWsId(name);
        if (!id || id < start || id >= start + length) return;
        const ws = WsBox(id, showLabel? wsLabels[id - start] : null);
        let i = self.children.findIndex(ws => ws.attribute.id > id);
        i = i === -1? self.children.length : i;
        self.children = self.children.toSpliced(i, 0, ws);
        print(start, ':', 'workspace-added', name, i);
    };
    const RemoveWsBox = (self, name?: string) => {
        const id = getWsId(name);
        if (!id || id < start || id >= start + length) return;
        self.children = self.children.filter(ws => ws.attribute.id !== id);
        print(start, ':', 'workspace-removed', id);
    };
    const ToggleVisible = (self, visible: bool, name?: string) => {
        const id = getWsId(name);
        if (!id || id < start || id >= start + length) return;
        const ws = self.children.find(ws => ws.attribute.id === id);
        ws.toggleClassName("hidden", !visible);
        // ws.visible = visible;
    }
    const HideWsBox = (self, name?:string) => ToggleVisible(self, false, name);
    const ShowWsBox = (self, name?:string) => ToggleVisible(self, true, name);

    const Taskbar = Widget.Box({
        class_name: className,
        vertical: true,
        children: Array.from({ length }, (_, i) => i + start).map(
            (id) => WsBox(id, showLabel? wsLabels[id - start] : null)
        ),
        setup: self => {
            hyprland.clients.map(cli => AddCliBtn(self, cli.address));
            self.hook(hyprland, AddCliBtn, 'client-added')
                .hook(hyprland, RemoveCliBtn, 'client-removed')
                .hook(hyprland, (w, event, params) => {
                    if (event === "movewindow") {
                        const argv = params.split(',');
                        const address = '0x' + argv[0];
                        const id = getWsId(argv[1]); // target id
                        print(start, ':', event, address, id);
                        RemoveCliBtn(self, address);
                        AddCliBtn(self, address, id);
                    }
                }, "event");
            hyprland.workspaces.map(ws => ShowWsBox(self, ws.name));
            self.hook(hyprland, ShowWsBox, 'workspace-added')
            self.hook(hyprland, HideWsBox, 'workspace-removed')
        }
    });
    return Taskbar;
}

const normalTaskbar = Taskbar(1, 10, 'normal taskbar', true);
const specialTaskbar = Taskbar(-98, 10, 'special taskbar', false);
// Taskbar:2 ends here

// * Time
const nowTime = Variable(GLib.DateTime.new_now_local(), {
    poll: [1000, () => GLib.DateTime.new_now_local()],
});

const uptime = Variable(0, {
    poll: [60_000, "cat /proc/uptime", line =>
        Number.parseInt(line.split(".")[0]) / 60,
          ],
});

const FancyClock = () => Widget.Box({
    class_name: 'clock',
    vertical: true,
    children: [
        Widget.CircularProgress({
            class_name: 'circular-progress',
            value: nowTime.bind().as(t => {
                const hour = t.get_hour();
                const minute = t.get_minute();
                const second = t.get_second();
                const totalSeconds = hour *  3600 + minute *  60 + second;
                return totalSeconds / 86400;
            })
        }),
        Widget.Label({
            class_name: 'clock-time',
            label: nowTime.bind().as(c => c.format('%H:%M'))}),
        Widget.Separator({ orientation: 1 }),
        Widget.Label({
            class_name: 'clock-weekday',
            label: nowTime.bind().as(c => c.format('%a').toUpperCase()),
            // css: 'border-top: 1px solid white; font-weight: bold; font-style: italic;',
        }),
        Widget.Label({
            class_name: 'clock-year',
            label: nowTime.bind().as(c => c.format('%Y'))}),
        Widget.Label({
            class_name: 'clock-date',
            label: nowTime.bind().as(c => c.format('%-m-%-d'))}),
        // Widget.Calendar({
        //     hexpand: true,
        //     hpack: "center",
        // }),
    ],
});
// Time:1 ends here

// * System tray
const systemtray = await Service.import('systemtray');
const SysTray = () => Widget.Box({
    class_name: 'systray',
    vertical: true,
    children: systemtray.bind('items').as(items =>
        items.map(item => Widget.Box({
            class_name: 'tray-item',
            hexpand: false,
            hpack: 'center',

            child: Widget.Button({
                child: Widget.Icon({
                    icon: item.bind('icon'),
                    size: 24,
                }),
                on_primary_click: (_, event) => item.activate(event),
                on_secondary_click: (_, event) => item.openMenu(event),
                tooltip_markup: item.bind('tooltip_markup'),
            }),
        }))
                                         ),
});
// System Tray:1 ends here

// * System Info
// ** Bluetooth
const bluetooth = await Service.import('bluetooth')

const ConnectedList = Widget.Box({
    setup: self => self.hook(bluetooth, self => {
        self.children = bluetooth.connected_devices
            .map(({ icon_name, name }) => Widget.Box([
                Widget.Icon({
                    icon: icon_name + '-symbolic',
                    // size: 30,
                }),
                Widget.Label(name),
            ]));

        self.visible = bluetooth.connected_devices.length > 0;
    }, 'notify::connected-devices'),
})

const BluetoothIndicator = () => Widget.Icon({
    icon: bluetooth.bind('enabled').as(on =>
        `bluetooth-${on ? 'active' : 'disabled'}-symbolic`),
    size: 24,
})
// Bluetooth:1 ends here

// ** Network
const network = await Service.import('network');
const WifiIndicator = () => Widget.Box({
    vertical: true,
    tooltip_text: network.wifi.bind('ssid').as(ssid => ssid || 'Unknown'),
    children: [
        Widget.Icon({
            icon: network.wifi.bind('icon_name'),
            size: 24,
        }),
    ],
});
const WiredIndicator = () => Widget.Icon({
    icon: network.wired.bind('icon_name'),
});
const NetworkIndicator = () => Widget.Stack({
    items: [
        ['wifi', WifiIndicator()],
        ['wired', WiredIndicator()],
    ],
    shown: network.bind('primary').as(p => p || 'wifi'),
});
// Network:1 ends here

// ** Audio
export const audio = await Service.import('audio');
globalThis.audio = audio;
const audioProgress = (type) => Widget.CircularProgress({
    class_name: 'circular-progress',
    visible: true,
    value: audio[type].bind('volume'),
    tooltip_text: audio[type].bind('volume').as(v => `Volume ${(100 * v).toFixed(0)}%`),
    child: Widget.Label({
        class_name: 'nerd-icons',
        label: "",
    }),
});
const audioControl = (type = 'speaker') => Widget.EventBox({
    on_scroll_up: () => audio[type].volume += 0.01,
    on_scroll_down: () => audio[type].volume -= 0.01,
    child: audioProgress(type),
});
// Audio:1 ends here

// ** Brightness
const brightnessIcon = () => Widget.Label({
    class_name: 'nerd-icons',
    label: "",
});
const brightnessProgress = () => Widget.CircularProgress({
    class_name: 'circular-progress',
    visible: true,
    value: brightness.bind('screen-value'),
    child: brightnessIcon(),
});
const brightnessControl = () => Widget.EventBox({
    on_scroll_up: () => brightness['screen-value'] += 0.01,
    on_scroll_down: () => brightness['screen-value'] -= 0.01,
    child: brightnessProgress(),
})
// Brightness:1 ends here

// ** Battery
const batteryIcon = () => Widget.Label({
    class_name: 'nerd-icons',
    label: "󱐌",
});
const battery = await Service.import('battery');
const batteryProgress = () => Widget.CircularProgress({
    class_name: 'circular-progress',
    visible: battery.bind('available'),
    value: battery.bind('percent').as(p => p > 0 ? p / 100 : 0),
    child: batteryIcon(),
});

// ** SystemInfo
const SystemInfo = () => Widget.Box({
    class_name: 'system-info',
    vertical: true,
    spacing: 10,
    children: [
        BluetoothIndicator(),
        NetworkIndicator(),
        Widget.Separator({ orientation: 1 }),
        audioControl(),
        brightnessControl(),
        batteryProgress(),
    ],
});
// * Audio Visualizer
const cava = new Cava(2, '8bit');
const AudioVisualizer = (id) => Widget.ProgressBar({
    class_name: 'audio-visualizer',
    vertical: true,
    expand: true,
    hpack: 'center',
    // value: cava.bind('bar-value').as(c => c[id]),
    setup: self => self.set_inverted(true),
    css: 'min-width: 55px',
});

// * Windows
// ** Left bar
const barL = () => Widget.Window({
    name: 'bar-left',
    class_name: 'bg left',
    anchor: ['left', 'top', 'bottom'],
    exclusivity: 'exclusive',
    monitor: 0,
    child: Widget.Box({
        class_name: 'bar left',
        vertical: true,
        child: Widget.Overlay({
            child: Widget.Box({expand: true}),
            overlays: [
                AudioVisualizer(0),
                Widget.CenterBox({
                    vertical: true,
                    start_widget: Widget.Box({
                        vertical: true,
                        children: [
                            SysTray(),
                            Widget.Separator({orientation:1}),
                            TogglefocusOnHover(),
                        ],
                    }),
                    center_widget: normalTaskbar,
                    end_widget: Widget.Box({
                        vpack: "end",
                        vertical: true,
                        children: [
                            Widget.Separator({orientation:1}),
                            specialTaskbar,
                        ]
                    }),
                }),
            ],
        }),
    }),
});

// ** Right bar
const barR = () => Widget.Window({
    name: 'bar-right',
    class_name: 'bg right',
    anchor: ['right', 'top', 'bottom'],
    exclusivity: 'exclusive',
    monitor: 0,
    child: Widget.Box({
        class_name: 'bar right',
        child: Widget.Overlay({
            child: Widget.Box({expand: true}),
            overlays: [
                AudioVisualizer(1),
                Widget.CenterBox({
                    vertical: true,
                    start_widget: FancyClock(),
                    center_widget: hello,
                    end_widget: Widget.Box({
                        vpack: "end",
                        vertical: true,
                        children: [
                            hello,
                            SystemInfo(),
                        ]
                    })
                }),
            ],
        })
    })
});

// ** Top & Bottom bar
const barB = () => Widget.Window({
    name: 'bar-bottom',
    class_name: 'bg bottom',
    exclusivity: 'exclusive',
    anchor: ['bottom', 'left', 'right'],
    layer: 'top',
    child: Widget.Box({css:'min-height: 20px;'}),
});
const barT = () => Widget.Window({
    name: 'bar-top',
    class_name: 'bg top',
    exclusivity: 'exclusive',
    anchor: ['top', 'left', 'right'],
    layer: 'top',
    child: Widget.Box({css:'min-height: 20px;'}),
});
// Top Bottom Bar:1 ends here

// * Export
const scss = `${App.configDir}/style.scss`
const css = `/tmp/ags/style.css`
Utils.exec(`sassc ${scss} ${css}`)
Utils.monitorFile(
    `${App.configDir}`,
    function() {
        // compile, reset, apply
        try {
            Utils.exec(`sassc ${scss} ${css}`)
        } catch (error) {
            console.error(error)
        }
        App.resetCss()
        App.applyCss(css)
    },
)
const setup = Variable(
    App.applyCss(css)
)

const windows = [
    barL(),
    barR(),
    barB(),
    barT(),

];
export default {
    windows: windows,
};
globalThis.windows = windows
// Export:1 ends here

// [[file:readme.org::*Import][Import:1]]
const { GLib } = imports.gi;
import { GetClassIcon } from './utils.js';
import brightness from './brightness.js';
const hello = () => Widget.Label(' ');
// Import:1 ends here

// [[file:readme.org::*Cava][Cava:1]]
const cava = Variable('', {
    listen: [['python3', App.configDir + '/cava.py'], out => JSON.parse(out)],
});
// Cava:1 ends here

// [[file:readme.org::*Service][Service:1]]
export const hyprland = await Service.import('hyprland');
const activeWs = hyprland.active.workspace;
const activeCli = hyprland.active.client;
const dispatch = cmd => hyprland.messageAsync(`dispatch ${cmd}`);

globalThis.hyprland = hyprland;
// Service:1 ends here

// [[file:readme.org::*Client button][Client button:1]]

// Client button:1 ends here

// [[file:readme.org::*Workspace box][Workspace box:1]]
const wsLabels = ["󰎤","󰎧","󰎪","󰎭","󰎱","󰎳","󰎶","󰎹","󰎼","󰎡"];
const WsBox = (id) => {
    const label = wsLabels[(id - 1) % 10];
    return Widget.Box({
        class_name: 'workspace',
        vertical: true,
        attribute: { id },
        children: [
            Widget.Label({
                visible: false,
                attribute: {address: 'label'},
                class_name: 'nerd-icons',
                label: label,
            }),
        ],
        setup: self => self
            .hook(activeWs, () => {
                self.toggleClassName('active', activeWs.id === id)
                self.toggleClassName('inactive', activeWs.id != id)
            })
    })
};
// Workspace box:1 ends here

// [[file:readme.org::*Normal Taskbar][Normal Taskbar:1]]
// manages workspaces in [start, start + length - 1]
const NormalTaskbar = (start, length) => {
    const CliButton = (address: string) => {
        const cli = hyprland.getClient(address);
        return Widget.Box({
            class_name: 'client',
            hpack: 'center',
            attribute: {address},
            child: Widget.Button ({
                on_clicked: () =>
                    hyprland.messageAsync(`dispatch focuswindow address:${address}`),
                child: Widget.Icon({
                    icon: GetClassIcon(cli.class),
                    size: 32,
                }),
                tooltip_text: cli.title,
            }),
            setup: self => self.hook(activeCli, () => {
                self.toggleClassName('active', activeCli.address === cli.address)
                self.toggleClassName('inactive', activeCli.address != cli.address)
            }),
        })
    };
    const AddCliBtn = (self, address?: string) => {
        const id = hyprland.getClient(address).workspace.id;
        const child = self.children.find(w => w.attribute.id === id);
        if (child) {
            child.children = [...child.children, CliButton(address)];
            print('client-added', address, id)
        } else {
            print('client-add-failed', address, id)
        }
    };
    const RemoveCliBtn = (self, address?: string) => {
        const id = hyprland.getClient(address).workspace.id;
        const child = self.children.find(w => w.attribute.id === id);
        if (child) {
            child.children = child.children
                .filter(cli => cli.attribute.address !== address)
            print('client-removed', address, id)
        } else {
            print('client-removed-failed', address, id)
        }
    };
    // Assume name === string(id) for normal workspaces.
    const AddWsBox = (self, name?: string) => {
        print('workspace-add', name);
        const id = Number(name); // if name == 'special:xx', Number(name) == NaN.
        if (!id || id < start || id >= start + length) return;
        const ws = WsBox(id);
        var i = self.children.findIndex(ws => ws.attribute.id > id);
        i = i === -1? self.children.length : i;
        self.children = self.children.toSpliced(i, 0, ws);
        print('workspace-added', name, i);
    };
    const RemoveWsBox = (self, name?: string) => {
        print('workspace-remove', name);
        const id = Number(name);
        if (!id || id < start || id >= start + length) return;
        self.children = self.children.filter(ws => ws.attribute.id !== id);
        print('workspace-removed', name);
    };
    return Widget.Box({
        class_name: "normal taskbar",
        vertical: true,
        children: [],
        setup: self => {
            hyprland.workspaces.map(ws => AddWsBox(self, ws.name))
            hyprland.clients.map(cli => AddCliBtn(self, cli.address));
            self.hook(hyprland, AddWsBox, 'workspace-added')
                .hook(hyprland, RemoveWsBox, 'workspace-removed')
                .hook(hyprland, AddCliBtn, 'client-added')
                .hook(hyprland, RemoveCliBtn, 'client-removed');
        }
    })
}
// Normal Taskbar:1 ends here

// [[file:readme.org::*Special Taskbar][Special Taskbar:1]]
const SpecialTaskbar = () => {
    const CliButton = (address: string, id) => {
        const cli = hyprland.getClient(address);
        return Widget.Box({
            class_name: 'client',
            hpack: 'center',
            attribute: {address},
            child: Widget.Button ({
                on_clicked: () =>
                    hyprland.messageAsync(`dispatch togglespecialworkspace ${id}`),
                child: Widget.Icon({
                    icon: GetClassIcon(cli.class),
                    size: 32,
                }),
                tooltip_text: cli.title,
            }),
            setup: self => self.hook(activeCli, () => {
                self.toggleClassName('active', activeCli.address === cli.address)
                self.toggleClassName('inactive', activeCli.address != cli.address)
            }),
        })
    };
    const AddCliBtn = (self, address?: string) => {
        const cli = hyprland.getClient(address);
        const wsName = cli.workspace.name;
        const match = /:\d+/.exec(wsName);
        const specialId = match ? match[0].slice(1) : null;
        const className = cli.class;
        if (specialId && className) {
            self.children = [...self.children, CliButton(address, specialId)];
            print('client-added', address, 'special', specialId)
        } else {
            print('client-add-failed', address, 'special:null')
        }
    };
    const RemoveCliBtn = (self, address?: string) => {
        const id = hyprland.getClient(address).workspace.id;
        if (id < 0) {
            self.children =
                self.children.filter(cli => cli.attribute.address !== address)
            print('client-removed', address, id)
        } else {
            print('client-removed-failed', address, id)
        }
    };
    return Widget.Box({
        class_name: "special taskbar",
        vertical: true,
        children: [],
        setup: self => {
            hyprland.clients.map(cli => AddCliBtn(self, cli.address));
            self.hook(hyprland, AddCliBtn, 'client-added')
                .hook(hyprland, RemoveCliBtn, 'client-removed');
        }
    })
}
// Special Taskbar:1 ends here

// [[file:readme.org::*Time][Time:1]]
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

// [[file:readme.org::*System Tray][System Tray:1]]
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

// [[file:readme.org::*Bluetooth][Bluetooth:1]]
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

// [[file:readme.org::*Network][Network:1]]
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

// [[file:readme.org::*Audio][Audio:1]]
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

// [[file:readme.org::*Brightness][Brightness:1]]
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

// [[file:readme.org::*Battery][Battery:1]]
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
// Battery:1 ends here

// [[file:readme.org::*System info][System info:1]]
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
// System info:1 ends here

// [[file:readme.org::*Audio Visualizer][Audio Visualizer:1]]
const AudioVisualizer = (id) => Widget.ProgressBar({
    class_name: 'audio-visualizer',
    vertical: true,
    expand: true,
    value: cava.bind().as(c => c[id]),
    setup: self => self.set_inverted(true),
});
// Audio Visualizer:1 ends here

// [[file:readme.org::*Left Bar][Left Bar:1]]
const barL = () => Widget.Window({
    name: 'bar-left',
    class_name: 'bg left',
    anchor: ['left', 'top', 'bottom'],
    exclusivity: 'exclusive',
    monitor: 0,
    child: Widget.Box({
        class_name: 'bar left',
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
                        ],
                    }),
                    center_widget: NormalTaskbar(1, 10),
                    end_widget: Widget.Box({
                        vpack: "end",
                        vertical: true,
                        children: [
                            Widget.Separator({orientation:1}),
                            SpecialTaskbar(),
                        ]
                    })
                }),
            ],
        }),
    }),
});
// Left Bar:1 ends here

// [[file:readme.org::*Right Bar][Right Bar:1]]
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
                    center_widget: hello(),
                    end_widget: Widget.Box({
                        vpack: "end",
                        vertical: true,
                        children: [
                            SystemInfo(),
                        ]
                    })
                }),
            ],
        })
    })
});
// Right Bar:1 ends here

// [[file:readme.org::*Top Bottom Bar][Top Bottom Bar:1]]
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

// [[file:readme.org::*Export][Export:1]]
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

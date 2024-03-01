export const cava = Variable('', {
    listen: [['python3', App.configDir + '/cava.py'], out => JSON.parse(out)],
})
globalThis.cava = cava;

const Hello = () => Widge.Label('hello');

const barL = () => Widget.Window({
    name: 'bar-left',
    class_name: 'bg left',
    anchor: ['left', 'top', 'bottom'],
    exclusivity: 'ignore',
    monitor: 0,
    child: Widget.ProgressBar({
        vertical: true,
        value: cava.bind().as(c => c[0]),
        setup: self => self.set_inverted(true),
        css: 'min-width: 50px',
    }),
});

const barR = () => Widget.Window({
    name: 'bar-right',
    class_name: 'bg right',
    anchor: ['right', 'top', 'bottom'],
    exclusivity: 'ignore',
    layer: 'bottom',
    monitor: 0,
    child: Widget.ProgressBar({
        vertical: true,
        value: cava.bind().as(c => c[1]),
        setup: self => self.set_inverted(true),
        css: 'min-width: 50px',
    }),
});

const setup = Variable(
    App.applyCss(css)
)

export default {
    windows: [
        barL(),
        barR(),
    ],
};

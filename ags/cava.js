import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

const confPath = `/tmp/ags/cava.conf`;
async function readCavaAsync(barNumber, bitFormat, callback, onError) {
    try {
        const conf =
`[general]
framerate = 30
bars = ${barNumber}
[output]
method = raw
bit_format = ${bitFormat}`;

        Utils.writeFileSync(conf, confPath);

        const cava = Gio.Subprocess.new(
            [`cava`, `-p`, confPath],
            Gio.SubprocessFlags.STDOUT_PIPE |
            Gio.SubprocessFlags.STDERR_PIPE,
        );

        const pipe = cava.get_stdout_pipe();
        if (!pipe) {
            onError(Error(`cava stdout pipe is null`));
            return null;
        }

        const read8bit = (stream) => {
            stream.read_bytes_async(barNumber, GLib.PRIORITY_LOW, null, (stream, res) => {
                try {
                    let data = stream.read_bytes_finish(res).get_data();
                    const output = new Float64Array(data).map(d => d / 255);
                    callback(output);
                    read8bit(stream);
                } catch (e) {
                    onError(e);
                }
            });
        };
        const read16bit = (stream) => {
            stream.read_bytes_async(barNumber * 2, GLib.PRIORITY_LOW, null, (stream, res) => {
                try {
                    const data = stream.read_bytes_finish(res).get_data();
                    const output = new Float64Array(new Uint16Array(data.buffer)).map(d => d / 65535);
                    callback(output);
                    read16bit(stream);
                } catch (e) {
                    onError(e);
                }
            });
        };

        if (bitFormat === '8bit') {
            read8bit(pipe);
        } else if (bitFormat === '16bit'){
            read16bit(pipe);
        }

    } catch (e) {
        logError(e);
        return null;
    }
}

export class Cava extends Service {
    static {
        Service.register(this, {}, {
            'bar-value': ['float[]', 'r'],
        });
    }

    #barValues = [];
    get bar_value() {
        return this.#barValues;
    }

    constructor(barNumber, bitFormat) {
        super();
        readCavaAsync(
            barNumber, bitFormat, (barValues) => {
                this.#barValues = barValues;
                this.#onChange();
            }
        )
    }

    #onChange() {
        this.emit('changed');
        this.notify('bar-value');
    }
}

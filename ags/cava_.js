const BARS_NUMBER =  2;
const OUTPUT_BIT_FORMAT = "16bit";
const RAW_TARGET = "/dev/stdout";
// Use "/dev/stdout" for Node.js, as it doesn't support "/dev/stdout" directly

const conpat = `
[general]
bars = ${BARS_NUMBER}
[output]
method = raw
raw_target = ${RAW_TARGET}
bit_format = ${OUTPUT_BIT_FORMAT}
`;

const config = conpat;
const bytetype = OUTPUT_BIT_FORMAT === "16bit" ? "H" : "B";
const bytesize = OUTPUT_BIT_FORMAT === "16bit" ?  2 :  1;
const bytenorm = OUTPUT_BIT_FORMAT === "16bit" ?  65535 :  255;

function run() {
    const configPath = path.join(os.tmpdir(), 'cava_config.txt');
    fs.writeFileSync(configPath, config);

    const process = cp.spawn('cava', ['-p', configPath]);

    const chunk = bytesize * BARS_NUMBER;
    const fmt = bytetype.repeat(BARS_NUMBER);

    let source;
    if (RAW_TARGET !== "/dev/stdout") {
        if (!fs.existsSync(RAW_TARGET)) {
            // Node.js does not support creating FIFOs directly, so you might need to create it manually or use a workaround
            console.error('FIFO not supported in Node.js. Please create it manually.');
            process.kill();
            return;
        }
        source = fs.createReadStream(RAW_TARGET);
    } else {
        source = process.stdout;
    }

    source.on('data', (data) => {
        if (data.length < chunk) {
            process.kill();
            return;
        }
        // Assuming you want to normalize the data, similar to the Python script
        const sample = [];
        for (let i =  0; i < data.length; i += bytesize) {
            let value =  0;
            if (bytesize ===  2) {
                value = data.readUInt16BE(i);
            } else {
                value = data[i];
            }
            sample.push(value / bytenorm);
        }
        console.log(sample);
    });

    source.on('end', () => {
        console.log('End of data');
    });

    process.on('close', (code) => {
        console.log(`Cava process exited with code ${code}`);
    });
}

run();

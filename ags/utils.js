import Gio from 'gi://Gio';
import GLib from 'gi://GLib'

const xdgDataDirs = GLib.getenv("XDG_DATA_DIRS").split(':');
const applicationsDirs = xdgDataDirs.map(dir => dir + '/applications');

function readdir(directoryPath) {
    try {
        let directory = Gio.File.new_for_path(directoryPath);
        let enumerator = directory.enumerate_children('standard::name',  0, null);
        let filenames = [];

        let fileInfo;
        while ((fileInfo = enumerator.next_file(null))) {
            filenames.push(fileInfo.get_name());
        }
        return filenames;
    } catch (_) {
        return [];
    }
}


function parseINI(data) {
    var regex = {
        section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
        param: /^\s*([^=]+?)\s*=\s*(.*?)\s*$/,
        comment: /^\s*;.*$/
    };
    var value = {};
    var lines = data.split(/[\r\n]+/);
    var section = null;
    lines.forEach(function(line) {
        if (regex.comment.test(line)) {
            return;
        } else if (regex.param.test(line)) {
            var match = line.match(regex.param);
            if (section) {
                value[section][match[1]] = match[2];
            } else {
                value[match[1]] = match[2];
            }
        } else if (regex.section.test(line)) {
            var match = line.match(regex.section);
            value[match[1]] = {};
            section = match[1];
        } else if (line.length ==  0 && section) {
            section = null;
        };
    });
    return value;
}


// ClassToIcon is constructed based on the fact that
// most windows' class is the same as its .desktop file's name.
const classToIcon = new Map();
applicationsDirs.forEach(dir => {
    const files = readdir(dir);
    const desktopFiles = files.filter(file => file.endsWith('.desktop'));
    // console.log(`Desktop files in ${dir}:`, desktopFiles);
    desktopFiles.map((fname) => {
        const fileContent = Utils.readFile(dir + '/' + fname);
        const parsedIni = parseINI(fileContent);
        if (parsedIni && parsedIni['Desktop Entry'] && parsedIni['Desktop Entry']['Icon']) {
            const className = fname.split('.').slice(0, -1).join('.');
            const icon = parsedIni['Desktop Entry']['Icon'];
            classToIcon.set(className, icon);
        }
    })

});
classToIcon.set('QQ', classToIcon.get('qq'));
classToIcon.set('lollypop', classToIcon.get('org.gnome.Lollypop'));


export const GetClassIcon = (name) => {
    if (GLib.file_test(name, GLib.FileTest.EXISTS))
        return name
    return classToIcon.get(name) || 'application-x-executable-symbolic';
}

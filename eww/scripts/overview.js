const scale = 0.095;
const { execSync } = require('child_process');
const fs = require('fs');

let monitors = JSON.parse(execSync('hyprctl monitors -j'));

let windows = [];
for (let i = 0; i < monitors.length; i++) {
  windows.push([]);
  for (let j = 0; j <= 10; j++) {
    windows[i].push([]);
  }
}
let clients = JSON.parse(execSync('hyprctl clients -j'));

for (client of clients) {
  let mon = client.monitor;
  let id = client.workspace.id - mon * 10;
  if (id < 1 || id > 10) { continue; }
  let mx = monitors[mon].x;
  let my = monitors[mon].y;
  // let mw = monitors[mon].width;
  let mh = ( monitors[mon].transform ? monitors[mon].width : monitors[mon].height ) * 0.96;

  let l = client.at[0] - mx + 2; 
  let u = client.at[1] - my + 2;
  let r = l + client.size[0] - 2;
  let d = mh - u - client.size[1] -2;
  u = Math.round(u * scale);
  r = - Math.round(r * scale);
  d = Math.round(d * scale);
  l = Math.round(l * scale);

  let client_info = {};
  client_info.class = client.class;
  client_info.margin = u.toString()+' '+r.toString()+' '+d.toString()+' '+l.toString();

  windows[mon][id].push(client_info);
}
// console.log(JSON.stringify(windows));
execSync("eww update windows=\'" + JSON.stringify(windows) + "\'");


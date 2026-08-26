import fs from 'fs';

let meta = fs.readFileSync('metadata.json', 'utf-8');
meta = meta.replace(/"name": "PWIS Command Center"/, '"name": "Dhan Drishti"');
fs.writeFileSync('metadata.json', meta);

let sidebar = fs.readFileSync('src/components/Sidebar.tsx', 'utf-8');
sidebar = sidebar.replace(/PWIS/, 'Dhan Drishti');
fs.writeFileSync('src/components/Sidebar.tsx', sidebar);

let login = fs.readFileSync('src/components/Login.tsx', 'utf-8');
login = login.replace(/PWIS/, 'Dhan Drishti');
fs.writeFileSync('src/components/Login.tsx', login);

let indexHtml = fs.readFileSync('index.html', 'utf-8');
indexHtml = indexHtml.replace(/<title>.*<\/title>/, '<title>Dhan Drishti</title>');
indexHtml = indexHtml.replace(/content="My Google AI Studio App"/, 'content="Dhan Drishti"');
fs.writeFileSync('index.html', indexHtml);

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1x1 pixel JPEG base64
const dummyJpgBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
const dummyJpgBuffer = Buffer.from(dummyJpgBase64, 'base64');

// Create 12 dummy images
for (let i = 1; i <= 12; i++) {
  fs.writeFileSync(path.join(publicDir, `dummy_img_${i}.jpg`), dummyJpgBuffer);
}
// Specific images used explicitly by name
fs.writeFileSync(path.join(publicDir, 'brayden-law-Io9wt6UKv28-unsplash.jpg'), dummyJpgBuffer);
fs.writeFileSync(path.join(publicDir, 'karsten-winegeart-jQcbjj-BrdA-unsplash.jpg'), dummyJpgBuffer);

// Helper to create a dummy file of a certain size (sparse file)
function createDummyFile(filename, size) {
  const filepath = path.join(publicDir, filename);
  const fd = fs.openSync(filepath, 'w');
  if (size > 0) {
    fs.writeSync(fd, Buffer.from([0]), 0, 1, size - 1);
  }
  fs.closeSync(fd);
  console.log(`Created ${filename} (${size} bytes)`);
}

createDummyFile('Recording 2026-03-04 235344.mp4', 5538125);
createDummyFile('222.mp4', 237322703);
createDummyFile('99mb.mp4', 103809024);
createDummyFile('heicon.mov', 16723758);
createDummyFile('rediskasound-bossa-jazz-instrumental-554529.mp3', 7120352);

console.log('Fixtures generated successfully.');

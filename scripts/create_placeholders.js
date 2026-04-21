const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..', 'frontend', 'src', 'assets');
if (!fs.existsSync(base)) fs.mkdirSync(base, { recursive: true });

const src = path.join(base, 'cross_icon.png');

['appointment_img.png', 'header_img.png', 'about_image.png', 'contact_image.png'].forEach(f => {
    try {
        fs.copyFileSync(src, path.join(base, f));
        console.log('copied', f);
    } catch (e) {
        console.log('failed to copy', f, e.message);
    }
});

// create simple green square svg for logo
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="#10B981"/></svg>`;
fs.writeFileSync(path.join(base, 'logo.svg'), svgContent);
console.log('created svg logo');

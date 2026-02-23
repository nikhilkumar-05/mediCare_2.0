const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '/Users/nikhil/Desktop/medicare2.0/backend/.env' });
const fs = require('fs');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function testCloudinary() {
    try {
        // Create a dummy pdf file
        const dummyPath = path.join(__dirname, 'dummy.pdf');
        fs.writeFileSync(dummyPath, '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >> >>\nendobj\n4 0 obj\n<< /Length 53 >>\nstream\nBT /F1 24 Tf 100 700 Td (Hello World) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000223 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n326\n%%EOF');

        const result = await cloudinary.uploader.upload(dummyPath, {
            folder: 'medicare-uploads-test',
            resource_type: 'auto'
        });

        console.log("Upload Success:", result.secure_url);
        fs.unlinkSync(dummyPath);
        process.exit(0);
    } catch (err) {
        console.error("Upload Error:", err);
        process.exit(1);
    }
}
testCloudinary();

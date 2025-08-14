const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const libre = require('libreoffice-convert');
libre.convertAsync = require('util').promisify(libre.convert);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Conversion endpoint
app.post('/convert', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const outputFormat = req.body.outputFormat || 'pdf';
        const quality = req.body.quality || 'medium';
        
        const inputPath = req.file.path;
        const outputFileName = `${req.file.filename}.${outputFormat}`;
        const outputPath = path.join(__dirname, 'converted', outputFileName);

        // Ensure converted directory exists
        if (!fs.existsSync(path.join(__dirname, 'converted'))) {
            fs.mkdirSync(path.join(__dirname, 'converted'));
        }

        // Read the uploaded file
        const file = fs.readFileSync(inputPath);
        
        // Convert the file (using LibreOffice for office docs)
        let output;
        if (['pdf', 'docx', 'doc', 'odt', 'rtf', 'txt'].includes(outputFormat)) {
            const extend = `.${outputFormat}`;
            output = await libre.convertAsync(file, extend, undefined);
        } else {
            // For other formats, we would use appropriate libraries
            // This is just a placeholder for the demo
            output = Buffer.from(`Converted ${req.file.originalname} to ${outputFormat}`);
        }

        // Write the converted file
        fs.writeFileSync(outputPath, output);

        // Clean up the uploaded file
        fs.unlinkSync(inputPath);

        // Send the converted file
        res.download(outputPath, outputFileName, (err) => {
            if (err) {
                console.error('Download error:', err);
            }
            // Clean up the converted file after sending
            fs.unlinkSync(outputPath);
        });
    } catch (err) {
        console.error('Conversion error:', err);
        res.status(500).json({ error: 'Conversion failed', details: err.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Document converter server running on port ${port}`);
});
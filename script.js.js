document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const fileInputBtn = document.getElementById('fileInputBtn');
    const fileListContainer = document.getElementById('fileListContainer');
    const outputFormat = document.getElementById('outputFormat');
    const quality = document.getElementById('quality');
    const convertBtn = document.getElementById('convertBtn');
    const progressModal = document.getElementById('progressModal');
    const downloadModal = document.getElementById('downloadModal');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const conversionDetails = document.getElementById('conversionDetails');
    const downloadList = document.getElementById('downloadList');
    const downloadAllBtn = document.getElementById('downloadAllBtn');

    // State
    let files = [];
    let convertedFiles = [];

    // Event Listeners
    fileInputBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and Drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropZone.classList.add('drag-over');
    }

    function unhighlight() {
        dropZone.classList.remove('drag-over');
    }

    dropZone.addEventListener('drop', handleDrop, false);

    convertBtn.addEventListener('click', convertFiles);

    downloadAllBtn.addEventListener('click', downloadAllFiles);

    // Functions
    function handleFileSelect(e) {
        const newFiles = Array.from(e.target.files);
        addFiles(newFiles);
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const newFiles = Array.from(dt.files);
        addFiles(newFiles);
    }

    function addFiles(newFiles) {
        files = [...files, ...newFiles];
        renderFileList();
        updateConvertButton();
    }

    function removeFile(index) {
        files.splice(index, 1);
        renderFileList();
        updateConvertButton();
    }

    function renderFileList() {
        if (files.length === 0) {
            fileListContainer.innerHTML = '<p class="empty-message">No files selected</p>';
            return;
        }

        fileListContainer.innerHTML = '';
        
        files.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            
            const fileIcon = document.createElement('i');
            fileIcon.className = 'file-icon ' + getFileIconClass(file.name);
            
            const fileNameSize = document.createElement('div');
            
            const fileName = document.createElement('div');
            fileName.className = 'file-name';
            fileName.textContent = file.name;
            
            const fileSize = document.createElement('div');
            fileSize.className = 'file-size';
            fileSize.textContent = formatFileSize(file.size);
            
            fileNameSize.appendChild(fileName);
            fileNameSize.appendChild(fileSize);
            fileInfo.appendChild(fileIcon);
            fileInfo.appendChild(fileNameSize);
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-file';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.addEventListener('click', () => removeFile(index));
            
            fileItem.appendChild(fileInfo);
            fileItem.appendChild(removeBtn);
            
            fileListContainer.appendChild(fileItem);
        });
    }

    function getFileIconClass(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        const iconMap = {
            pdf: 'fas fa-file-pdf',
            doc: 'fas fa-file-word',
            docx: 'fas fa-file-word',
            txt: 'fas fa-file-alt',
            rtf: 'fas fa-file-alt',
            odt: 'fas fa-file-alt',
            xls: 'fas fa-file-excel',
            xlsx: 'fas fa-file-excel',
            csv: 'fas fa-file-csv',
            ppt: 'fas fa-file-powerpoint',
            pptx: 'fas fa-file-powerpoint',
            jpg: 'fas fa-file-image',
            jpeg: 'fas fa-file-image',
            png: 'fas fa-file-image',
            gif: 'fas fa-file-image',
            bmp: 'fas fa-file-image',
            tiff: 'fas fa-file-image',
            webp: 'fas fa-file-image',
            zip: 'fas fa-file-archive',
            rar: 'fas fa-file-archive',
            '7z': 'fas fa-file-archive',
            html: 'fas fa-file-code',
            epub: 'fas fa-book',
            mobi: 'fas fa-book',
            default: 'fas fa-file'
        };
        
        return iconMap[extension] || iconMap.default;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function updateConvertButton() {
        convertBtn.disabled = files.length === 0;
    }

    async function convertFiles() {
        if (files.length === 0) return;
        
        // Show progress modal
        progressModal.style.display = 'flex';
        progressBar.style.width = '0%';
        progressText.textContent = '0%';
        conversionDetails.innerHTML = '';
        
        const targetFormat = outputFormat.value;
        const qualitySetting = quality.value;
        
        convertedFiles = [];
        
        // Simulate conversion process (in a real app, this would be API calls)
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const progress = Math.floor((i / files.length) * 100);
            
            progressBar.style.width = `${progress}%`;
            progressText.textContent = `${progress}%`;
            
            conversionDetails.innerHTML = `
                <p>Converting ${i + 1} of ${files.length}</p>
                <p>${file.name} → ${targetFormat.toUpperCase()}</p>
            `;
            
            // Simulate conversion delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In a real app, you would upload the file to a server for conversion
            // For demo purposes, we'll just create a dummy converted file
            const convertedFile = {
                originalName: file.name,
                convertedName: `${file.name.split('.')[0]}.${targetFormat}`,
                format: targetFormat,
                url: URL.createObjectURL(new Blob(['Converted file content'], { type: 'application/octet-stream' }))
            };
            
            convertedFiles.push(convertedFile);
        }
        
        // Complete progress
        progressBar.style.width = '100%';
        progressText.textContent = '100%';
        conversionDetails.innerHTML += '<p>Conversion complete!</p>';
        
        // Close progress modal after a delay
        setTimeout(() => {
            progressModal.style.display = 'none';
            showDownloadModal();
        }, 1000);
    }

    function showDownloadModal() {
        downloadList.innerHTML = '';
        
        convertedFiles.forEach(file => {
            const downloadItem = document.createElement('div');
            downloadItem.className = 'download-item';
            
            const fileName = document.createElement('div');
            fileName.textContent = file.convertedName;
            
            const downloadLink = document.createElement('a');
            downloadLink.className = 'download-link';
            downloadLink.href = file.url;
            downloadLink.download = file.convertedName;
            downloadLink.textContent = 'Download';
            
            downloadItem.appendChild(fileName);
            downloadItem.appendChild(downloadLink);
            downloadList.appendChild(downloadItem);
        });
        
        downloadModal.style.display = 'flex';
    }

    function downloadAllFiles() {
        convertedFiles.forEach(file => {
            const link = document.createElement('a');
            link.href = file.url;
            link.download = file.convertedName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === progressModal) {
            progressModal.style.display = 'none';
        }
        if (e.target === downloadModal) {
            downloadModal.style.display = 'none';
        }
    });
});
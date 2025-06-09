// Konfigurasi PDF.js
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    let pdfDocBangbel = null;
    let currentPageBangbel = 1;
    let scaleBangbel = 1;
    let canvasBangbel = null;
    let ctxBangbel = null;

    // Elemen DOM
    const pdfDisplayBangbel = document.getElementById('pdfDisplayBangbel');
    const prevBtnBangbel = document.getElementById('prevBtnBangbel');
    const nextBtnBangbel = document.getElementById('nextBtnBangbel');
    const pageInputBangbel = document.getElementById('pageInputBangbel');
    const totalPagesBangbel = document.getElementById('totalPagesBangbel');
    const zoomInBangbel = document.getElementById('zoomInBangbel');
    const zoomOutBangbel = document.getElementById('zoomOutBangbel');
    const zoomDisplayBangbel = document.getElementById('zoomDisplayBangbel');

    // Auto load PDF saat halaman dimuat
    document.addEventListener('DOMContentLoaded', () => {
        loadPDFBangbel();
    });

    // Event Listeners
    prevBtnBangbel.addEventListener('click', () => {
        if (currentPageBangbel > 1) {
            currentPageBangbel--;
            renderPageBangbel();
        }
    });

    nextBtnBangbel.addEventListener('click', () => {
        if (currentPageBangbel < pdfDocBangbel.numPages) {
            currentPageBangbel++;
            renderPageBangbel();
        }
    });

    pageInputBangbel.addEventListener('change', () => {
        const page = parseInt(pageInputBangbel.value);
        if (page >= 1 && page <= pdfDocBangbel.numPages) {
            currentPageBangbel = page;
            renderPageBangbel();
        } else {
            pageInputBangbel.value = currentPageBangbel;
        }
    });

    zoomInBangbel.addEventListener('click', () => {
        scaleBangbel = Math.min(scaleBangbel + 0.25, 4);
        updateZoomDisplayBangbel();
        renderPageBangbel();
    });

    zoomOutBangbel.addEventListener('click', () => {
        scaleBangbel = Math.max(scaleBangbel - 0.25, 0.25);
        updateZoomDisplayBangbel();
        renderPageBangbel();
    });

    function updateZoomDisplayBangbel() {
        zoomDisplayBangbel.textContent = `${Math.round(scaleBangbel * 100)}%`;
        
        // Update button states
        zoomOutBangbel.disabled = scaleBangbel <= 0.25;
        zoomInBangbel.disabled = scaleBangbel >= 4;
    }

    function loadPDFBangbel() {
        showLoadingBangbel();

        const loadingTask = pdfjsLib.getDocument({
            url: PDF_URL_BANGBEL,
            cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
            cMapPacked: true
        });
        
        loadingTask.promise.then((pdf) => {
            pdfDocBangbel = pdf;
            currentPageBangbel = 1;
            totalPagesBangbel.textContent = pdfDocBangbel.numPages;
            
            enableControlsBangbel();
            createCanvasBangbel();
            renderPageBangbel();
            
        }).catch((error) => {
            console.error('Error loading PDF:', error);
            showErrorBangbel('❌ Gagal memuat file PDF. Periksa koneksi internet atau coba lagi nanti.');
        });
    }

    function createCanvasBangbel() {
        canvasBangbel = document.createElement('canvas');
        canvasBangbel.className = 'pdf-canvas-bangbel';
        ctxBangbel = canvasBangbel.getContext('2d');
    }

    function renderPageBangbel() {
        if (!pdfDocBangbel || !canvasBangbel) return;

        // Clear previous content
        ctxBangbel.clearRect(0, 0, canvasBangbel.width, canvasBangbel.height);

        pdfDocBangbel.getPage(currentPageBangbel).then((page) => {
            const viewport = page.getViewport({ scale: scaleBangbel });
            
            // Set canvas dimensions
            canvasBangbel.height = viewport.height;
            canvasBangbel.width = viewport.width;

            // Render page
            const renderContext = {
                canvasContext: ctxBangbel,
                viewport: viewport
            };

            const renderTask = page.render(renderContext);
            renderTask.promise.then(() => {
                hideLoadingBangbel();
                updateControlsBangbel();
            }).catch((error) => {
                console.error('Error rendering page:', error);
                showErrorBangbel('❌ Gagal menampilkan halaman PDF.');
            });
        }).catch((error) => {
            console.error('Error getting page:', error);
            showErrorBangbel('❌ Gagal memuat halaman PDF.');
        });
    }

    function updateControlsBangbel() {
        pageInputBangbel.value = currentPageBangbel;
        prevBtnBangbel.disabled = currentPageBangbel <= 1;
        nextBtnBangbel.disabled = currentPageBangbel >= pdfDocBangbel.numPages;
        updateZoomDisplayBangbel();
    }

    function enableControlsBangbel() {
        pageInputBangbel.disabled = false;
        pageInputBangbel.max = pdfDocBangbel.numPages;
        zoomInBangbel.disabled = false;
        zoomOutBangbel.disabled = false;
        updateControlsBangbel();
    }

    function showLoadingBangbel() {
        if (!canvasBangbel || !canvasBangbel.parentNode) {
            pdfDisplayBangbel.innerHTML = `
                <div class="loading-container-bangbel">
                    <div class="loading-spinner-bangbel"></div>
                    <div class="loading-text-bangbel">Memuat E-book Inkubator1.pdf...</div>
                </div>
            `;
        }
    }

    function hideLoadingBangbel() {
        if (canvasBangbel && !canvasBangbel.parentNode) {
            pdfDisplayBangbel.innerHTML = '';
            pdfDisplayBangbel.appendChild(canvasBangbel);
        }
    }

    function showErrorBangbel(message) {
        pdfDisplayBangbel.innerHTML = `<div class="error-message-bangbel">${message}</div>`;
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (!pdfDocBangbel) return;
        if (document.activeElement.tagName === 'INPUT') return;

        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                if (currentPageBangbel > 1) {
                    currentPageBangbel--;
                    renderPageBangbel();
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (currentPageBangbel < pdfDocBangbel.numPages) {
                    currentPageBangbel++;
                    renderPageBangbel();
                }
                break;
            case '=':
            case '+':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    scaleBangbel = Math.min(scaleBangbel + 0.25, 4);
                    updateZoomDisplayBangbel();
                    renderPageBangbel();
                }
                break;
            case '-':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    scaleBangbel = Math.max(scaleBangbel - 0.25, 0.25);
                    updateZoomDisplayBangbel();
                    renderPageBangbel();
                }
                break;
        }
    });

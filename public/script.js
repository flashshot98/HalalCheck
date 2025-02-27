// Barcode Scanner Setup
let isScanning = false;
let scannedBarcode = "";

document.getElementById('start-scan').addEventListener('click', () => {
  if (!isScanning) {
    startBarcodeScan();
  } else {
    stopBarcodeScan();
  }
});

function startBarcodeScan() {
  isScanning = true;
  document.getElementById('start-scan').textContent = "Stop Scanning";
  Quagga.init({
    inputStream: {
      name: "Live",
      type: "LiveStream",
      target: document.querySelector("#barcode-video"),
      constraints: {
        facingMode: "environment", // Use the rear camera
      },
    },
    decoder: {
      readers: ["ean_reader"], // Supports EAN barcodes (common for food products)
    },
  }, (err) => {
    if (err) {
      console.error("Error initializing Quagga:", err);
      return;
    }
    Quagga.start();
  });

  Quagga.onDetected((data) => {
    scannedBarcode = data.codeResult.code;
    document.getElementById('scanned-barcode').value = scannedBarcode;
    stopBarcodeScan();
  });
}

function stopBarcodeScan() {
  isScanning = false;
  document.getElementById('start-scan').textContent = "Start Barcode Scan";
  Quagga.stop();
}

// Drag & Drop and Image Upload
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('imageUpload');

// Handle file selection
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    handleFile(file);
  }
});

// Handle drag & drop
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) {
    handleFile(file);
  }
});

function handleFile(file) {
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Display the image (optional)
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.maxWidth = '100%';
      dropZone.innerHTML = '';
      dropZone.appendChild(img);
    };
    reader.readAsDataURL(file);
  } else {
    alert('Please upload an image file.');
  }
}

// Check Halal Status for Barcode, Image, or Question
document.getElementById('checkButton').addEventListener('click', async () => {
  const barcodeInput = document.getElementById('scanned-barcode');
  const fileInput = document.getElementById('imageUpload');
  const questionBox = document.getElementById('questionBox');
  const resultDiv = document.getElementById('result');

  const barcode = barcodeInput.value;
  const file = fileInput.files[0];
  const question = questionBox.value;

  if (!barcode && !file && !question) {
    resultDiv.textContent = "Please scan a barcode, upload an image, or ask a question.";
    return;
  }

  // Call the backend API
  resultDiv.textContent = "Checking...";
  const formData = new FormData();
  if (file) formData.append('image', file);
  if (barcode) formData.append('barcode', barcode);
  if (question) formData.append('question', question);

  const response = await fetch('/.netlify/functions/check-halal', {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  resultDiv.textContent = data.result;
});

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('imageUpload');
const checkButton = document.getElementById('checkButton');
const resultDiv = document.getElementById('result');

// Handle file selection
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handleFile(file);
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
  if (file) handleFile(file);
});

// Display the uploaded image
function handleFile(file) {
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
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

// Check Halal Status
checkButton.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) {
    resultDiv.textContent = "Please upload an image first.";
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    resultDiv.textContent = "Checking...";
    const response = await fetch('/.netlify/functions/check-halal', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    resultDiv.textContent = data.result;
  } catch (error) {
    resultDiv.textContent = "Error checking status.";
  }
});

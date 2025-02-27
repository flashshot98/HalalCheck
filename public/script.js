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

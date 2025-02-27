exports.handler = async (event, context) => {
  console.log("Received request:", event.body); // Log the request body

  const formData = new URLSearchParams(event.body);
  const barcode = formData.get('barcode');
  const image = formData.get('image');
  const question = formData.get('question');

  console.log("Barcode:", barcode); // Log the barcode
  console.log("Image:", image); // Log the image
  console.log("Question:", question); // Log the question

  if (barcode) {
    // Simulate checking a barcode database
    const halalBarcodes = ["1234567890123", "9876543210987"]; // Example halal barcodes
    if (halalBarcodes.includes(barcode)) {
      return {
        statusCode: 200,
        body: JSON.stringify({ result: "100% Halal: This product is halal." }),
      };
    } else {
      return {
        statusCode: 200,
        body: JSON.stringify({ result: "Not Halal: This product is not certified halal." }),
      };
    }
  }

  if (image) {
    // Simulate image processing (e.g., OCR or halal sign detection)
    return {
      statusCode: 200,
      body: JSON.stringify({ result: "Image uploaded. Halal status: Maybe Halal (simulated)." }),
    };
  }

  if (question) {
    // Simulate AI or web search for ingredient checking
    return {
      statusCode: 200,
      body: JSON.stringify({ result: `AI Response: "${question}" is being checked. Halal status: Maybe Halal (simulated).` }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ result: "No barcode, image, or question provided." }),
  };
};

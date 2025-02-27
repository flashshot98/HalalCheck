const multipart = require('lambda-multipart-parser');

exports.handler = async (event) => {
  try {
    // Parse the multipart/form-data request
    const result = await multipart.parse(event);
    const { image } = result;

    if (!image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No image provided." }),
      };
    }

    // Simulate image processing
    return {
      statusCode: 200,
      body: JSON.stringify({ result: "Image uploaded. Halal status: Maybe Halal (simulated)." }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error." }),
    };
  }
};

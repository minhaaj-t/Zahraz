const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();

async function uploadToImgBB(imagePath) {
  try {
    const formData = new FormData();
    formData.append('key', process.env.IMGBB_API_KEY);
    formData.append('image', fs.createReadStream(imagePath));

    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: formData.getHeaders()
    });

    if (response.data.success) {
      return response.data.data.url;
    } else {
      throw new Error('Image upload failed');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

async function uploadBase64ToImgBB(base64Image) {
  try {
    // Validate API key
    if (!process.env.IMGBB_API_KEY) {
      throw new Error('IMGBB_API_KEY is not set in environment variables');
    }

    // Remove data:image/png;base64, prefix if present
    const base64Data = base64Image.includes(',') 
      ? base64Image.split(',')[1] 
      : base64Image;

    // ImgBB API expects URL-encoded form data, not multipart/form-data
    const params = new URLSearchParams();
    params.append('key', process.env.IMGBB_API_KEY);
    params.append('image', base64Data);

    const response = await axios.post('https://api.imgbb.com/1/upload', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      timeout: 30000, // 30 seconds timeout
    });

    if (response.data && response.data.success) {
      return response.data.data.url;
    } else {
      const errorMsg = response.data?.error?.message || response.data?.error || 'Image upload failed';
      console.error('ImgBB API error:', response.data);
      throw new Error(`ImgBB upload failed: ${errorMsg}`);
    }
  } catch (error) {
    console.error('Error uploading image to ImgBB:', error.response?.data || error.message);
    if (error.response) {
      // Axios error with response
      const errorMsg = error.response.data?.error?.message || error.response.data?.error || error.message;
      throw new Error(`ImgBB API error: ${errorMsg}`);
    } else if (error.request) {
      // Request made but no response
      throw new Error('ImgBB API request timeout - no response received');
    } else {
      // Error setting up request
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  }
}

module.exports = { uploadToImgBB, uploadBase64ToImgBB };


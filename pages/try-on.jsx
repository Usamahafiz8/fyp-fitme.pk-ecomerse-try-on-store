import React, { useState } from "react";
import axios from "axios";

const RAPID_API_KEY = "4361ac8516msh649f4c5ee2a5730p16477djsn7d46e673eb59";

const TryOnComponent = () => {
  const [avatarFile, setAvatarFile] = useState(null);
  const [clothingFile, setClothingFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [clothingPreview, setClothingPreview] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (setter, previewSetter) => (event) => {
    const file = event.target.files[0];
    if (file) {
      setter(file);
      previewSetter(URL.createObjectURL(file));
    }
  };

  const handleTryOn = async () => {
    if (!avatarFile || !clothingFile) {
      setError("Please select both an avatar image and a clothing image.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Use actual publicly accessible image URLs
      const avatarUrl =
        "https://raw.githubusercontent.com/john-eighteenth/clothes-tryon-js/main/resources/look.jpg";
      const clothingUrl =
        "https://raw.githubusercontent.com/john-eighteenth/clothes-tryon-js/786d5d3c6a4ac0a9eb7f0d6b658c9e162e82ae50/resources/avatar.jpg";

      // Call the virtualTryOn function
      const resultImageUrl = await virtualTryOn(avatarUrl, clothingUrl);
      setResultImage(resultImageUrl);
    } catch (error) {
      console.error(
        "Error during try-on process:",
        error.response?.data || error.message
      );
      setError("An error occurred while processing the images.");
    } finally {
      setLoading(false);
    }
  };

  const virtualTryOn = async (avatarUrl, clothingUrl) => {
    const encodedParams = new URLSearchParams();
    encodedParams.set("clothing_image_url", clothingUrl);
    encodedParams.set("avatar_image_url", avatarUrl);

    const options = {
      method: "POST",
      url: "https://texel-virtual-try-on.p.rapidapi.com/try-on-url",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": "texel-virtual-try-on.p.rapidapi.com",
      },
      data: encodedParams.toString(), // Ensure params are stringified
      responseType: "arraybuffer",
    };

    try {
      const response = await axios.request(options);
      const blob = new Blob([response.data], { type: "image/jpeg" });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error(
        "API request error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  return (
    <div className="flex items-center p-4">
      <div className="flex flex-col p-4">
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Select Clothing Image</h2>
          <input type="file" onChange={handleFileChange(setClothingFile, setClothingPreview)} />
          {clothingPreview && <img src={clothingPreview} alt="Clothing Preview" className="mt-2 max-w-xs w-40" />}
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Select Your Picture</h2>
          <input type="file" onChange={handleFileChange(setAvatarFile, setAvatarPreview)} />
          {avatarPreview && <img src={avatarPreview} alt="Avatar Preview" className="mt-2 max-w-xs w-40" />}
        </div>

        <button
          onClick={handleTryOn}
          className="mt-2 p-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Processing..." : "Upload and Try On"}
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      <div className="w-full mt-4">
        {resultImage && (
          <div className="border p-4">
            <h2 className="text-xl font-semibold mb-2">Results</h2>
            <img
              src={resultImage}
              alt="Try-On Result"
              className="w-96 h-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TryOnComponent;

import axios from "axios";

const RAPID_API_KEY = "e9054c3128msh7198986b4b717e1p1c156cjsn376f38e560ed";

export const virtualTryOn = async () => {

// public URI for resources/look.jpg
const LOOK_URI =
  "https://raw.githubusercontent.com/john-eighteenth/clothes-tryon-js/main/resources/look.jpg";

// public URL for resources/avatar.jpg
 const AVATAR_URI =
  "https://raw.githubusercontent.com/john-eighteenth/clothes-tryon-js/786d5d3c6a4ac0a9eb7f0d6b658c9e162e82ae50/resources/avatar.jpg";
  const encodedParams = new URLSearchParams();
  encodedParams.set("clothing_image_url", LOOK_URI);
  encodedParams.set("avatar_image_url", AVATAR_URI);

  const options = {
    method: "POST",
    url: "https://texel-virtual-try-on.p.rapidapi.com/try-on-url",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "X-RapidAPI-Key": RAPID_API_KEY,
      "X-RapidAPI-Host": "texel-virtual-try-on.p.rapidapi.com",
    },
    data: encodedParams,
    responseType: "arraybuffer", // Remove 'as ResponseType'
  };

  try {
    const response = await axios.request(options);
    const blob = new Blob([response.data], { type: "image/jpeg" });
    return URL.createObjectURL(blob);
  } catch (error) {
    throw error;
  }
};

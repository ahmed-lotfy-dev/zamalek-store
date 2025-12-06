"use server";

export async function translateText(
  text: string,
  from: string = "ar",
  to: string = "en"
) {
  if (!text) return "";

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=${from}|${to}`
    );

    const data = await response.json();

    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    } else {
      console.error("Translation API error:", data.responseDetails);
      return "";
    }
  } catch (error) {
    console.error("Translation request failed:", error);
    return "";
  }
}

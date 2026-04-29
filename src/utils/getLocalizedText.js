// src/utils/getLocalizedText.js

export const getLocalizedText = (value, lang = "en") => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value[lang] || value.en || Object.values(value)[0];
  }
  return String(value);
};

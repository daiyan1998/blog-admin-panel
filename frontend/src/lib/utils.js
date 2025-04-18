import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const isUserAuthenticated = () => {
  return localStorage.getItem("user") !== null;
};

export const extractImageUrls = (htmlContent) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const images = doc.querySelectorAll("img");
  return Array.from(images).map((img) => img.src);
};

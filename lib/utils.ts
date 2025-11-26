import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}

// ! this is for image upload
export function convertToBase64(file: File): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result as string);
    };
    fileReader.onerror = (error: ProgressEvent<FileReader>) => {
      reject(error);
    };
  });
}

// ! this is for pdf upload
export async function convertPDFToBase64(file: File): Promise<{
  fileName: string;
  contentType: string;
  data: string;
}> {
  return new Promise((resolve, reject) => {
    if (!file.type.includes("pdf")) {
      reject(new Error("File must be a PDF"));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(",")[1]; // Remove data URL prefix

      resolve({
        fileName: file.name,
        contentType: file.type,
        data: base64Data,
      });
    };

    reader.onerror = (error) => reject(error);
  });
}

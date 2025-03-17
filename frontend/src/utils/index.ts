import type { TextItem } from "pdfjs-dist/types/src/display/api";
import { getDocument } from "pdfjs-dist";

const name = "John Christian Los Bañes";

type LinkedInKeys =
  | "Contact"
  | "Top Skills"
  | "Headline"
  | "Languages"
  | "Certifications"
  | "Honors-Awards"
  | "Summary"
  | "Experience";

const finalData: Record<LinkedInKeys, string> = {
  Contact: "",
  "Top Skills": "",
  Headline: "",
  Languages: "",
  Certifications: "",
  "Honors-Awards": "",
  Summary: "",
  Experience: "",
};

const isDigit = (text: string): boolean => {
  return /^\d+$/.test(text);
};

const keyToAppend: LinkedInKeys = "Contact";

export async function readPdf(file: File) {
  const reader = new FileReader();
  reader.onload = async () => {
    const pdf = await getDocument(new Uint8Array(reader.result as ArrayBuffer))
      .promise;

    const extractedText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      console.log(textContent.str);
    }

    console.log(extractedText);
  };

  reader.readAsArrayBuffer(file);
}

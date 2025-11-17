import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export async function generatePdfFromElement(
  elementId = "trip-content",
  fileName = "voyagr_trip.pdf"
) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.warn(`Element with id "${elementId}" not found`);
    return;
  }

  // Wait one animation frame to ensure the element is fully rendered
  await new Promise((res) => requestAnimationFrame(res));

  // Take screenshot of HTML element
  const canvas = await html2canvas(element, { scale: 2, useCORS: true });

  // Convert canvas to image
  const imgData = canvas.toDataURL("image/png");

  // Create PDF (A4 size)
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

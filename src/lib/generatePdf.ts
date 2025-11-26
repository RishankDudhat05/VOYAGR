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

  // Ensure layout is fully rendered
  await new Promise((res) => requestAnimationFrame(res));

  // 1) LOWER SCALE to reduce resolution
  // 2) Use scrollY fix so whole element is captured
  const canvas = await html2canvas(element, {
    scale: 1,          // <-- was 2 (this halves pixel count in each dimension)
    useCORS: true,
    scrollY: -window.scrollY,
  });

  // Use JPEG instead of PNG with quality to reduce size
  const imgData = canvas.toDataURL("image/jpeg", 0.7); // 0.7 = 70% quality

  // Enable compression in jsPDF
  const pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const margin = 5; // mm
  const imgWidth = pdfWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = margin;

  // First page
  pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
  heightLeft -= pdfHeight;

  // Extra pages
  while (heightLeft > 0) {
    pdf.addPage();
    position = heightLeft - imgHeight + margin;
    pdf.addImage(imgData, "JPEG", margin, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(fileName);
}

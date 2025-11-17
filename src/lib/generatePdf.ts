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

    // If content fits on a single page
  if (pdfHeight <= pdf.internal.pageSize.getHeight()) {
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  } else {
    // Multi-page logic
    let remainingHeight = canvas.height;
    const pageHeightPx =
      (canvas.width * pdf.internal.pageSize.getHeight()) / pdfWidth;

    let position = 0;

    while (remainingHeight > 0) {
      const partCanvas = document.createElement("canvas");
      partCanvas.width = canvas.width;
      partCanvas.height = Math.min(pageHeightPx, remainingHeight);

      const ctx = partCanvas.getContext("2d")!;
      ctx.drawImage(
        canvas,
        0,
        position,
        canvas.width,
        partCanvas.height,
        0,
        0,
        partCanvas.width,
        partCanvas.height
      );

      const partImg = partCanvas.toDataURL("image/png");
      if (position !== 0) pdf.addPage();

      pdf.addImage(
        partImg,
        "PNG",
        0,
        0,
        pdfWidth,
        pdf.internal.pageSize.getHeight()
      );

      position += partCanvas.height;
      remainingHeight -= partCanvas.height;
    }
  }

  pdf.save(fileName);
}


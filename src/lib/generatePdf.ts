// src/lib/generatePdf.ts
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// ---------- Shared types (compatible with your UIDay/Place) ----------
export interface PDFPlace {
  name: string;
  location?: string;
  description?: string;
  mapUrl?: string;
  priceLabel?: string;
  timeLabel?: string;
  tags?: string[]; // used as "category"
}

export interface PDFDay {
  day: number | string;
  places: PDFPlace[];
}

// ---------- Helper: sanitize strings for jsPDF default font ----------
function sanitize(text?: string): string {
  if (!text) return "";
  return text
    .replace(/₹/g, "Rs ")  // rupee
    .replace(/[–—]/g, "-") // long dashes
    .replace(/[^\x20-\x7E]/g, ""); // strip other non-ASCII
}

/**
 * 1) Generic "screenshot" PDF helper (used by ManualPlannerPage)
 *    - Keeps your UI layout
 */
export async function generatePdfFromElement(
  elementOrId: string | HTMLElement,
  fileName = "voyagr_trip.pdf"
) {
  const element =
    typeof elementOrId === "string"
      ? document.getElementById(elementOrId)
      : elementOrId;

  if (!element) {
    console.warn("generatePdfFromElement: element not found");
    return;
  }

  // Wait a frame so layout is fully painted
  await new Promise((res) => requestAnimationFrame(res));

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    scrollY: -window.scrollY,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.9);

  const pdf = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    pdf.addPage();
    position = heightLeft - imgHeight;
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(fileName);
}

/**
 * 2) Text-based itinerary PDF with clickable place names
 *    - Used by ResultPage (trip AI)
 */
export function generatePdfFromItinerary(
  title: string,
  days: PDFDay[],
  fileName = "voyagr_trip.pdf"
) {
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const marginLeft = 15;
  const marginTop = 20;
  const usableWidth = pageWidth - marginLeft * 2;

  let y = marginTop;

  // soft “pookie” palette
  const COLOR_TITLE = { r: 79, g: 70, b: 229 };     // indigo
  const COLOR_DAY = { r: 236, g: 72, b: 153 };      // pink
  const COLOR_LINK = { r: 59, g: 130, b: 246 };     // blue
  const COLOR_TEXT = { r: 31, g: 41, b: 55 };       // dark slate
  const COLOR_MUTED = { r: 107, g: 114, b: 128 };   // gray

  const ensureSpace = (extraHeight: number) => {
    if (y + extraHeight > pageHeight - marginTop) {
      doc.addPage();
      y = marginTop;
    }
  };

  // ----- Title -----
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(COLOR_TITLE.r, COLOR_TITLE.g, COLOR_TITLE.b);

  const safeTitle = sanitize(title || "Your Trip");
  const titleLines = doc.splitTextToSize(safeTitle, usableWidth);
  titleLines.forEach((line: string) => {
    ensureSpace(9);
    doc.text(line, marginLeft, y);
    y += 9;
  });

  y += 6;

  // ----- Days & Places -----
  days.forEach((day) => {
    // Day heading
    ensureSpace(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(COLOR_DAY.r, COLOR_DAY.g, COLOR_DAY.b);
    doc.text(`Day ${day.day}`, marginLeft, y);
    y += 6;

    // Separator line
    doc.setDrawColor(COLOR_DAY.r, COLOR_DAY.g, COLOR_DAY.b);
    doc.setLineWidth(0.4);
    doc.line(marginLeft, y, marginLeft + usableWidth, y);
    y += 5;

    if (!day.places || day.places.length === 0) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(COLOR_MUTED.r, COLOR_MUTED.g, COLOR_MUTED.b);
      ensureSpace(6);
      doc.text("No places for this day.", marginLeft + 2, y);
      y += 10;
      return;
    }

    day.places.forEach((place) => {
      const name = sanitize(place.name || "Unnamed place");
      const location = sanitize(place.location);
      const timeLabel = sanitize(place.timeLabel);
      const priceLabel = sanitize(place.priceLabel);
      const categoryText =
        place.tags && place.tags.length ? sanitize(place.tags.join(", ")) : "";
      const description = sanitize(place.description);

      // Gap before place block
      ensureSpace(22);
      y += 2;

      // Place name (clickable if mapUrl exists)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(COLOR_LINK.r, COLOR_LINK.g, COLOR_LINK.b);

      if (place.mapUrl) {
        doc.textWithLink(name, marginLeft + 2, y, { url: place.mapUrl });
      } else {
        doc.text(name, marginLeft + 2, y);
      }
      y += 5;

      // Info lines
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(COLOR_TEXT.r, COLOR_TEXT.g, COLOR_TEXT.b);

      if (location) {
        ensureSpace(5);
        doc.text(`Location: ${location}`, marginLeft + 4, y);
        y += 4;
      }

      if (timeLabel) {
        ensureSpace(5);
        doc.text(`Time    : ${timeLabel}`, marginLeft + 4, y);
        y += 4;
      }

      if (priceLabel) {
        ensureSpace(5);
        doc.text(`Cost    : ${priceLabel}`, marginLeft + 4, y);
        y += 4;
      }

      if (categoryText) {
        ensureSpace(5);
        doc.text(`Category: ${categoryText}`, marginLeft + 4, y);
        y += 4;
      }

      // Description
      if (description) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(COLOR_MUTED.r, COLOR_MUTED.g, COLOR_MUTED.b);

        const descLines = doc.splitTextToSize(
          description,
          usableWidth - 8
        );
        descLines.forEach((line: string) => {
          ensureSpace(5);
          doc.text(line, marginLeft + 6, y);
          y += 4;
        });
      }

      // Small gap before next place
      y += 4;
    });

    // Extra gap between days
    y += 6;
  });

  doc.save(fileName);
}

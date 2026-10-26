import jsPDF from 'jspdf';
import * as htmlToImage from 'html-to-image';
import html2canvasPro from 'html2canvas-pro';

export interface PdfExportOptions {
  includePage2?: boolean;
  filename?: string;
  onProgress?: (status: string) => void;
}

/**
 * Prepares an exact printable replica of the page node for capture,
 * freezing all inputs/textareas to their exact current values without
 * cursor blinks, selection boxes, or zoom scale distortion.
 */
function prepareElementForCapture(sourceEl: HTMLElement): HTMLElement {
  const clone = sourceEl.cloneNode(true) as HTMLElement;

  // Copy current values from inputs and textareas into the clone
  const sourceInputs = sourceEl.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
  const cloneInputs = clone.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea');

  sourceInputs.forEach((sourceInput, idx) => {
    const cloneInput = cloneInputs[idx];
    if (cloneInput) {
      cloneInput.value = sourceInput.value;
      // Also set attribute for HTML serialization
      cloneInput.setAttribute('value', sourceInput.value);
      if (sourceInput.tagName.toLowerCase() === 'textarea') {
        cloneInput.textContent = sourceInput.value;
      }
      // Remove any focus styles or outline
      cloneInput.style.outline = 'none';
      cloneInput.style.boxShadow = 'none';
      cloneInput.style.border = 'none';
    }
  });

  // Ensure absolute 816x1056 dimensions without any outer scale transform
  clone.style.width = '816px';
  clone.style.height = '1056px';
  clone.style.transform = 'none';
  clone.style.margin = '0';
  clone.style.boxShadow = 'none';
  clone.style.backgroundColor = '#ffffff';

  return clone;
}

/**
 * Captures an HTML element to a high-resolution PNG data URL.
 * Uses html-to-image (SVG foreignObject rasterization) as the primary engine
 * because it natively supports modern Tailwind v4 color spaces (oklab, oklch)
 * and sharp font rendering. Falls back to html2canvas-pro if needed.
 */
async function captureElementToPng(element: HTMLElement): Promise<string> {
  // Mount the clone in an off-screen container with explicit 816x1056 dimensions
  const offscreenContainer = document.createElement('div');
  offscreenContainer.style.position = 'fixed';
  offscreenContainer.style.top = '-9999px';
  offscreenContainer.style.left = '-9999px';
  offscreenContainer.style.width = '816px';
  offscreenContainer.style.height = '1056px';
  offscreenContainer.style.overflow = 'hidden';
  offscreenContainer.style.zIndex = '-9999';
  offscreenContainer.style.backgroundColor = '#ffffff';

  const preparedClone = prepareElementForCapture(element);
  offscreenContainer.appendChild(preparedClone);
  document.body.appendChild(offscreenContainer);

  try {
    // Wait for fonts and images in the cloned subtree
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    // Small delay to ensure layout computation in DOM
    await new Promise(r => setTimeout(r, 50));

    // Try primary: html-to-image at 2.5x DPI (2040x2640px, crisp print quality)
    try {
      const dataUrl = await htmlToImage.toPng(preparedClone, {
        pixelRatio: 2.5,
        width: 816,
        height: 1056,
        backgroundColor: '#ffffff',
        skipAutoScale: true,
        skipFonts: true,
        cacheBust: false,
      });
      return dataUrl;
    } catch (primaryErr) {
      console.warn('html-to-image capture fallback to html2canvas-pro:', primaryErr);
      // Fallback: html2canvas-pro
      const canvas = await html2canvasPro(preparedClone, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 816,
        height: 1056,
      });
      return canvas.toDataURL('image/png', 1.0);
    }
  } finally {
    if (document.body.contains(offscreenContainer)) {
      document.body.removeChild(offscreenContainer);
    }
  }
}

/**
 * Downloads a Blob directly to the client's device using an anchor element
 */
function triggerFileDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    if (document.body.contains(anchor)) {
      document.body.removeChild(anchor);
    }
    URL.revokeObjectURL(url);
  }, 2000);
}

/**
 * Main export function: captures Page 1 (and Page 2 if requested) and generates
 * a standard US Letter (8.5 x 11 in) PDF file downloaded directly to the device.
 */
export async function exportToPdf(options: PdfExportOptions = {}): Promise<boolean> {
  const {
    includePage2 = false,
    filename = 'Nevada_DMV_Registration_NVREG04.pdf',
    onProgress,
  } = options;

  try {
    onProgress?.('Preparing Nevada DMV document for capture...');

    // Find Page 1
    const page1El = document.getElementById('nv-registration-page-1');
    if (!page1El) {
      throw new Error('Front Certificate (Page 1) element not found in DOM.');
    }

    // Initialize jsPDF in US Letter portrait (8.5 x 11 inches)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'in',
      format: 'letter',
      compress: true,
    });

    onProgress?.('Rendering Page 1 (Front Certificate) in high-DPI resolution...');
    const page1DataUrl = await captureElementToPng(page1El);

    // Add Page 1 image spanning exact 8.5 x 11 inches
    pdf.addImage(page1DataUrl, 'PNG', 0, 0, 8.5, 11, undefined, 'FAST');

    // Page 2 if requested
    if (includePage2) {
      const page2El = document.getElementById('nv-registration-page-2');
      if (page2El) {
        onProgress?.('Rendering Page 2 (Reverse Instructions)...');
        const page2DataUrl = await captureElementToPng(page2El);
        pdf.addPage('letter', 'portrait');
        pdf.addImage(page2DataUrl, 'PNG', 0, 0, 8.5, 11, undefined, 'FAST');
      }
    }

    onProgress?.('Assembling and downloading PDF file...');

    // Generate output blob
    const pdfBlob = pdf.output('blob');

    // Trigger device download
    triggerFileDownload(pdfBlob, filename);

    onProgress?.('PDF successfully downloaded to your device!');
    return true;
  } catch (error: any) {
    console.error('Failed to export PDF:', error);
    onProgress?.(`Export failed: ${error?.message || 'Unknown error'}`);
    return false;
  }
}

export function printDocument() {
  window.print();
}

import type { ExportOptions, ImageFormat } from '@/models/export_options';
import { sendToWorker } from '@/utils/send_to_worker';

/**
 * Takes the BMP data from WebGLImageViewer and exports it as an image file.
 */
export async function convertAndExportImage(
  bmpImageData: Blob,
  options: ExportOptions,
) {
  const imgArr = await bmpImageData.arrayBuffer();

  const data = (await sendToWorker(
    new Uint8Array(imgArr),
    options,
  )) as Uint8Array<ArrayBuffer>;

  downloadBlobAsFile(new Blob([data]), options.format);
}

function downloadBlobAsFile(blob: Blob, format: ImageFormat) {
  // Placeholder: For now, just download the BMP as-is
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `exported-image-${Date.now()}.${format}`;
  a.click();
  URL.revokeObjectURL(url);
}

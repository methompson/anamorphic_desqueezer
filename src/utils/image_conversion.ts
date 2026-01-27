import type { ExportOptions, ImageFormat } from '@/models/export_options';

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

async function sendToWorker(
  imageData: Uint8Array,
  options: ExportOptions,
): Promise<Uint8Array> {
  return new Promise((res, rej) => {
    const worker = new Worker(
      new URL('./worker_image_compression.ts', import.meta.url),
      {
        type: 'module',
      },
    );

    worker.onmessage = (e) => {
      if (e.data instanceof Uint8Array) {
        res(e.data);
      } else {
        console.error('Received non-Uint8Array data');
        rej(new Error('Received non-Uint8Array data'));
      }

      res(new Uint8Array());

      worker.terminate();
    };

    worker.postMessage({
      imageData,
      options,
    });
  });
}

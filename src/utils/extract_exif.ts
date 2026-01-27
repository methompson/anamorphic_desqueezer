export async function extractExifDataFromImage(
  file: File,
): Promise<Uint8Array | undefined> {
  try {
    const result = await sendToExifWorker(file);
    return result;
  } catch (e) {
    console.error('Error extracting EXIF data: ', e);
  }
}

async function sendToExifWorker(file: File): Promise<Uint8Array> {
  return new Promise((res, rej) => {
    const worker = new Worker(
      new URL('./worker_extract_exif.ts', import.meta.url),
      {
        type: 'module',
      },
    );

    worker.onmessage = (e) => {
      if (e.data instanceof Uint8Array) {
        res(e.data);
      } else {
        rej(new Error('Received non-Uint8Array data'));
      }

      res(new Uint8Array());

      worker.terminate();
    };

    worker.postMessage({
      file,
    });
  });
}

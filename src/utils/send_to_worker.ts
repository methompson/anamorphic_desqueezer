import type { ExportOptions } from '@/models/export_options';

export async function sendToWorker(
  imageData: Uint8Array,
  options: ExportOptions,
): Promise<Uint8Array> {
  return new Promise((res, rej) => {
    const worker = new Worker(
      new URL('./image_compression_worker.ts', import.meta.url),
      {
        type: 'module',
      },
    );

    worker.onmessage = (e) => {
      console.log('Main thread received message:', e.data);

      if (e.data instanceof Uint8Array) {
        console.log('Received Uint8Array');
        res(e.data);
      } else {
        console.log('Received non-Uint8Array data');
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

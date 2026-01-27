import { isInstanceOf, isRecord } from '@metools/tcheck';
import { extractExifData } from '@metools/web-image-converter';

onmessage = async (e: MessageEvent) => {
  try {
    if (!isRecord(e) || !isInstanceOf<File>(e.data.file, File)) {
      postMessage('Received non-File data');
      return;
    }

    const data = await extractExifDataFromFile(e.data.file);

    postMessage(data);
  } catch (err) {
    postMessage(`Error in exif extraction worker: ${err}`);
  }
};

async function extractExifDataFromFile(file: File) {
  const buf = await file.arrayBuffer();
  const fileArr = new Uint8Array(buf);

  const exifData = extractExifData(fileArr);

  return exifData;
}

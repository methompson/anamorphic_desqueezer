import { isExportOptions, type ExportOptions } from '@/models/export_options';
import { isInstanceOfGenerator, typeGuardGenerator } from '@metools/tcheck';
import {
  ImageConverter,
  ImageResizeLongestSideOptions,
  JpegCompressionOptions,
} from '@metools/web-image-converter';

const isFile = isInstanceOfGenerator(File);

interface ImageCompressionWorkerMessage {
  file: File;
  options: ExportOptions;
}

const isImageCompressionWorkerMessage =
  typeGuardGenerator<ImageCompressionWorkerMessage>({
    file: isFile,
    options: isExportOptions,
  });

onmessage = async (e: MessageEvent) => {
  console.log('Worker received message:', e);

  if (e.data instanceof File) {
    // console.log('Received File');
    // const result = await convertImage(e.data);
    // postMessage(result);
  } else {
    postMessage('Received non-File data');
  }
};

async function convertImage(file: File) {
  const converter = new ImageConverter({
    compression: new JpegCompressionOptions(65),
    resize: new ImageResizeLongestSideOptions({ longest_side: 1024 }),
  });

  const result = await converter.convertImageFile(file);

  return result;
}

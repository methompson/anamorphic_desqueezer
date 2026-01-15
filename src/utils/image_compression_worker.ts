import {
  isImageCompressionWorkerMessage,
  type ImageCompressionWorkerMessage,
  ImageFormat,
} from '@/models/export_options';
import {
  BmpCompressionOptions,
  ImageCompressionOptions,
  ImageConverter,
  ImageResizeLongestSideOptions,
  JpegCompressionOptions,
  PngCompressionOptions,
  TgaCompressionOptions,
  type ImageConverterInput,
} from '@metools/web-image-converter';

onmessage = async (e: MessageEvent) => {
  if (isImageCompressionWorkerMessage(e.data)) {
    const result = await convertImage(e.data);
    postMessage(result);
  } else {
    postMessage('Received non-File data');
  }
};

async function convertImage(data: ImageCompressionWorkerMessage) {
  const compression = getCompressionOptions(data);

  const opt: ImageConverterInput = {
    compression,
  };

  if (data.options.longestSidePx !== null) {
    opt.resize = new ImageResizeLongestSideOptions({
      longest_side: data.options.longestSidePx,
    });
  }

  const converter = new ImageConverter(opt);

  const result = await converter.convertImageBytes(data.imageData);

  return result;
}

function getCompressionOptions(
  data: ImageCompressionWorkerMessage,
): ImageCompressionOptions {
  switch (data.options.format) {
    case ImageFormat.JPEG:
      return new JpegCompressionOptions(data.options.compression);
    case ImageFormat.PNG:
      return new PngCompressionOptions(data.options.compression);
    case ImageFormat.BMP:
      return new BmpCompressionOptions();
    case ImageFormat.TGA:
      return new TgaCompressionOptions();
    default:
      throw new Error('Unsupported image format');
  }
}

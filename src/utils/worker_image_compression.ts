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
  type ImageConversionInstanceOptions,
  type ImageConverterInput,
} from '@metools/web-image-converter';

onmessage = async (e: MessageEvent) => {
  try {
    if (isImageCompressionWorkerMessage(e.data)) {
      const result = await convertImage(e.data);
      postMessage(result);
    } else {
      postMessage('Received non-File data');
    }
  } catch (err) {
    postMessage(`Error in image compression worker: ${err}`);
  }
};

async function convertImage(data: ImageCompressionWorkerMessage) {
  const compression = getCompressionOptions(data);

  const opt: ImageConverterInput = {
    compression,
  };

  if (data.options.longestSidePx !== null) {
    opt.resize = new ImageResizeLongestSideOptions({
      longestSide: data.options.longestSidePx,
    });
  }

  const converter = new ImageConverter(opt);

  const options: ImageConversionInstanceOptions = {};

  if (data.options.exif) {
    options.exifData = data.options.exif;
  }

  const result = await converter.convertImageBytes(data.imageData, options);

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

import {
  isEnumValueGenerator,
  isInstanceOfGenerator,
  isNumber,
  isUndefinedOrNull,
  typeGuardGenerator,
  unionGuard,
} from '@metools/tcheck';

export enum ImageFormat {
  JPEG = 'jpeg',
  PNG = 'png',
  BMP = 'bmp',
  TGA = 'tga',
}

const isImageFormat = isEnumValueGenerator(ImageFormat);

export interface ExportOptions {
  format: ImageFormat;
  longestSidePx: number | null;
  compression: number;
  exif?: Uint8Array;
}

const isNumberOrNull = unionGuard<number | null>(isNumber, isUndefinedOrNull);

export const isExportOptions = typeGuardGenerator<ExportOptions>({
  format: isImageFormat,
  longestSidePx: isNumberOrNull,
  compression: isNumber,
  exif: unionGuard<Uint8Array | undefined>(
    isInstanceOfGenerator(Uint8Array),
    isUndefinedOrNull,
  ),
});

export interface ImageCompressionWorkerMessage {
  imageData: Uint8Array;
  options: ExportOptions;
}

export const isImageCompressionWorkerMessage =
  typeGuardGenerator<ImageCompressionWorkerMessage>({
    imageData: isInstanceOfGenerator(Uint8Array),
    options: isExportOptions,
  });

export interface ImageDimensions {
  width: number;
  height: number;
}

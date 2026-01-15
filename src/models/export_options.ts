import {
  isEnumValueGenerator,
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
}

const isNumberOrNull = unionGuard<number | null>(isNumber, isUndefinedOrNull);

export const isExportOptions = typeGuardGenerator<ExportOptions>({
  format: isImageFormat,
  longestSidePx: isNumberOrNull,
  compression: isNumber,
});

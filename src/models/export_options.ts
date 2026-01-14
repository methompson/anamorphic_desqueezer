export enum ImageFormat {
  JPEG = 'jpeg',
  PNG = 'png',
  BMP = 'bmp',
  TGA = 'tga',
}

export interface ExportOptions {
  format: ImageFormat;
  longestSidePx: number | null;
  compression: number;
}

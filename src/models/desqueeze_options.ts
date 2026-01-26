import {
  isInstanceOfGenerator,
  isNumber,
  isString,
  isUndefinedOrNull,
  typeGuardGenerator,
  unionGuard,
} from '@metools/tcheck';

export interface DesqueezeOptions {
  file: File | undefined;
  desqueezeRatio: number;
  lensDistortion: number;
  zoom: number;
  backgroundColor: string;
}

export const isDesqueezeOptions = typeGuardGenerator<DesqueezeOptions>({
  file: unionGuard(isInstanceOfGenerator(File), isUndefinedOrNull),
  desqueezeRatio: isNumber,
  lensDistortion: isNumber,
  zoom: isNumber,
  backgroundColor: isString,
});

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.8;

export class ImageProcessingError extends Error {}

/** Safari 구버전 등 createImageBitmap 미지원 환경을 위한 대체 로더. */
function loadHtmlImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new ImageProcessingError("이미지를 불러올 수 없어요."));
    };
    img.src = objectUrl;
  });
}

async function loadImageSource(file: File): Promise<CanvasImageSource & { width: number; height: number }> {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch {
      // createImageBitmap이 실패하면 HTMLImageElement 방식으로 대체한다.
    }
  }
  return loadHtmlImage(file);
}

/**
 * 사진 파일을 긴 변 기준 maxSize 이하로 리사이즈하고 JPEG로 압축한다.
 * iPad Safari를 포함해 널리 지원되는 canvas API만 사용한다.
 * PNG/GIF 등 다른 형식도 이 과정에서 JPEG로 통일된다.
 */
export async function resizeImageFile(
  file: File,
  maxSize: number = MAX_DIMENSION,
  quality: number = JPEG_QUALITY,
): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new ImageProcessingError("이미지 파일만 첨부할 수 있어요.");
  }

  const source = await loadImageSource(file);
  const { width, height } = source;
  const scale = Math.min(1, maxSize / Math.max(width, height));
  const targetWidth = Math.max(1, Math.round(width * scale));
  const targetHeight = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new ImageProcessingError("이미지를 처리할 수 없어요.");
  }

  // JPEG는 투명 배경을 지원하지 않으므로 흰 배경을 먼저 채운다.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(source, 0, 0, targetWidth, targetHeight);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", quality);
  });

  if (!blob) {
    throw new ImageProcessingError("이미지 압축에 실패했어요.");
  }

  return blob;
}

export function blobToObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

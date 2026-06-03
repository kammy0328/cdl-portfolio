// 브라우저에서 이미지를 화질 유지하며 WebP로 변환·축소 (업로드 용량 자동 절감)

export interface Compressed {
  blob: Blob;
  w: number;
  h: number;
  /** 로딩 중 표시할 흐릿한 미리보기(LQIP) data URL */
  blur: string;
}

function loadImg(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/**
 * 긴 변을 maxSide(px) 이하로 줄이고 WebP(quality)로 인코딩.
 * 비율(16:9·4:3·9:16 등)은 그대로 유지합니다.
 */
export async function compressImage(
  file: File,
  maxSide = 2400,
  quality = 0.95
): Promise<Compressed> {
  let iw: number;
  let ih: number;
  let source: CanvasImageSource;

  try {
    const bitmap = await createImageBitmap(file);
    iw = bitmap.width;
    ih = bitmap.height;
    source = bitmap;
  } catch {
    const img = await loadImg(file);
    iw = img.naturalWidth;
    ih = img.naturalHeight;
    source = img;
  }

  const scale = Math.min(1, maxSide / Math.max(iw, ih));
  const w = Math.max(1, Math.round(iw * scale));
  const h = Math.max(1, Math.round(ih * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas context unavailable");
  ctx.drawImage(source, 0, 0, w, h);

  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("WebP 인코딩 실패"))),
      "image/webp",
      quality
    )
  );

  // 흐릿한 미리보기(LQIP) — 작은 캔버스로 축소 후 base64
  const bw = 24;
  const bh = Math.max(1, Math.round((bw * h) / w));
  const bc = document.createElement("canvas");
  bc.width = bw;
  bc.height = bh;
  bc.getContext("2d")?.drawImage(source, 0, 0, bw, bh);
  const blur = bc.toDataURL("image/jpeg", 0.5);

  return { blob, w, h, blur };
}

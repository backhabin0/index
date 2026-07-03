import type { PhotoMeta } from "../models/photo";
import { localDatabase } from "../services/localDatabase";
import { resizeImageFile } from "../utils/imageUtils";

interface PhotoRecord extends PhotoMeta {
  blob: Blob;
}

export interface StoredPhoto {
  meta: PhotoMeta;
  blob: Blob;
}

export interface PhotoRepository {
  savePhoto(file: File): Promise<PhotoMeta>;
  getPhoto(photoId: string): Promise<StoredPhoto | null>;
  deletePhoto(photoId: string): Promise<void>;
  deletePhotos(photoIds: string[]): Promise<void>;
  deleteAllPhotos(): Promise<void>;
}

function keyOf(photoId: string): string {
  return `photo:${photoId}`;
}

/**
 * 사진은 Entry에 직접 넣지 않고 이 저장소(localForage "photos" store)에
 * 리사이즈된 Blob으로 저장한다. Entry는 photoLocalIds로 이 저장소의 id만 참조한다.
 * 추후 Firebase Storage 업로드 시에도 이 인터페이스는 유지하고, 내부에서 업로드 후
 * photoUrls를 채우는 방식으로 확장하면 된다.
 */
class LocalPhotoRepository implements PhotoRepository {
  async savePhoto(file: File): Promise<PhotoMeta> {
    const blob = await resizeImageFile(file);
    const id = crypto.randomUUID();
    const meta: PhotoMeta = {
      id,
      fileName: file.name,
      mimeType: blob.type || file.type,
      size: blob.size,
      createdAt: new Date().toISOString(),
    };

    const record: PhotoRecord = { ...meta, blob };
    await localDatabase.setItem<PhotoRecord>("photos", keyOf(id), record);
    return meta;
  }

  async getPhoto(photoId: string): Promise<StoredPhoto | null> {
    const record = await localDatabase.getItem<PhotoRecord>("photos", keyOf(photoId));
    if (!record) return null;

    const { blob, ...meta } = record;
    return { meta, blob };
  }

  async deletePhoto(photoId: string): Promise<void> {
    await localDatabase.removeItem("photos", keyOf(photoId));
  }

  async deletePhotos(photoIds: string[]): Promise<void> {
    await Promise.all(photoIds.map((id) => this.deletePhoto(id)));
  }

  async deleteAllPhotos(): Promise<void> {
    await localDatabase.clear("photos");
  }
}

export const photoRepository: PhotoRepository = new LocalPhotoRepository();

import { ConflictException, Injectable } from '@nestjs/common';
import { MinioService } from './minio.service';

export interface ImageField {
  base64?: string;
  url?: string;
}

@Injectable()
export class ImageStorageService {
  constructor(private readonly minioService: MinioService) {}

  isEnabled(): boolean {
    return this.minioService.isEnabled();
  }

  ensureEnabled(): void {
    if (!this.isEnabled()) {
      throw new ConflictException(
        'MinIO is disabled. Set MINIO_ENABLED=true in .env first.',
      );
    }
  }

  async uploadBase64(base64: string, folder: string): Promise<string | null> {
    if (!this.isEnabled()) {
      return null;
    }

    return this.minioService.uploadBase64(base64, folder);
  }

  hasBase64(image?: ImageField | null): boolean {
    return Boolean(image?.base64);
  }

  hasLegacyBase64(base64?: string | null): boolean {
    return Boolean(base64);
  }

  stripImageField(image?: ImageField | null): ImageField | undefined {
    if (!image?.url) {
      return undefined;
    }

    return { url: image.url };
  }

  async processImageField(
    image?: ImageField,
    folder = 'images',
  ): Promise<ImageField | undefined> {
    if (!this.isEnabled() || !image) {
      return image;
    }

    if (image.base64) {
      const url = await this.uploadBase64(image.base64, folder);
      if (url) {
        return { url };
      }
    }

    if (image.url) {
      return { url: image.url };
    }

    return undefined;
  }

  async migrateImageField(
    image?: ImageField,
    folder = 'images',
  ): Promise<{ image?: ImageField; changed: boolean }> {
    if (!this.isEnabled()) {
      return { image: this.stripImageField(image), changed: false };
    }

    if (image?.base64 && !image.url) {
      const url = await this.uploadBase64(image.base64, folder);
      if (url) {
        return { image: { url }, changed: true };
      }
    } else if (image?.base64 && image.url) {
      return { image: { url: image.url }, changed: true };
    }

    return { image: this.stripImageField(image), changed: false };
  }

  async processLegacyImage(
    base64?: string,
    existingUrl?: string,
    folder = 'images',
  ): Promise<{ url?: string; clearBase64: boolean }> {
    if (!this.isEnabled()) {
      return { url: existingUrl, clearBase64: false };
    }

    if (base64) {
      const url = await this.uploadBase64(base64, folder);
      if (url) {
        return { url, clearBase64: true };
      }
    }

    return { url: existingUrl, clearBase64: false };
  }

  async migrateLegacyImage(
    base64?: string | null,
    url?: string | null,
    folder = 'images',
  ): Promise<{ url?: string; clearBase64: boolean; changed: boolean }> {
    if (!this.isEnabled()) {
      return { url: url || undefined, clearBase64: false, changed: false };
    }

    if (base64 && !url) {
      const uploaded = await this.uploadBase64(base64, folder);
      if (uploaded) {
        return { url: uploaded, clearBase64: true, changed: true };
      }
    } else if (base64) {
      return { url: url || undefined, clearBase64: true, changed: true };
    }

    return { url: url || undefined, clearBase64: false, changed: false };
  }
}

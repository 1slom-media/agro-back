import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { randomUUID } from 'crypto';

interface ParsedBase64 {
  buffer: Buffer;
  contentType: string;
  extension: string;
}

@Injectable()
export class MinioService implements OnModuleInit {
  private client: Minio.Client | null = null;
  private bucket: string;
  private publicUrl: string;
  private enabled: boolean;
  private readonly logger = new Logger(MinioService.name);

  constructor(private readonly configService: ConfigService) {
    this.enabled =
      this.configService.get<string>('MINIO_ENABLED', 'false') === 'true';
    this.bucket = this.configService.get<string>(
      'MINIO_BUCKET',
      'agro-products',
    );
    this.publicUrl = (
      this.configService.get<string>('MINIO_PUBLIC_URL') || ''
    ).replace(/\/$/, '');
  }

  isEnabled(): boolean {
    return this.enabled && this.client !== null;
  }

  async onModuleInit(): Promise<void> {
    if (!this.enabled) {
      this.logger.warn(
        'MinIO disabled (MINIO_ENABLED!=true). Product images stay as base64.',
      );
      return;
    }

    const endPoint = this.configService.get<string>(
      'MINIO_ENDPOINT',
      'localhost',
    );
    const port = parseInt(
      this.configService.get<string>('MINIO_PORT', '9000'),
      10,
    );
    const useSSL =
      this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true';
    const accessKey = this.configService.get<string>(
      'MINIO_ACCESS_KEY',
      'minioadmin',
    );
    const secretKey = this.configService.get<string>(
      'MINIO_SECRET_KEY',
      'minioadmin',
    );

    this.client = new Minio.Client({
      endPoint,
      port,
      useSSL,
      accessKey,
      secretKey,
    });

    try {
      const exists = await this.client.bucketExists(this.bucket);
      if (!exists) {
        await this.client.makeBucket(this.bucket, 'us-east-1');
        this.logger.log(`Created MinIO bucket: ${this.bucket}`);
      }

      await this.applyPublicReadPolicy();

      this.logger.log(`MinIO connected, bucket: ${this.bucket}`);
    } catch (err) {
      this.logger.error('Failed to initialize MinIO', err);
      this.client = null;
    }
  }

  async applyPublicReadPolicy(): Promise<void> {
    if (!this.client) {
      return;
    }

    const publicRead =
      this.configService.get<string>('MINIO_PUBLIC_READ', 'true') === 'true';

    if (!publicRead) {
      this.logger.warn(
        `MinIO public read disabled (MINIO_PUBLIC_READ=false). Browser image access may fail.`,
      );
      return;
    }

    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${this.bucket}/*`],
        },
      ],
    };

    await this.client.setBucketPolicy(this.bucket, JSON.stringify(policy));
    this.logger.log(`MinIO bucket public read policy applied: ${this.bucket}`);
  }

  private parseBase64(dataUri: string): ParsedBase64 | null {
    const match = dataUri.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      const contentType = match[1];
      const extension =
        contentType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
      return {
        buffer: Buffer.from(match[2], 'base64'),
        contentType,
        extension,
      };
    }

    if (dataUri.length > 100 && !dataUri.includes(' ')) {
      return {
        buffer: Buffer.from(dataUri, 'base64'),
        contentType: 'image/jpeg',
        extension: 'jpg',
      };
    }

    return null;
  }

  async uploadBase64(
    base64: string,
    folder = 'products',
  ): Promise<string | null> {
    if (!this.client || !this.enabled) {
      return null;
    }

    const parsed = this.parseBase64(base64);
    if (!parsed) {
      return null;
    }

    const objectName = `${folder}/${randomUUID()}.${parsed.extension}`;

    await this.client.putObject(
      this.bucket,
      objectName,
      parsed.buffer,
      parsed.buffer.length,
      { 'Content-Type': parsed.contentType },
    );

    if (this.publicUrl) {
      return `${this.publicUrl}/${objectName}`;
    }

    const endPoint = this.configService.get<string>(
      'MINIO_ENDPOINT',
      'localhost',
    );
    const port = this.configService.get<string>('MINIO_PORT', '9000');
    const useSSL =
      this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true';
    const protocol = useSSL ? 'https' : 'http';
    return `${protocol}://${endPoint}:${port}/${this.bucket}/${objectName}`;
  }
}

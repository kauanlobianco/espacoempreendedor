import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import { dirname, join, resolve } from 'path';

type StorageDriver = 'local' | 'r2';

interface ReportStorageDriver {
  save(key: string, data: Buffer): Promise<{ key: string; hash: string }>;
  read(key: string): Promise<Buffer>;
  remove(key: string): Promise<void>;
}

class LocalReportStorageDriver implements ReportStorageDriver {
  constructor(private readonly root: string) {}

  private path(key: string) {
    return join(this.root, key);
  }

  async save(key: string, data: Buffer): Promise<{ key: string; hash: string }> {
    const filePath = this.path(key);
    await fs.mkdir(dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, data);
    const hash = createHash('sha256').update(data).digest('hex');
    return { key, hash };
  }

  async read(key: string): Promise<Buffer> {
    return fs.readFile(this.path(key));
  }

  async remove(key: string): Promise<void> {
    try {
      await fs.unlink(this.path(key));
    } catch {
      /* ignore */
    }
  }
}

class R2ReportStorageDriver implements ReportStorageDriver {
  private readonly client: S3Client;
  private readonly bucket: string;

  constructor(config: ConfigService) {
    const accountId = config.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = config.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = config.get<string>('R2_SECRET_ACCESS_KEY');
    const bucket = config.get<string>('R2_BUCKET');
    const endpoint =
      config.get<string>('R2_ENDPOINT') ??
      (accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined);

    if (!endpoint || !accessKeyId || !secretAccessKey || !bucket) {
      throw new Error(
        'R2 storage requires R2_ENDPOINT or R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY and R2_BUCKET.',
      );
    }

    this.bucket = bucket;
    this.client = new S3Client({
      region: 'auto',
      endpoint,
      forcePathStyle: true,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async save(key: string, data: Buffer): Promise<{ key: string; hash: string }> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: data,
        ContentType: 'application/pdf',
      }),
    );

    const hash = createHash('sha256').update(data).digest('hex');
    return { key, hash };
  }

  async read(key: string): Promise<Buffer> {
    const response = await this.client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );

    if (!response.Body) {
      throw new Error(`R2 object not found for key ${key}`);
    }

    const bytes = await response.Body.transformToByteArray();
    return Buffer.from(bytes);
  }

  async remove(key: string): Promise<void> {
    try {
      await this.client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );
    } catch {
      /* ignore */
    }
  }
}

@Injectable()
export class ReportStorageService {
  private readonly driver: ReportStorageDriver;

  constructor(config: ConfigService) {
    const configuredDriver = (config.get<string>('REPORT_STORAGE_DRIVER') ?? 'local').toLowerCase();
    const driver: StorageDriver = configuredDriver === 'r2' ? 'r2' : 'local';

    if (driver === 'r2') {
      this.driver = new R2ReportStorageDriver(config);
      return;
    }

    const root = resolve(
      config.get<string>('REPORT_STORAGE_DIR') ?? join(process.cwd(), 'storage', 'reports'),
    );
    this.driver = new LocalReportStorageDriver(root);
  }

  async save(key: string, data: Buffer): Promise<{ key: string; hash: string }> {
    return this.driver.save(key, data);
  }

  async read(key: string): Promise<Buffer> {
    return this.driver.read(key);
  }

  async remove(key: string): Promise<void> {
    return this.driver.remove(key);
  }
}

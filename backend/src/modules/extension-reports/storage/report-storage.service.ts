import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import { dirname, join, resolve } from 'path';

@Injectable()
export class ReportStorageService {
  private readonly root: string;

  constructor(config: ConfigService) {
    this.root = resolve(
      config.get<string>('REPORT_STORAGE_DIR') ?? join(process.cwd(), 'storage', 'reports'),
    );
  }

  private path(key: string) {
    return join(this.root, key);
  }

  async save(key: string, data: Buffer): Promise<{ key: string; hash: string }> {
    const p = this.path(key);
    await fs.mkdir(dirname(p), { recursive: true });
    await fs.writeFile(p, data);
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

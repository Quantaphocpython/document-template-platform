import fs from 'fs';
import path from 'path';
import { BaseEntity } from '../types/base-entity.type.js';

export abstract class BaseStorageRepository<TInstance extends BaseEntity> {
  protected readonly baseStorageDir: string;
  protected readonly templatesDir: string;
  protected readonly userInstancesDir: string;

  constructor(subDirectoryName: string) {
    this.baseStorageDir = path.join(process.cwd(), 'storage');
    this.templatesDir = path.join(this.baseStorageDir, 'templates');
    this.userInstancesDir = path.join(this.baseStorageDir, subDirectoryName);

    this.ensureDirectories();
  }

  protected ensureDirectories(): void {
    if (!fs.existsSync(this.baseStorageDir)) {
      fs.mkdirSync(this.baseStorageDir, { recursive: true });
    }
    if (!fs.existsSync(this.templatesDir)) {
      fs.mkdirSync(this.templatesDir, { recursive: true });
    }
    if (!fs.existsSync(this.userInstancesDir)) {
      fs.mkdirSync(this.userInstancesDir, { recursive: true });
    }
  }

  public getTemplatesDir(): string {
    this.ensureDirectories();
    return this.templatesDir;
  }

  public getUserInstancesDir(): string {
    this.ensureDirectories();
    return this.userInstancesDir;
  }

  /**
   * Save a newly created or updated user instance.
   * Guarantees write operations strictly target the user directory.
   */
  public saveUserInstance(instance: TInstance): void {
    this.ensureDirectories();
    const filePath = path.join(this.userInstancesDir, `${instance.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(instance, null, 2), 'utf-8');
  }

  /**
   * Retrieve a user instance by its unique ID.
   */
  public getUserInstanceById(id: string): TInstance | null {
    this.ensureDirectories();
    const filePath = path.join(this.userInstancesDir, `${id}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw) as TInstance;
    } catch {
      return null;
    }
  }

  /**
   * List all user instances sorted by most recently updated.
   */
  public listUserInstances(): TInstance[] {
    this.ensureDirectories();
    const files = fs.readdirSync(this.userInstancesDir).filter((f) => f.endsWith('.json'));
    const instances: TInstance[] = [];

    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(this.userInstancesDir, file), 'utf-8');
        instances.push(JSON.parse(raw) as TInstance);
      } catch {
        // Skip unreadable files
      }
    }

    return instances.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }
}

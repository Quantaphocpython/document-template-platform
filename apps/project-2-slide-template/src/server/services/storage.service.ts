import { BaseStorageRepository } from 'core/server';
import { UserPresentation } from '@/types';

class StorageService extends BaseStorageRepository<UserPresentation> {
  constructor() {
    super('presentations');
  }

  public getPresentationsDir(): string {
    return this.getUserInstancesDir();
  }

  /**
   * Save user presentation metadata.
   */
  public savePresentationMeta(presentation: UserPresentation): void {
    this.saveUserInstance(presentation);
  }

  /**
   * Retrieve user presentation metadata.
   */
  public getPresentationMeta(id: string): UserPresentation | null {
    return this.getUserInstanceById(id);
  }

  /**
   * List all user created presentations.
   */
  public listPresentations(): UserPresentation[] {
    return this.listUserInstances();
  }
}

export const storageService = new StorageService();

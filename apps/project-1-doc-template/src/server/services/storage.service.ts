import { BaseStorageRepository } from '@preview/core/server';
import { UserDocument } from '@/types';

class StorageService extends BaseStorageRepository<UserDocument> {
  constructor() {
    super('documents');
  }

  /**
   * Save a newly created or updated user document.
   * Inherits path management and physical separation from BaseStorageRepository.
   */
  public saveDocument(document: UserDocument): void {
    this.saveUserInstance(document);
  }

  /**
   * Retrieve a user document by ID.
   */
  public getDocument(id: string): UserDocument | null {
    return this.getUserInstanceById(id);
  }

  /**
   * List all user created documents.
   */
  public listDocuments(): UserDocument[] {
    return this.listUserInstances();
  }
}

export const storageService = new StorageService();

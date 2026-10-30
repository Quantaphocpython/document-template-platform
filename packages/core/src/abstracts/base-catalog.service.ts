import { BaseTemplateItem, CategoryMeta } from '../types/base-entity.type.js';

export interface CatalogFilterOptions {
  category?: string;
  search?: string;
}

export abstract class BaseCatalogService<
  TItem extends BaseTemplateItem<TCategory>,
  TCategory extends string = string,
> {
  protected items: TItem[];
  protected categories: CategoryMeta<TCategory>[];

  constructor(initialItems: TItem[], categories: CategoryMeta<TCategory>[]) {
    this.items = [...initialItems];
    this.categories = [...categories];
  }

  public getCategories(): CategoryMeta<TCategory>[] {
    return this.categories;
  }

  /**
   * Filter templates by category and search keyword across title, description, tags, and categoryName.
   */
  public getTemplates(options: CatalogFilterOptions = {}): TItem[] {
    const { category, search } = options;

    return this.items.filter((item) => {
      // 1. Category filter
      if (category && category !== 'all' && item.category !== category) {
        return false;
      }

      // 2. Search keyword filter
      if (search && search.trim() !== '') {
        const query = search.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchTags = item.tags.some((tag) => tag.toLowerCase().includes(query));
        const matchCategory = item.categoryName ? item.categoryName.toLowerCase().includes(query) : false;

        if (!matchTitle && !matchDesc && !matchTags && !matchCategory) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Retrieve a specific template item by its ID.
   */
  public getTemplateById(id: string): TItem | null {
    return this.items.find((item) => item.id === id) || null;
  }

  /**
   * Compute template counts for each category plus 'all'.
   */
  public calculateCategoryCounts(items: TItem[]): Record<string, number> {
    const counts: Record<string, number> = { all: items.length };
    for (const item of items) {
      counts[item.category] = (counts[item.category] || 0) + 1;
    }
    return counts;
  }

  /**
   * Extensibility hook: Dynamically adds a new template without re-deploying UI.
   */
  public addTemplate(newItem: Omit<TItem, 'createdAt' | 'updatedAt'>): TItem {
    const now = new Date().toISOString();
    const createdItem = {
      ...newItem,
      createdAt: now,
      updatedAt: now,
    } as TItem;

    this.items.unshift(createdItem);
    return createdItem;
  }
}

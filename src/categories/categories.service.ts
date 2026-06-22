import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { ImageStorageService } from '../storage/image-storage.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly imageStorage: ImageStorageService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { slug: createCategoryDto.slug },
    });

    if (existingCategory) {
      throw new ConflictException('Category with this slug already exists');
    }

    if (createCategoryDto.image) {
      createCategoryDto.image = await this.imageStorage.processImageField(
        createCategoryDto.image,
        'categories',
      );
    }

    const category = this.categoryRepository.create(createCategoryDto);
    const saved = await this.categoryRepository.save(category);
    return this.stripBase64FromCategory(saved);
  }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResult<Category>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await this.categoryRepository.findAndCount({
      skip,
      take: limit,
      order: { order: 'ASC', createdAt: 'DESC' },
    });

    const processed = await Promise.all(
      data.map((category) => this.migrateCategoryImageIfNeeded(category)),
    );

    return {
      data: processed,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return this.migrateCategoryImageIfNeeded(category);
  }

  async findBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { slug } });

    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }

    return this.migrateCategoryImageIfNeeded(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (updateCategoryDto.slug && updateCategoryDto.slug !== category.slug) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { slug: updateCategoryDto.slug },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this slug already exists');
      }
    }

    if (updateCategoryDto.image) {
      updateCategoryDto.image = await this.imageStorage.processImageField(
        updateCategoryDto.image,
        'categories',
      );
    }

    Object.assign(category, updateCategoryDto);
    const saved = await this.categoryRepository.save(category);
    return this.stripBase64FromCategory(saved);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }

  async migrateAllImagesToMinio(): Promise<{
    total: number;
    migrated: number;
    skipped: number;
    failed: number;
    errors: { categoryId: string; slug: string; message: string }[];
  }> {
    this.imageStorage.ensureEnabled();

    const categories = await this.categoryRepository.find({
      order: { createdAt: 'ASC' },
    });

    let migrated = 0;
    let skipped = 0;
    let failed = 0;
    const errors: { categoryId: string; slug: string; message: string }[] = [];

    for (const category of categories) {
      if (!this.imageStorage.hasBase64(category.image)) {
        skipped++;
        continue;
      }

      try {
        await this.migrateCategoryImageIfNeeded(category);
        migrated++;
      } catch (err) {
        failed++;
        errors.push({
          categoryId: category.id,
          slug: category.slug,
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return { total: categories.length, migrated, skipped, failed, errors };
  }

  private stripBase64FromCategory(category: Category): Category {
    category.image = this.imageStorage.stripImageField(category.image);
    return category;
  }

  private async migrateCategoryImageIfNeeded(category: Category): Promise<Category> {
    const { image, changed } = await this.imageStorage.migrateImageField(
      category.image,
      'categories',
    );

    if (changed) {
      category.image = image;
      await this.categoryRepository.update(category.id, { image });
    }

    return this.stripBase64FromCategory(category);
  }
}

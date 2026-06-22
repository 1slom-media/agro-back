import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { ImageStorageService } from '../storage/image-storage.service';

type ImageSlot = 'image1' | 'image2' | 'image3';

const IMAGE_SLOTS: ImageSlot[] = ['image1', 'image2', 'image3'];

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly imageStorage: ImageStorageService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findOne({
      where: { slug: createProductDto.slug },
    });

    if (existingProduct) {
      throw new ConflictException('Product with this slug already exists');
    }

    await this.processProductImages(createProductDto);

    const product = this.productRepository.create(createProductDto);
    const saved = await this.productRepository.save(product);
    return this.stripBase64FromProduct(saved);
  }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResult<Product>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await this.productRepository.findAndCount({
      relations: ['category'],
      skip,
      take: limit,
      order: { order: 'ASC', createdAt: 'DESC' },
    });

    const processed = await Promise.all(
      data.map((product) => this.migrateProductImagesIfNeeded(product)),
    );

    return {
      data: processed,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return this.migrateProductImagesIfNeeded(product);
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { slug },
      relations: ['category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return this.migrateProductImagesIfNeeded(product);
  }

  async findByCategory(categoryId: string, paginationDto?: PaginationDto): Promise<PaginatedResult<Product>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await this.productRepository.findAndCount({
      where: { categoryId },
      relations: ['category'],
      skip,
      take: limit,
      order: { order: 'ASC', createdAt: 'DESC' },
    });

    const processed = await Promise.all(
      data.map((product) => this.migrateProductImagesIfNeeded(product)),
    );

    return {
      data: processed,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
      const existingProduct = await this.productRepository.findOne({
        where: { slug: updateProductDto.slug },
      });

      if (existingProduct) {
        throw new ConflictException('Product with this slug already exists');
      }
    }

    await this.processProductImages(updateProductDto);

    await this.productRepository.update(id, updateProductDto);

    const updatedProduct = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found after update`);
    }

    return this.stripBase64FromProduct(updatedProduct);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  async migrateAllImagesToMinio(): Promise<{
    total: number;
    migrated: number;
    skipped: number;
    failed: number;
    errors: { productId: string; slug: string; message: string }[];
  }> {
    this.imageStorage.ensureEnabled();

    const products = await this.productRepository.find({
      order: { createdAt: 'ASC' },
    });

    let migrated = 0;
    let skipped = 0;
    let failed = 0;
    const errors: { productId: string; slug: string; message: string }[] = [];

    for (const product of products) {
      if (!this.productHasBase64Images(product)) {
        skipped++;
        continue;
      }

      try {
        await this.migrateProductImagesIfNeeded(product);
        migrated++;
      } catch (err) {
        failed++;
        errors.push({
          productId: product.id,
          slug: product.slug,
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return {
      total: products.length,
      migrated,
      skipped,
      failed,
      errors,
    };
  }

  private productHasBase64Images(product: Product): boolean {
    if (this.imageStorage.hasLegacyBase64(product.imageBase64)) {
      return true;
    }

    if (!product.images) {
      return false;
    }

    return IMAGE_SLOTS.some((key) =>
      this.imageStorage.hasBase64(product.images?.[key]),
    );
  }

  private async processProductImages(
    dto: CreateProductDto | UpdateProductDto,
  ): Promise<void> {
    if (!dto.images) {
      // continue to legacy field
    } else {
      for (const key of IMAGE_SLOTS) {
        dto.images[key] = await this.imageStorage.processImageField(
          dto.images[key],
          'products',
        );
      }
    }

    const legacy = await this.imageStorage.processLegacyImage(
      dto.imageBase64,
      dto.imageUrl,
      'products',
    );

    if (legacy.url) {
      dto.imageUrl = legacy.url;
    }

    if (legacy.clearBase64) {
      dto.imageBase64 = undefined;
    }
  }

  private stripBase64FromProduct(product: Product): Product {
    if (product.images) {
      const stripped: Product['images'] = {};
      for (const key of IMAGE_SLOTS) {
        stripped[key] = this.imageStorage.stripImageField(product.images[key]);
      }
      product.images = stripped;
    }

    product.imageBase64 = null as unknown as string;
    return product;
  }

  private async migrateProductImagesIfNeeded(product: Product): Promise<Product> {
    let changed = false;
    const images = product.images ? { ...product.images } : {};

    for (const key of IMAGE_SLOTS) {
      const result = await this.imageStorage.migrateImageField(
        images[key],
        'products',
      );

      if (result.changed) {
        images[key] = result.image;
        changed = true;
      } else if (result.image !== undefined) {
        images[key] = result.image;
      } else {
        delete images[key];
      }
    }

    const legacy = await this.imageStorage.migrateLegacyImage(
      product.imageBase64,
      product.imageUrl,
      'products',
    );

    if (legacy.changed) {
      if (legacy.url) {
        product.imageUrl = legacy.url;
      }
      product.imageBase64 = null as unknown as string;
      changed = true;
    } else if (legacy.clearBase64) {
      product.imageBase64 = null as unknown as string;
      changed = true;
    }

    if (changed) {
      product.images = images;
      await this.productRepository.update(product.id, {
        images,
        imageUrl: product.imageUrl,
        imageBase64: null as unknown as string,
      });
    }

    return this.stripBase64FromProduct(product);
  }
}

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';
import { ImageStorageService } from '../storage/image-storage.service';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,
    private readonly imageStorage: ImageStorageService,
  ) {}

  async create(createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    const existingPost = await this.blogPostRepository.findOne({
      where: { slug: createBlogPostDto.slug },
    });

    if (existingPost) {
      throw new ConflictException('Blog post with this slug already exists');
    }

    await this.processBlogImage(createBlogPostDto);

    const blogPost = this.blogPostRepository.create(createBlogPostDto);
    const saved = await this.blogPostRepository.save(blogPost);
    return this.stripBase64FromBlogPost(saved);
  }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResult<BlogPost>> {
    const { page = 1, limit = 10, isPublished } = paginationDto || {};
    const skip = (page - 1) * limit;

    const where: any = {};
    if (isPublished === 'true') {
      where.isPublished = true;
    } else if (isPublished === 'false') {
      where.isPublished = false;
    }

    const [data, total] = await this.blogPostRepository.findAndCount({
      where: Object.keys(where).length > 0 ? where : undefined,
      skip,
      take: limit,
      order: { publishedAt: 'DESC', createdAt: 'DESC' },
    });

    const processed = await Promise.all(
      data.map((post) => this.migrateBlogImageIfNeeded(post, false)),
    );

    return {
      data: processed,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<BlogPost> {
    const blogPost = await this.blogPostRepository.findOne({ where: { id } });

    if (!blogPost) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    const migrated = await this.migrateBlogImageIfNeeded(blogPost, true);
    migrated.viewCount += 1;
    await this.blogPostRepository.save(migrated);
    return this.stripBase64FromBlogPost(migrated);
  }

  async findBySlug(slug: string): Promise<BlogPost> {
    const blogPost = await this.blogPostRepository.findOne({ where: { slug } });

    if (!blogPost) {
      throw new NotFoundException(`Blog post with slug ${slug} not found`);
    }

    const migrated = await this.migrateBlogImageIfNeeded(blogPost, true);
    migrated.viewCount += 1;
    await this.blogPostRepository.save(migrated);
    return this.stripBase64FromBlogPost(migrated);
  }

  async update(id: string, updateBlogPostDto: UpdateBlogPostDto): Promise<BlogPost> {
    const blogPost = await this.blogPostRepository.findOne({ where: { id } });

    if (!blogPost) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    if (updateBlogPostDto.slug && updateBlogPostDto.slug !== blogPost.slug) {
      const existingPost = await this.blogPostRepository.findOne({
        where: { slug: updateBlogPostDto.slug },
      });

      if (existingPost) {
        throw new ConflictException('Blog post with this slug already exists');
      }
    }

    await this.processBlogImage(updateBlogPostDto);

    Object.assign(blogPost, updateBlogPostDto);
    const saved = await this.blogPostRepository.save(blogPost);
    return this.stripBase64FromBlogPost(saved);
  }

  async remove(id: string): Promise<void> {
    const blogPost = await this.blogPostRepository.findOne({ where: { id } });

    if (!blogPost) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    await this.blogPostRepository.remove(blogPost);
  }

  async migrateAllImagesToMinio(): Promise<{
    total: number;
    migrated: number;
    skipped: number;
    failed: number;
    errors: { postId: string; slug: string; message: string }[];
  }> {
    this.imageStorage.ensureEnabled();

    const posts = await this.blogPostRepository.find({
      order: { createdAt: 'ASC' },
    });

    let migrated = 0;
    let skipped = 0;
    let failed = 0;
    const errors: { postId: string; slug: string; message: string }[] = [];

    for (const post of posts) {
      if (!this.imageStorage.hasLegacyBase64(post.featuredImageBase64)) {
        skipped++;
        continue;
      }

      try {
        await this.migrateBlogImageIfNeeded(post, true);
        migrated++;
      } catch (err) {
        failed++;
        errors.push({
          postId: post.id,
          slug: post.slug,
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return { total: posts.length, migrated, skipped, failed, errors };
  }

  private async processBlogImage(
    dto: CreateBlogPostDto | UpdateBlogPostDto,
  ): Promise<void> {
    const result = await this.imageStorage.processLegacyImage(
      dto.featuredImageBase64,
      dto.featuredImageUrl,
      'blog',
    );

    if (result.url) {
      dto.featuredImageUrl = result.url;
    }

    if (result.clearBase64) {
      dto.featuredImageBase64 = undefined;
    }
  }

  private stripBase64FromBlogPost(blogPost: BlogPost): BlogPost {
    blogPost.featuredImageBase64 = null as unknown as string;
    return blogPost;
  }

  private async migrateBlogImageIfNeeded(
    blogPost: BlogPost,
    persist: boolean,
  ): Promise<BlogPost> {
    const result = await this.imageStorage.migrateLegacyImage(
      blogPost.featuredImageBase64,
      blogPost.featuredImageUrl,
      'blog',
    );

    if (result.changed) {
      if (result.url) {
        blogPost.featuredImageUrl = result.url;
      }
      blogPost.featuredImageBase64 = null as unknown as string;

      if (persist) {
        await this.blogPostRepository.update(blogPost.id, {
          featuredImageUrl: blogPost.featuredImageUrl,
          featuredImageBase64: null as unknown as string,
        });
      }
    }

    return blogPost;
  }
}

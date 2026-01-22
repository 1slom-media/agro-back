import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { PaginationDto, PaginatedResult } from '../common/dto/pagination.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogPostRepository: Repository<BlogPost>,
  ) {}

  async create(createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    const existingPost = await this.blogPostRepository.findOne({
      where: { slug: createBlogPostDto.slug },
    });

    if (existingPost) {
      throw new ConflictException('Blog post with this slug already exists');
    }

    const blogPost = this.blogPostRepository.create(createBlogPostDto);
    return this.blogPostRepository.save(blogPost);
  }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResult<BlogPost>> {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const [data, total] = await this.blogPostRepository.findAndCount({
      where: { isPublished: true },
      skip,
      take: limit,
      order: { publishedAt: 'DESC', createdAt: 'DESC' },
    });

    return {
      data,
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

    // Increment view count
    blogPost.viewCount += 1;
    await this.blogPostRepository.save(blogPost);

    return blogPost;
  }

  async findBySlug(slug: string): Promise<BlogPost> {
    const blogPost = await this.blogPostRepository.findOne({ where: { slug } });

    if (!blogPost) {
      throw new NotFoundException(`Blog post with slug ${slug} not found`);
    }

    // Increment view count
    blogPost.viewCount += 1;
    await this.blogPostRepository.save(blogPost);

    return blogPost;
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

    Object.assign(blogPost, updateBlogPostDto);
    return this.blogPostRepository.save(blogPost);
  }

  async remove(id: string): Promise<void> {
    const blogPost = await this.blogPostRepository.findOne({ where: { id } });

    if (!blogPost) {
      throw new NotFoundException(`Blog post with ID ${id} not found`);
    }

    await this.blogPostRepository.remove(blogPost);
  }
}

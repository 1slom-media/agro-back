import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('blog_posts')
export class BlogPost extends BaseEntity {
  @Column({ type: 'jsonb' })
  title: {
    uz: string;
    ru: string;
    en: string;
  };

  @Column({ type: 'jsonb' })
  content: {
    uz: string;
    ru: string;
    en: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  excerpt: {
    uz: string;
    ru: string;
    en: string;
  };

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  featuredImageBase64: string;

  @Column({ nullable: true })
  featuredImageUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  seo: {
    metaTitle?: { uz: string; ru: string; en: string };
    metaDescription?: { uz: string; ru: string; en: string };
    keywords?: string[];
    ogImage?: string;
  };

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ default: false })
  isPublished: boolean;

  @Column({ type: 'timestamp', nullable: true })
  publishedAt: Date;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ nullable: true })
  authorId: string;
}


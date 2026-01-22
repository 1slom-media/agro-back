import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product extends BaseEntity {
  @Column({ type: 'jsonb' })
  name: {
    uz: string;
    ru: string;
    en: string;
  };

  @Column({ type: 'jsonb' })
  description: {
    uz: string;
    ru: string;
    en: string;
  };

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'jsonb', nullable: true })
  images: {
    image1?: {
      base64?: string;
      url?: string;
    };
    image2?: {
      base64?: string;
      url?: string;
    };
    image3?: {
      base64?: string;
      url?: string;
    };
  };

  // Deprecated: kept for backward compatibility
  @Column({ type: 'text', nullable: true })
  imageBase64: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  specifications: {
    temperature?: string;
    density?: string;
    width?: string;
    length?: string;
    sellType?: string; // 'za_rulot' or 'za_paket'
    [key: string]: any;
  };

  @Column()
  categoryId: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: 0 })
  order: number;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];
}


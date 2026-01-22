import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('categories')
export class Category extends BaseEntity {
  @Column({ type: 'jsonb' })
  name: {
    uz: string;
    ru: string;
    en: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  description: {
    uz: string;
    ru: string;
    en: string;
  };

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'jsonb', nullable: true })
  image?: {
    base64?: string;
    url?: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  order: number;
}


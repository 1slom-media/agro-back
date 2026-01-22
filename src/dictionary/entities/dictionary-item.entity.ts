import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export enum DictionaryType {
  TEMPERATURE = 'temperature',
  DENSITY = 'density',
  COLOR = 'color',
  SIZE = 'size',
  LENGTH = 'length',
  SELLTYPE = 'selltype',
}

@Entity('dictionary_items')
@Index(['type', 'value'], { unique: true })
export class DictionaryItem extends BaseEntity {
  @Column({ type: 'varchar' })
  type: DictionaryType;

  @Column({ type: 'varchar' })
  value: string;

  @Column({ type: 'jsonb' })
  label: {
    uz: string;
    ru: string;
    en: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  order: number;
}



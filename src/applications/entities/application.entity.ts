import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export enum ApplicationStatus {
  NEW = 'new',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ApplicationType {
  CONTACT = 'contact',
  QUOTE = 'quote',
  CONSULTATION = 'consultation',
  OTHER = 'other',
}

@Entity('applications')
export class Application extends BaseEntity {
  @Column()
  name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({
    type: 'enum',
    enum: ApplicationType,
    default: ApplicationType.CONTACT,
  })
  type: ApplicationType;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.NEW,
  })
  status: ApplicationStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    productId?: string;
    categoryId?: string;
    source?: string;
    [key: string]: any;
  };

  @Column({ type: 'text', nullable: true })
  adminNotes: string;

  @Column({ default: false })
  isRead: boolean;
}


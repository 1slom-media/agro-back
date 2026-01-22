import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DictionaryItem, DictionaryType } from './entities/dictionary-item.entity';
import { CreateDictionaryItemDto } from './dto/create-dictionary-item.dto';
import { UpdateDictionaryItemDto } from './dto/update-dictionary-item.dto';

@Injectable()
export class DictionaryService {
  constructor(
    @InjectRepository(DictionaryItem)
    private readonly repo: Repository<DictionaryItem>,
  ) {}

  async findAll() {
    return this.repo.find({
      order: { type: 'ASC', order: 'ASC', createdAt: 'ASC' },
    });
  }

  async list(type: DictionaryType, onlyActive = true) {
    const where: any = { type };
    if (onlyActive) where.isActive = true;

    return this.repo.find({
      where,
      order: { order: 'ASC', createdAt: 'ASC' },
    });
  }

  async create(dto: CreateDictionaryItemDto) {
    const existing = await this.repo.findOne({ where: { type: dto.type, value: dto.value } });
    if (existing) {
      throw new ConflictException('Dictionary item already exists');
    }
    const item = this.repo.create(dto as any);
    return this.repo.save(item);
  }

  async update(id: string, dto: UpdateDictionaryItemDto) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Dictionary item not found');

    if ((dto.type && dto.type !== item.type) || (dto.value && dto.value !== item.value)) {
      const type = (dto.type ?? item.type) as DictionaryType;
      const value = dto.value ?? item.value;
      const existing = await this.repo.findOne({ where: { type, value } });
      if (existing && existing.id !== id) {
        throw new ConflictException('Dictionary item already exists');
      }
    }

    Object.assign(item, dto);
    return this.repo.save(item);
  }

  async remove(id: string) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) throw new NotFoundException('Dictionary item not found');
    await this.repo.remove(item);
    return { ok: true };
  }

  async getFilters() {
    const [temperature, density, color, size, length, selltype] = await Promise.all([
      this.list(DictionaryType.TEMPERATURE, true),
      this.list(DictionaryType.DENSITY, true),
      this.list(DictionaryType.COLOR, true),
      this.list(DictionaryType.SIZE, true),
      this.list(DictionaryType.LENGTH, true),
      this.list(DictionaryType.SELLTYPE, true),
    ]);

    return { temperature, density, color, size, length, selltype };
  }
}



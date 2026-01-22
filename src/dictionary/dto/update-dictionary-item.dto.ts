import { PartialType } from '@nestjs/mapped-types';
import { CreateDictionaryItemDto } from './create-dictionary-item.dto';

export class UpdateDictionaryItemDto extends PartialType(CreateDictionaryItemDto) {}



import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiJwtAuth } from '../auth/decorators/api-jwt-auth.decorator';
import { UserRole } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiJwtAuth()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(
      createUserDto.username,
      createUserDto.email,
      createUserDto.password,
      createUserDto.role || UserRole.MANAGER,
    );
    
    if (createUserDto.isActive !== undefined) {
      user.isActive = createUserDto.isActive;
      await this.usersService.update(user.id, { isActive: createUserDto.isActive });
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  @ApiJwtAuth()
  @Get()
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    const users = await this.usersService.findAll();
    
    const pageNum = page ? Number.parseInt(page.toString()) : 1;
    const limitNum = limit ? Number.parseInt(limit.toString()) : 10;
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;
    
    return {
      data: users.slice(start, end),
      total: users.length,
      page: pageNum,
      limit: limitNum,
    };
  }

  @ApiJwtAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  @ApiJwtAuth()
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  @ApiJwtAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}


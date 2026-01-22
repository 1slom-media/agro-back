import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { UserRole } from './entities/user.entity';

@Injectable()
export class UsersSeedService implements OnModuleInit {
  private readonly logger = new Logger(UsersSeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedDefaultAdmin();
  }

  private async seedDefaultAdmin() {
    const adminUsername = this.configService.get<string>('ADMIN_USERNAME') || 'islom_01';
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD') || 'admin123';
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'admin@agrovolokno.uz';

    try {
      const existingAdmin = await this.usersService.findByUsername(adminUsername);

      if (!existingAdmin) {
        await this.usersService.create(
          adminUsername,
          adminEmail,
          adminPassword,
          UserRole.ADMIN,
        );
        this.logger.log(`✅ Default admin user created: ${adminUsername}`);
      } else {
        this.logger.log(`ℹ️  Default admin user already exists: ${adminUsername}`);
      }
    } catch (error) {
      this.logger.error(`❌ Failed to seed default admin user: ${error.message}`);
    }
  }
}


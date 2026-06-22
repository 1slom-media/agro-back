import { Controller, Post, Body, Get } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from './decorators/public.decorator';
import { ApiJwtAuth } from './decorators/api-jwt-auth.decorator';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login and get JWT accessToken' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'Copy accessToken value only (without Bearer) into Swagger Authorize',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '00000000-0000-0000-0000-000000000001',
          username: 'islom_01',
          email: 'admin@agrovolokno.uz',
          role: 'admin',
        },
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiJwtAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile (test token here first)' })
  async getProfile(@CurrentUser() user: any) {
    return this.authService.validateUser(user.userId);
  }
}

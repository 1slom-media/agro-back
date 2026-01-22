import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot = require('node-telegram-bot-api');

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);
  private bot: TelegramBot | null = null;
  private adminChatId: string | null = null;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN') || '7977660464:AAH6PswsH37TrYwzzGTP9Vj5PwyzwIMPgII';
    this.adminChatId = this.configService.get<string>('TELEGRAM_ADMIN_CHAT_ID') || '-1001216798477';

    if (!token) {
      this.logger.warn('⚠️  Telegram bot token not configured. Bot will not start.');
      return;
    }

    try {
      this.bot = new TelegramBot(token, { polling: true });
      this.setupCommands();
      this.logger.log('✅ Telegram bot initialized successfully');
    } catch (error) {
      this.logger.error(`❌ Failed to initialize Telegram bot: ${error.message}`);
    }
  }

  private setupCommands() {
    if (!this.bot) return;

    // /start command with web-app button
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      // Use environment variable or default to production URL
      // For localhost, web-app won't work (Telegram requires HTTPS)
      const webAppUrl = process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://sunagro.uz';
      
      // Check if URL is localhost - if so, don't show web-app button
      const isLocalhost = webAppUrl.includes('localhost') || webAppUrl.includes('127.0.0.1');
      
      const messageText = '👋 Xush kelibsiz! SunAgro botiga!\n\n' +
        (isLocalhost 
          ? '⚠️ Web-app faqat production serverda ishlaydi (HTTPS talab qilinadi).\n\n'
          : 'Bizning saytimizni ochish uchun quyidagi tugmani bosing:\n\n'
        ) +
        'Buyruqlar:\n' +
        '/stats - Statistika\n' +
        '/help - Yordam';

      const replyMarkup: any = {};
      
      if (!isLocalhost) {
        replyMarkup.inline_keyboard = [
          [
            {
              text: '🌐 Saytni ochish',
              web_app: { url: webAppUrl }
            }
          ]
        ];
      }

      this.bot!.sendMessage(
        chatId,
        messageText,
        Object.keys(replyMarkup).length > 0 ? { reply_markup: replyMarkup } : {}
      );
    });

    // /stats command
    this.bot.onText(/\/stats/, async (msg) => {
      const chatId = msg.chat.id;
      this.bot!.sendMessage(chatId, '📊 Statistika yuklanmoqda...');
      // Stats will be implemented when connected to services
    });

    // /help command
    this.bot.onText(/\/help/, (msg) => {
      const chatId = msg.chat.id;
      this.bot!.sendMessage(
        chatId,
        '📖 Yordam:\n\n' +
          '/start - Botni ishga tushirish\n' +
          '/stats - Statistikani ko\'rish\n' +
          '/help - Yordam',
      );
    });
  }

  async sendNotification(message: string): Promise<void> {
    if (!this.bot || !this.adminChatId) {
      this.logger.warn('Telegram bot or admin chat ID not configured');
      return;
    }

    try {
      await this.bot.sendMessage(this.adminChatId, message, { parse_mode: 'HTML' });
      this.logger.log('✅ Notification sent to Telegram');
    } catch (error) {
      this.logger.error(`❌ Failed to send Telegram notification: ${error.message}`);
    }
  }

  async sendNewApplicationNotification(application: any): Promise<void> {
    const typeLabels: Record<string, { uz: string; ru: string; en: string }> = {
      contact: { uz: 'Aloqa', ru: 'Контакт', en: 'Contact' },
      quote: { uz: 'Narx so\'rovi', ru: 'Запрос цены', en: 'Quote Request' },
      consultation: { uz: 'Maslahat', ru: 'Консультация', en: 'Consultation' },
      other: { uz: 'Boshqa', ru: 'Другое', en: 'Other' },
    };

    const statusLabels: Record<string, { uz: string; ru: string; en: string }> = {
      new: { uz: 'Yangi', ru: 'Новый', en: 'New' },
      in_progress: { uz: 'Jarayonda', ru: 'В процессе', en: 'In Progress' },
      completed: { uz: 'Yakunlangan', ru: 'Завершено', en: 'Completed' },
    };

    const type = typeLabels[application.type] || typeLabels.other;
    const status = statusLabels[application.status] || statusLabels.new;

    // Format metadata if exists
    let metadataText = '';
    if (application.metadata) {
      const meta = application.metadata;
      if (meta.productName) metadataText += `\n📦 Mahsulot: ${meta.productName}`;
      if (meta.productSlug) metadataText += `\n🔗 Slug: ${meta.productSlug}`;
      if (meta.quantity) metadataText += `\n📏 Miqdor: ${meta.quantity}`;
      if (meta.categoryId) metadataText += `\n📁 Kategoriya ID: ${meta.categoryId}`;
    }

    const message =
      `🆕 <b>YANGI ARIZA</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `📋 <b>Tur:</b> ${type.ru}\n` +
      `📊 <b>Holat:</b> ${status.ru}\n\n` +
      `👤 <b>Mijoz:</b> ${application.name}\n` +
      `📱 <b>Telefon:</b> <code>${application.phone}</code>\n` +
      `${application.email ? `📧 <b>Email:</b> ${application.email}\n` : ''}` +
      `\n💬 <b>Xabar:</b>\n${application.message || 'Xabar yo\'q'}` +
      `${metadataText}` +
      `\n\n📅 <b>Sana:</b> ${new Date(application.createdAt).toLocaleString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}`;

    await this.sendNotification(message);
  }
}

import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import mysql, { RowDataPacket } from 'mysql2/promise';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private pool: mysql.Pool;

  constructor(private readonly configService: ConfigService) {
    const dbUrl = this.configService.get<string>('DATABASE_URL');

    if (!dbUrl) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    const parsedUrl = new URL(dbUrl);

    this.pool = mysql.createPool({
      host: parsedUrl.hostname,
      user: parsedUrl.username,
      password: parsedUrl.password,
      port: Number(parsedUrl.port) || 3306,
      database: parsedUrl.pathname.replace('/', ''),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  // ✅ Fixed generic type constraint
  async query<T extends RowDataPacket[]>(sql: string, params?: any[]): Promise<T> {
    const [rows] = await this.pool.execute<T>(sql, params);
    return rows;
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}

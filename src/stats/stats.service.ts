import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IAdminStats } from './utils/types/admin.type';

@Injectable()
export class StatsService {
  constructor(private dataSource: DataSource) {}

  async getAdminStats(): Promise<IAdminStats> {
    const [calls, solutions, users, unpublishedCalls, publishedCalls] = await Promise.all([
      this.dataSource.query('SELECT COUNT(*) as count FROM call_solution'),
      this.dataSource.query('SELECT COUNT(*) as count FROM solution'),
      this.dataSource.query('SELECT COUNT(*) as count FROM user'),
      this.dataSource.query('SELECT COUNT(*) as count FROM call_solution WHERE published_at IS NULL'),
      this.dataSource.query('SELECT COUNT(*) as count FROM call_solution WHERE published_at IS NOT NULL')
    ]);
    return {
      calls: calls[0].count,
      solutions: solutions[0].count,
      users: users[0].count,
      unpublishedCalls: unpublishedCalls[0].count,
      publishedCalls: publishedCalls[0].count
    };
  }
}

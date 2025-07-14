import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IAdminStats } from './utils/types/admin.type';

@Injectable()
export class StatsService {
  constructor(private dataSource: DataSource) {}

  async getAdminStats(): Promise<IAdminStats> {
    const result = await this.dataSource.query(`SELECT 
        (SELECT COUNT(*) FROM call_solution) AS calls,
        (SELECT COUNT(*) FROM solution WHERE deleted_at IS NULL) AS solutions,
        (SELECT COUNT(*) FROM user WHERE deleted_at IS NULL) AS users,
        (SELECT COUNT(*) FROM call_solution WHERE published_at IS NULL) AS unpublishedCalls,
        (SELECT COUNT(*) FROM call_solution WHERE published_at IS NOT NULL) AS publishedCalls
    `);
    return result[0];
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configServie: ConfigService) => ({
        type: 'mariadb',
        port: +configServie.get('DB_PORT'),
        host: configServie.get('DB_HOST'),
        username: configServie.get('DB_USERNAME'),
        // subscribers: ['dist/**/*.subscriber.js'],
        password: configServie.get('DB_PASSWORD'),
        database: configServie.get('DB_NAME'),
        synchronize: false,
        autoLoadEntities: true
      })
    }),
    TypeOrmModule.forRootAsync({
      name: 'v1',
      useFactory: (configServie: ConfigService) => ({
        type: 'mariadb',
        port: +configServie.get('DB_PORT'),
        host: configServie.get('DB_HOST'),
        username: configServie.get('DB_USERNAME'),
        password: configServie.get('DB_PASSWORD'),
        database: configServie.get('DB_V1_NAME'),
        synchronize: false,
        autoLoadEntities: true
      }),
      inject: [ConfigService]
    })
  ]
})
export class DatabaseModule {}

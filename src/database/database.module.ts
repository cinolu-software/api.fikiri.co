import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/v1-user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configServie: ConfigService) => ({
        type: 'mariadb',
        port: +configServie.get('DB_PORT'),
        host: configServie.get('DB_HOST'),
        username: configServie.get('DB_USERNAME'),
        subscribers: ['dist/**/*.subscriber.js'],
        password: configServie.get('DB_PASSWORD'),
        database: configServie.get('DB_NAME'),
        synchronize: false,
        autoLoadEntities: true
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forRootAsync({
      name: 'v1',
      useFactory: (configServie: ConfigService) => ({
        type: 'mariadb',
        port: +configServie.get('DB_PORT'),
        host: configServie.get('DB_HOST'),
        username: configServie.get('DB_USERNAME'),
        subscribers: ['dist/**/*.subscriber.js'],
        password: configServie.get('DB_PASSWORD'),
        database: configServie.get('DB_V1_NAME'),
        synchronize: false,
        entities: [User]
      }),
      inject: [ConfigService]
    })
  ]
})
export class DatabaseModule {}

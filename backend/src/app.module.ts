import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 6024,
      username: 'langchain',
      password: 'langchain',
      database: 'langchain',
      autoLoadEntities: true,
      synchronize: true, // Disable in production
    }),
    AuthModule,
    UsersModule,
    DocumentsModule,
  ],
})
export class AppModule {}

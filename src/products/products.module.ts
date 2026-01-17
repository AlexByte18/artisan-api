import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product, ProductImage } from './entities'
import { FilesService } from 'src/files/files.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, FilesService, ConfigService],
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage
    ])
  ],
  exports: [
    ProductsService,
    TypeOrmModule
  ]
})
export class ProductsModule {}

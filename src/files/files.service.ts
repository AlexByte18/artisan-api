import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  
  constructor(
    private readonly configService: ConfigService
  ) {}

  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../static/products', imageName)

    if ( !existsSync(path) ) 
    throw new BadRequestException(`No product found with image ${imageName}`)

    return path
  }

  getUrlProductImage(imageName: string) {
    return `${this.configService.get('HOST_API')}/files/product/${ imageName }`;
  }
}

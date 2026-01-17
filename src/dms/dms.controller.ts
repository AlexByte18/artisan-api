import { AiService } from './ai.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { DmsService } from './dms.service';
import { FileInterceptor } from '@nestjs/platform-express';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

@Controller('dms')
export class DmsController {
  constructor(
    private readonly dmsService: DmsService,
    private readonly aiService: AiService,
  ) {}

  @Post('/file')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/jpeg'}),
          new MaxFileSizeValidator({
            maxSize: MAX_FILE_SIZE,
            message: 'File is too large. Max file size is 10MB',
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Body('isPublic') isPublic: string,
  ) {
    const isPublicBool = isPublic === 'true' ? true : false;
    const {key} = await this.dmsService.uploadSingleFile({ file, isPublic: isPublicBool });
    const suggestions = await this.aiService.suggestProductInfo(key)

    return {
      key,
      suggestions,
    }
  }

  @Get(':key')
  async getFileUrl(@Param('key') key: string) {
    return this.dmsService.getFileUrl(key);
  }

  @Get('/signed-url/:key')
  async getPresignedUrl(@Param('key') key: string) {
    return this.dmsService.getPresingnedUrl(key);
  }

  @Delete(':key')
  async deleteFile(@Param('key') key: string) {
    return this.dmsService.deleteFile(key);
  }
}

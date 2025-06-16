import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
  Param,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer, fileDestination, fileFilter } from './helpers/';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Post('upload/:folder')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
      },
      storage: diskStorage({
        destination: fileDestination,
        filename: fileNamer,
      }),
      preservePath: false,
    }),
  )
  uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
    @Param('folder') folder: string,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    const secureUrl = `${this.configService.get<string>('HOST_URL')}/api/files/${folder}?name=${file.filename}`;

    return { secureUrl };
  }

  @Get('/:folder')
  getStaticFiles(
    @Res() res: Response,
    @Query('name') name: string,
    @Param('folder') folder: string,
  ) {
    const { filePath } = this.filesService.getStaticFiles(name, folder);
    return res.sendFile(filePath);
  }
}

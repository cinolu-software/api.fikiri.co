import { Controller, Delete, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { GalleriesService } from './galleries.service';
import { diskStorage } from 'multer';
import { Auth } from 'src/shared/decorators/auth.decorators';
import { RoleEnum } from 'src/shared/enums/roles.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { CallGallery } from './entities/gallery.entity';

@Controller('calls-galeries')
export class GaleriesController {
  constructor(private readonly galeriesService: GalleriesService) {}

  @Post(':id')
  @Auth(RoleEnum.Cartograph)
  @UseInterceptors(
    FilesInterceptor('thumbs', 5, {
      storage: diskStorage({
        destination: './uploads/calls',
        filename: function (_req, file, cb) {
          cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
        }
      })
    })
  )
  addImage(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]): Promise<CallGallery[]> {
    return this.galeriesService.addImage(id, files);
  }

  @Delete(':id')
  @Auth(RoleEnum.Cartograph)
  deleteImage(@Param('id') id: string): Promise<void> {
    return this.galeriesService.deleteImage(id);
  }
}

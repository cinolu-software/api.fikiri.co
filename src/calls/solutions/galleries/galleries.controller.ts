import { Controller, Delete, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { GalleriesService } from './galleries.service';
import { diskStorage } from 'multer';
import { Auth } from 'src/shared/decorators/auth.decorators';
import { RoleEnum } from 'src/shared/enums/roles.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';
import { SolutionGallery } from './entities/gallery.entity';

@Controller('solutions-galeries')
export class GalleriesController {
  constructor(private galeriesService: GalleriesService) {}

  @Post(':id')
  @Auth(RoleEnum.User)
  @UseInterceptors(
    FilesInterceptor('thumbs', 5, {
      storage: diskStorage({
        destination: './uploads/solutions',
        filename: function (_req, file, cb) {
          cb(null, `${uuidv4()}.${file.mimetype.split('/')[1]}`);
        }
      })
    })
  )
  addImage(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]): Promise<SolutionGallery[]> {
    return this.galeriesService.addImage(id, files);
  }

  @Delete(':id')
  @Auth(RoleEnum.User)
  deleteImage(@Param('id') id: string): Promise<void> {
    return this.galeriesService.deleteImage(id);
  }
}

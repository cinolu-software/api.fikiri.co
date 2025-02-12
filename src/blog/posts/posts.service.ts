import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import * as fs from 'fs-extra';
import { QueryParams } from './utils/query-params.type';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>
  ) {}

  async create(user: User, dto: CreatePostDto): Promise<Post> {
    try {
      return await this.postRepository.save({
        ...dto,
        author: { id: user.id },
        category: { id: dto.category }
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepository.find({
      relations: ['category'],
      order: { created_at: 'DESC' }
    });
  }

  async publish(id: string): Promise<Post> {
    try {
      const post = await this.findOne(id);
      post.published_at = post.published_at ? null : new Date();
      return await this.postRepository.save(post);
    } catch {
      throw new BadRequestException();
    }
  }

  async findPublished(queryParams: QueryParams): Promise<[Post[], number]> {
    const { page = 1, category } = queryParams;
    const take = 12;
    const skip = (page - 1) * take;
    const where = { published_at: Not(IsNull()) };
    if (category) where['category'] = { category };
    return await this.postRepository.findAndCount({
      where,
      take,
      skip,
      relations: ['category'],
      order: { created_at: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Post> {
    try {
      return await this.postRepository.findOneOrFail({
        where: { id },
        relations: ['comments', 'author', 'category']
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async uploadImage(id: string, file: Express.Multer.File): Promise<Post> {
    try {
      const post = await this.findOne(id);
      if (post.image) await fs.unlink(`./uploads/posts/${post.image}`);
      return await this.postRepository.save({ ...post, image: file.filename });
    } catch {
      throw new BadRequestException();
    }
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    try {
      const post = await this.findOne(id);
      return await this.postRepository.save({
        ...dto,
        author: { id: post.author.id },
        category: { id: dto?.category ?? post.category.id }
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.findOne(id);
      await this.postRepository.softDelete(id);
    } catch {
      throw new BadRequestException();
    }
  }
}

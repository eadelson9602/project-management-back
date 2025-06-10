import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { createTestApp } from '../test.config';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let usersService: UsersService;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(UsersService)
      .useValue({
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
      })
      .overrideProvider(getRepositoryToken(User))
      .useValue({
        create: jest.fn(),
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    usersService = moduleFixture.get<UsersService>(UsersService);
    usersRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const userDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const result = {
        id: 1,
        ...userDto,
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(result);

      return request(app.getHttpServer())
        .post('/users')
        .send(userDto)
        .expect(201)
        .expect({
          id: expect.any(Number),
          email: userDto.email,
          name: userDto.name,
        });
    });
  });

  describe('GET /users', () => {
    it('should return all users', async () => {
      const users = [
        { id: 1, email: 'user1@example.com', name: 'User 1' },
        { id: 2, email: 'user2@example.com', name: 'User 2' },
      ];

      jest.spyOn(usersService, 'findAll').mockResolvedValue(users);

      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect({
          data: users,
        });
    });
  });
});

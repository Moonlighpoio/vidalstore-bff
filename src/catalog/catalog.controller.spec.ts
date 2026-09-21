import { Test, TestingModule } from '@nestjs/testing';
import type { Request } from 'express';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

describe('CatalogController', () => {
  let controller: CatalogController;

  const mockRequest = (): Request => ({
    headers: { authorization: 'Bearer test-token' },
    user: { sub: 'user-123', groups: ['editores'] },
  } as unknown as Request);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [
        {
          provide: CatalogService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CatalogController>(CatalogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all catalog items', () => {
    const mockResult = [{ id: '1', name: 'Game 1' }];
    jest
      .spyOn(controller['catalogService'], 'findAll')
      .mockReturnValue(mockResult as any);

    expect(
      controller.findAll(mockRequest()),
    ).toEqual(mockResult);
  });

  it('should return one catalog item by id', () => {
    const mockResult = { id: '1', name: 'Game 1' };
    jest
      .spyOn(controller['catalogService'], 'findOne')
      .mockReturnValue(mockResult as any);

    expect(
      controller.findOne('1', mockRequest()),
    ).toEqual(mockResult);
  });

  it('should create a catalog item', () => {
    const mockBody = { name: 'New Game' };
    const mockResult = { id: '1', ...mockBody };
    jest
      .spyOn(controller['catalogService'], 'create')
      .mockReturnValue(mockResult as any);

    expect(
      controller.create(mockBody, mockRequest()),
    ).toEqual(mockResult);
  });

  it('should update a catalog item', () => {
    const mockBody = { name: 'Updated Game' };
    const mockResult = { id: '1', ...mockBody };
    jest
      .spyOn(controller['catalogService'], 'update')
      .mockReturnValue(mockResult as any);

    expect(
      controller.update('1', mockBody, mockRequest()),
    ).toEqual(mockResult);
  });
});
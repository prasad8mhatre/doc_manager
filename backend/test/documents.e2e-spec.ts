import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from '../src/documents/documents.controller';
import { DocumentsService } from '../src/documents/documents.service';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { UnauthorizedException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../src/auth/auth.guard';
import { of } from 'rxjs';
import { Express } from 'express';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let documentsService: DocumentsService;
  let jwtService: JwtService;
  let httpService: HttpService;

  beforeEach(async () => {
    // Create mock implementations for the services
    const mockDocumentsService = {
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const mockJwtService = {
      verify: jest.fn(),
    };

    const mockHttpService = {
      post: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        { provide: DocumentsService, useValue: mockDocumentsService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: HttpService, useValue: mockHttpService },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    documentsService = module.get<DocumentsService>(DocumentsService);
    jwtService = module.get<JwtService>(JwtService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('findAll', () => {
    it('should throw UnauthorizedException if no Authorization header', async () => {
      const headers = {};

      await expect(controller.findAll(headers)).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const headers = { authorization: 'Bearer invalidToken' };

      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(controller.findAll(headers)).rejects.toThrowError(UnauthorizedException);
    });

    it('should return documents when a valid token is provided', async () => {
      const headers = { authorization: 'Bearer validToken' };
      const mockDecodedToken = { sub: 'user123' };
      const documents = [{ id: 1, name: 'Test Document',filename:'filename', docId:'docId', uploadedBy:3, createdAt : new Date()}];

      jest.spyOn(jwtService, 'verify').mockReturnValue(mockDecodedToken);
      jest.spyOn(documentsService, 'findAll').mockResolvedValue(documents);

      const result = await controller.findAll(headers);
      expect(result).toEqual(documents);
    });
  });

  describe('create', () => {
    it('should throw UnauthorizedException if no Authorization header', async () => {
      const headers = {};
      const file = Express.Multer.File;

      await expect(controller.create(file, headers)).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const headers = { authorization: 'Bearer invalidToken' };
      const file = { originalname: 'testFile.txt', buffer: Buffer.from('file data') };

      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(controller.create(file, headers)).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw BadRequestException if no file is uploaded', async () => {
      const headers = { authorization: 'Bearer validToken' };
      const file = null;

      await expect(controller.create(file, headers)).rejects.toThrowError(BadRequestException);
    });

    it('should call sendFileToIngestAPI and create document successfully', async () => {
      const headers = { authorization: 'Bearer validToken' };
      const file = { originalname: 'testFile.txt', buffer: Buffer.from('file data') };
      const mockDecodedToken = { sub: 'user123' };
      const mockIngestResponse = { docId: '12345' };

      jest.spyOn(jwtService, 'verify').mockReturnValue(mockDecodedToken);
      jest.spyOn(httpService, 'post').mockResolvedValue({ data: mockIngestResponse });
      jest.spyOn(documentsService, 'create').mockResolvedValue({ id: 1, ...file });

      const result = await controller.create(file, headers);
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('file');
      expect(result).toHaveProperty('uploadedBy', mockDecodedToken.sub);
    });
  });

  describe('update', () => {
    it('should update a document successfully', async () => {
      const updateDocumentDto = { file: 'newFile.txt' };
      const documentId = '1';
      jest.spyOn(documentsService, 'update').mockResolvedValue({ id: documentId, ...updateDocumentDto });

      const result = await controller.update(documentId, updateDocumentDto);
      expect(result).toHaveProperty('id', documentId);
      expect(result).toHaveProperty('file', updateDocumentDto.file);
    });
  });

  describe('remove', () => {
    it('should remove a document successfully', async () => {
      const documentId = '1';
      jest.spyOn(documentsService, 'remove').mockResolvedValue({ id: documentId });

      const result = await controller.remove(documentId);
      expect(result).toHaveProperty('id', documentId);
    });
  });
});

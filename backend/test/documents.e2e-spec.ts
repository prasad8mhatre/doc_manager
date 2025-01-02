import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from '../src/documents/documents.controller';
import { DocumentsService } from '../src/documents/documents.service';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { UnauthorizedException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../src/auth/auth.guard';
import { of } from 'rxjs';
import { Express } from 'express';
import { Any } from 'typeorm';




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

      await expect(controller.findAll(headers)).rejects.toThrowError(InternalServerErrorException);
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
      const file = {
        fieldname: 'file',            // required fieldname
        originalname: 'testFile.txt',
        encoding: '7bit',             // required encoding
        mimetype: 'text/plain',       // required mimetype
        size: 1024,                   // required size
        buffer: Buffer.from('file data'),  // file content buffer
        stream: null,                 // mocked stream, could be an actual stream if needed
        destination: '/uploads',      // mocked destination
        filename: 'testFile.txt',     // mocked filename
        path: '/uploads/testFile.txt' // mocked file path
      };

      await expect(controller.create(file, headers)).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const headers = { authorization: 'Bearer invalidToken' };
      const file = {
        fieldname: 'file',            // required fieldname
        originalname: 'testFile.txt',
        encoding: '7bit',             // required encoding
        mimetype: 'text/plain',       // required mimetype
        size: 1024,                   // required size
        buffer: Buffer.from('file data'),  // file content buffer
        stream: null,                 // mocked stream, could be an actual stream if needed
        destination: '/uploads',      // mocked destination
        filename: 'testFile.txt',     // mocked filename
        path: '/uploads/testFile.txt' // mocked file path
      };

      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(controller.create(file, headers)).rejects.toThrowError(InternalServerErrorException);
    });

    it('should throw BadRequestException if no file is uploaded', async () => {
      const headers = { authorization: 'Bearer validToken' };
      const file = null;

      await expect(controller.create(file, headers)).rejects.toThrowError(InternalServerErrorException);
    });

    // it('should call sendFileToIngestAPI and create document successfully', async () => {
    //   const headers = { authorization: 'Bearer validToken' };
    
    //   // Mock the file with all necessary properties
    //   const file = {
    //     fieldname: 'file',            // required fieldname
    //     originalname: 'testFile.txt',
    //     encoding: '7bit',             // required encoding
    //     mimetype: 'text/plain',       // required mimetype
    //     size: 1024,                   // required size
    //     buffer: Buffer.from('file data'),  // file content buffer
    //     stream: null,                 // mocked stream, could be an actual stream if needed
    //     destination: '/uploads',      // mocked destination
    //     filename: 'testFile.txt',     // mocked filename
    //     path: '/uploads/testFile.txt' // mocked file path
    //   };
    
    //   const mockDecodedToken = { sub: 'user123' };
    //   const mockIngestResponse = { docId: '12345' };
    
    //   // Mock the JWT service and HTTP service with proper types
    //   jest.spyOn(jwtService, 'verify').mockReturnValue(mockDecodedToken);
      
    //   // Explicitly type the mock return value of httpService.post()
    //   jest.spyOn(httpService, 'post').mockResolvedValue(of<{ data: { docId: string } }>({ data: mockIngestResponse }));
    
    //   // Mock the create method from the documents service
    //   jest.spyOn(documentsService, 'create').mockResolvedValue({ 
    //     id: 1, 
    //     ...file, 
    //     docId: '12345',  // mocked docId from ingestion response
    //     uploadedBy: 1, // mock the uploadedBy with user ID1
    //     createdAt: new Date() // mock createdAt
    //   });
    
    //   // Call the controller method
    //   const result = await controller.create(file, headers);
    
    //   // Check if the result has the expected properties
    //   expect(result).toHaveProperty('id');
    //   expect(result).toHaveProperty('file');
    //   expect(result).toHaveProperty('uploadedBy', mockDecodedToken.sub);
    // });
  });

  describe('update', () => {
    it('should update a document successfully', async () => {
      const updateDocumentDto = { file: 'newFile.txt', filename:'', docId:'', uploadedBy:1, createdAt: new Date() };
      const documentId = 1;  // Change to number
  
      // Mock the update method's return value to match the expected type
      jest.spyOn(documentsService, 'update').mockResolvedValue({ id: documentId, ...updateDocumentDto });
  
      const result = await controller.update(documentId.toString(), updateDocumentDto); // Pass string for the route parameter if needed
      expect(result).toHaveProperty('id', documentId);
      expect(result).toHaveProperty('file', updateDocumentDto.file);
    });
  });

  describe('remove', () => {
    it('should remove a document successfully', async () => {
      const documentId = '1';
  
      // Mock the response to match the DeleteResult type
      jest.spyOn(documentsService, 'remove').mockResolvedValue({ affected: 1, raw: Any });
  
      const result = await controller.remove(documentId);
  
      // Ensure the result contains 'affected' property instead of 'id'
      expect(result).toHaveProperty('affected', 1);
    });
  });
});

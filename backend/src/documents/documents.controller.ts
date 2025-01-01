import { Controller, Get, Post, Put, Delete, Body,Headers, Param, UseGuards, UploadedFile, UseInterceptors, UnauthorizedException,Injectable } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from '../auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { Express } from 'express';
import * as FormData from 'form-data'; 

@Controller('documents')
@UseGuards(JwtAuthGuard)
@Injectable()
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  @Get()
  async findAll() {
    return this.documentsService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File, 
    @Headers() headers: Record<string, string>
  ) {

    console.log("IN post")
    
    const authHeader = headers['authorization'];

    console.log("IN post header:"  +authHeader)
    // Check for Bearer token in the Authorization header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("No bearer found")
      throw new UnauthorizedException('Invalid authorization header');
    }
    

    // Extract token by removing 'Bearer ' prefix
    const token = authHeader.replace('Bearer ', '');
    
    try {
      // Validate the token's signature
      const decoded = this.jwtService.verify(token); // Automatically checks signature and expiration
      console.log("IN post decoded:"  + JSON.stringify(decoded))

      // Extract userId from the decoded payload
      const userId = decoded.sub;

      if (!userId) {
        throw new UnauthorizedException('Invalid token payload');
      }

      const createDocumentDto = new CreateDocumentDto();
      createDocumentDto.file = file.originalname

      createDocumentDto.uploadedBy = userId;

      if (!file) {
        throw new UnauthorizedException('No file uploaded');
      }

      const ingestResponse = await this.sendFileToIngestAPI(file, token);
      createDocumentDto.docId = ingestResponse.docId;

      // Pass the userId along with the document creation DTO
      return this.documentsService.create({
        ...createDocumentDto
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDocumentDto: UpdateDocumentDto) {
    return this.documentsService.update(+id, updateDocumentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.documentsService.remove(+id);
  }



  // Helper method to send the file to the /ingest API
  private async sendFileToIngestAPI(file: Express.Multer.File, token: any): Promise<any> {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);  // Append the file buffer and name
    formData.append('name', file.originalname);

    try {
      const response = await this.httpService
        .post('http://localhost:9000/documents/ingestion', formData, {
          headers: {
            ...formData.getHeaders(),
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'multipart/form-data',  // Ensure the correct Content-Type is set
          },
        })
        .toPromise();  // Use .toPromise() to wait for the result

      return response.data;  // Return the response data from the /ingest API
    } catch (error) {
      console.error("Error while calling api:"  + error)
      throw new UnauthorizedException('Failed to ingest file to the external API');
    }
  }
}
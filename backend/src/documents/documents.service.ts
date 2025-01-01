import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
  ) {}

  async findAll() {
    return this.documentRepository.find();
  }

  async create(createDocumentDto: CreateDocumentDto) {
    
    const doc = new Document();
    doc.filename = createDocumentDto.file;
    doc.uploadedBy = createDocumentDto.uploadedBy;
    return this.documentRepository.save(doc);
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    await this.documentRepository.update(id, updateDocumentDto);
    return this.documentRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    return this.documentRepository.delete(id);
  }
}
import { Component } from '@angular/core';
import { DocumentService } from './document.service';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { ChatComponent } from '../chat/chat.component';

@Component({
  standalone: true,
  imports: [FormsModule,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    ChatComponent,
    MatInputModule,
    MatIconModule,], // Import FormsModule here
  selector: 'app-document-management',
  templateUrl: './document-management.component.html',
  styleUrls: ['./document-management.component.scss']
})
export class DocumentManagementComponent {
  documents: any[] = [];
  file: File | null = null;
  selectedDocument: any | null = null;
  displayedColumns: string[] = ['docId', 'filename', 'uploadedBy', 'createdAt', 'actions'];

  constructor(private documentService: DocumentService) {
    this.loadDocuments();
  }

  onFileChange(event: any): void {
    this.file = event.target.files[0];
  }

  uploadDocument(): void {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      this.documentService.uploadDocument(formData).subscribe(() => {
        this.loadDocuments();
      });
    }
  }

  loadDocuments(): void {
    this.documentService.getDocuments().subscribe((docs) => {
      this.documents = docs;
    });
  }

  deleteDocument(id: string): void {
    this.documentService.deleteDocument(id).subscribe(() => {
      this.loadDocuments();
    });
  }

  openChat(document: any): void {
    this.selectedDocument = document;  // Set the selected document for chat
  }
}

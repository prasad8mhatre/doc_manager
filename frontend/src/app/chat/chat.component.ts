import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { QaService } from './qa.service';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatTableModule,
    MatLabel,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatInputModule
  ],
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Input() document: any; // Input for document data
  messages: { text: string; sender: 'user' | 'bot' }[] = []; // Store chat messages (question and answer)
  newMessage: string = ''; // New message to send
  isLoading: boolean = false;

  constructor(private qaService: QaService) {}

  ngOnInit(): void {
    // Initialize chat if needed
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const question = this.newMessage.trim();
      // Add the user's message to the chat
      this.messages.push({ text: question, sender: 'user' });
      this.newMessage = ''; // Clear the input field after sending
      this.isLoading = true;
      //Call the QA service API to get the answer
      this.qaService.askQuestion(question, this.document.docId).subscribe(
        (response) => {
          const answer = response.answer; // Adjust according to your API response structure
          // Add the bot's answer to the chat
          this.messages.push({ text: answer, sender: 'bot' });
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching answer:', error);
          // You can handle errors here, e.g., show an error message
          this.messages.push({
            text: 'Sorry, I could not fetch an answer at the moment.',
            sender: 'bot',
          });
          this.isLoading = false;
        }
      );
    }
  }
}

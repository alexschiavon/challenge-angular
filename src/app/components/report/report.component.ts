import { Component } from '@angular/core';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { BookDetails } from 'src/app/models/models';
import { ReportService } from 'src/app/services/report.service';

const doc = new jsPDF();

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  bookDetails: BookDetails[] = [];

  constructor(private reportService: ReportService) {
    this.loadBookDetails();
  }

  loadBookDetails(): void {
    this.reportService.find().subscribe((data: any) => {
      this.bookDetails = data;
    });
  }

  generateReport(): void {
    const doc = new jsPDF();

    // Adicionar cabeçalho
    doc.setFontSize(18);
    doc.text("Relatório de livros", 10, 10);

    // Configurar a tabela
    const tableColumn = ["Autores", "Título", "Editora", "Edição", "Ano de Publicação",  "Assuntos", "Preços"];
    const tableRows:  any[] = [];

    this.bookDetails.forEach(book => {
      const bookData = [
        book.authors,
        book.bookTitle,
        book.publisher,
        book.edition,
        book.publicationYear,
        book.subjects,
        book.prices
      ];
      tableRows.push(bookData);
    });

    // Adicionar a tabela ao documento
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      styles: { fillColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    // Salvar o PDF
    doc.save("book_report.pdf");
  }
}

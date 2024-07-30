export class Author {
  authorId: string;
  name: string;

  constructor(authorId: string, name: string) {
    this.authorId = authorId;
    this.name = name;
  }
}

export class Book {
  static empty(): Book {
    return new Book();
  }
  bookId: string;
  title: string;
  publisher: string;
  edition: number;
  publicationYear: string;
  bookAuthors: BookAuthor[];
  bookSubjects: BookSubject[];
  bookPrices: BookPrice[];

  constructor() {
    this.bookId = '';
    this.title = '';
    this.publisher = '';
    this.edition = 1;
    this.publicationYear = '';
    this.bookAuthors = [];
    this.bookSubjects = [];
    this.bookPrices = [];
  }
}

export class BookPrice {
  public bookId: string;
  public purchaseTypeId: string;
  public price: number;

  constructor(bookId: string, purchaseTypeId: string, price: number) {
      this.bookId = bookId;
      this.purchaseTypeId = purchaseTypeId;
      this.price = price;
  }
}

export class PurchaseType {
  public purchaseTypeId: string;
  public name: string;

  constructor(purchaseTypeId: string, name: string) {
      this.purchaseTypeId = purchaseTypeId;
      this.name = name;
  }
}

export class BookSubject {
  bookCodl: string | null;
  subjectCodAs: string;

  constructor(bookCodl: string, subjectCodAs: string) {
    this.bookCodl = bookCodl;
    this.subjectCodAs = subjectCodAs;
  }
}

export class BookAuthor {
  bookCodl: string | null;
  authorCodAu: string;

  constructor(bookCodl: string, authorCodAu: string) {
    this.bookCodl = bookCodl;
    this.authorCodAu = authorCodAu;
  }
}

export class Subject {
  subjectId: string;
  description: string;

  constructor(subjectId: string, description: string) {
    this.subjectId = subjectId;
    this.description = description;
  }
}

export class Content {
  result: any[] = [];
}

export class Metadata {
  constructor(
    public pagination: Pagination = new Pagination(),
    public sortedBy: SortedBy = new SortedBy,
    public warning: string[] = [],
    public custom: any = {},
    public content: any = {}
  ) {}
}

export class Pagination {
  limit: number = 10;
  currentPage: number = 0;
  pageCount!: number;
  totalCount!: number;
}

export class SortedBy {
  field!: string;
  order!: string;
}


export class BookDetails {
  BookId!: string;
  bookTitle!: string;
  publisher!: string;
  edition!: number;
  publicationYear!: string;
  authors!: string;
  subjects!: string;
  prices!: string;
}

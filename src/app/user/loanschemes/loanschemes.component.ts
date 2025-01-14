import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplyloansService } from 'src/app/services/applyloan/applyloans.service';
import { LoanschemeService } from 'src/app/services/loanscheme/loanscheme.service';

@Component({
  selector: 'app-loanschemes',
  templateUrl: './loanschemes.component.html',
  styleUrls: ['./loanschemes.component.css']
})
export class LoanschemesComponent implements OnInit{
  @Output() loanSubmitted = new EventEmitter<void>();
  uploadForm: FormGroup;
  adharFile: File | null = null;
  panFile: File | null = null;
  bankFile: File | null = null;
  loanSchemeId: any;

  // Loan Schemes Variables
  loanSchemes: any[] = [];
  totalElements: number = 0;
  totalPages: number = 1;
  pageSize: number = 3;
  currentPage: number = 1;
  lastPage: boolean = false;
  searchTerm: string = '';

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private loanService: ApplyloansService,
    private route: ActivatedRoute,
    private loanSchemeService: LoanschemeService,
    private router: Router
  ) {
    // Initialize Apply Loan form
    this.uploadForm = this.fb.group({
      loanAmount: ['', Validators.required],
      time: ['', Validators.required],
    });
  }

  

  ngOnInit(): void {
    // Get loan scheme ID from query parameters for Apply Loan
    this.route.queryParams.subscribe((params) => {
      this.loanSchemeId = params['schemeId'];
      if (!this.loanSchemeId) {
        console.error('Loan scheme ID is missing.');
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('Navigated to:', event.url);
      }
    });

    // Load loan schemes for the Loan Schemes feature
    this.loadLoanSchemes(this.currentPage);
  }

  // Apply Loan Methods
  applyLoanModal(content: any) {
    this.modalService.open(content, {
      backdrop: 'static',
      centered: true,
    });
  }

  // File selection handlers
  onAdharFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files?.length) {
      const selectedFile = files[0];
      const allowedTypes = ['application/pdf', 'image/jpeg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert('Only PDF and JPEG files are allowed for Aadhaar.');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size exceeds the maximum limit of 5 MB.');
        return;
      }
      this.adharFile = selectedFile;
    }
  }

  onPanFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files?.length) {
      const selectedFile = files[0];
      const allowedTypes = ['application/pdf', 'image/jpeg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert('Only PDF and JPEG files are allowed for Pan Card.');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size exceeds the maximum limit of 5 MB.');
        return;
      }
      this.panFile = selectedFile;
    }
  }

  onBankFileSelect(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files?.length) {
      const selectedFile = files[0];
      const allowedTypes = ['application/pdf', 'image/jpeg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert('Only PDF and JPEG files are allowed for Bank Statement.');
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size exceeds the maximum limit of 5 MB.');
        return;
      }
      this.bankFile = selectedFile;
    }
  }

  

 // Submit Method
 onSubmit(): void {
  if (this.uploadForm.valid && this.adharFile && this.panFile && this.bankFile) {
    const formData = new FormData();
    formData.append('adharFile', this.adharFile);
    formData.append('panFile', this.panFile);
    formData.append('bankFile', this.bankFile);
    formData.append('loanamount', this.uploadForm.value.loanAmount);
    formData.append('time', this.uploadForm.value.time);
    formData.append('loanSchemeId', this.loanSchemeId);

    this.loanService.uploadFile(formData, this.loanSchemeId).subscribe(
      (response) => {
        console.log('Loan application successful:', response);
        alert('Loan application submitted successfully.');
        this.loanSubmitted.emit();
      },
      (error) => {
        console.error('Error submitting loan application:', error);
        alert('Failed to submit the application. Please try again.');
      }
    );
  } else {
    alert('Please fill the form correctly and upload all required files.');
  }
}


  // Loan Schemes Methods
  loadLoanSchemes(page: number): void {
    this.loanSchemeService.getLoanSchemes(page, this.pageSize).subscribe(
      (response) => {
        this.loanSchemes = response.contents || [];
        this.totalElements = response.totalElements || 0;
        this.totalPages = response.totalPages || 1;
        this.lastPage = response.lastPage || false;
      },
      (error) => {
        console.error('Error fetching loan schemes:', error);
        alert('Failed to fetch loan schemes. Please try again later.');
      }
    );
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadLoanSchemes(this.currentPage);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadLoanSchemes(this.currentPage);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadLoanSchemes(this.currentPage);
    }
  }

  get filteredLoanSchemes(): any[] {
    if (!this.searchTerm.trim()) return this.loanSchemes;

    const searchText = this.searchTerm.toLowerCase();
    return this.loanSchemes.filter((scheme) =>
      Object.values(scheme).some((value) =>
        value != null && value.toString().toLowerCase().includes(searchText)
      )
    );
  }
  
}
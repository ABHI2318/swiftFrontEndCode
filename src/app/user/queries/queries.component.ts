import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QueryService } from 'src/app/services/queries/query.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.css'],
})
export class QueriesComponent implements OnInit {
  uploadForm: FormGroup;
  queries: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 5;

  constructor(
    private fb: FormBuilder,
    private queryService: QueryService,
    private toastr: ToastrService // Inject ToastrService
  ) {
    this.uploadForm = this.fb.group({
      question: ['', [Validators.required]],
      querytype: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.fetchQueries();
  }

  // Submit a new query
  onSubmit(): void {
    if (this.uploadForm.valid) {
      const queryData = this.uploadForm.value;

      this.queryService.submitQueryapplication(queryData).subscribe({
        next: () => {
          this.uploadForm.reset(); // Reset form
          this.fetchQueries(); // Fetch updated queries
          this.toastr.success('Query submitted successfully!', 'Success', {
            timeOut: 5000,
            progressBar: true,
            closeButton: true,
            positionClass: 'toast-top-right', // Position set manually
          });
        },
        error: (err) => {
          console.error('Error submitting query:', err);
          this.toastr.error('Failed to submit query. Please try again.', 'Error', {
            timeOut: 5000,
            progressBar: true,
            closeButton: true,
            positionClass: 'toast-top-right', // Position set manually
          });
        },
      });
    }
  }

  // Fetch submitted queries from backend
  fetchQueries(): void {
    this.queryService.getAllQueries(this.currentPage - 1, this.pageSize).subscribe({
      next: (response) => {
        this.queries = response.contents; // Backend response structure
        this.totalPages = response.totalPages;
        // this.toastr.info('Queries fetched successfully!', 'Info', {
        //   timeOut: 5000,
        //   progressBar: true,
        //   closeButton: true,
        //   positionClass: 'toast-top-right', // Position set manually
        // });
      },
      error: (err) => {
        console.error('Error fetching queries:', err);
        this.toastr.warning('Failed to fetch queries. Please try again later.', 'Warning', {
          timeOut: 5000,
          progressBar: true,
          closeButton: true,
          positionClass: 'toast-top-right', // Position set manually
        });
      },
    });
  }

  // Pagination: go to previous page
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchQueries();
      this.toastr.info('Moved to the previous page.', 'Info', {
        timeOut: 5000,
        progressBar: true,
        closeButton: true,
        positionClass: 'toast-top-right', // Position set manually
      });
    }
  }

  // Pagination: go to next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchQueries();
      this.toastr.info('Moved to the next page.', 'Info', {
        timeOut: 5000,
        progressBar: true,
        closeButton: true,
        positionClass: 'toast-top-right', // Position set manually
      });
    }
  }
}

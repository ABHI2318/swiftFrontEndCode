import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { QueryService } from 'src/app/services/queries/query.service';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';


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

  constructor(private fb: FormBuilder, private queryService: QueryService) {
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
          alert('Query submitted successfully!'); // Show success alert
        },
        error: (err) => {
          console.error('Error submitting query:', err);
          alert('Failed to submit query. Please try again.'); // Show error alert
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
        console.log(this.queries);
      },
      error: (err) => {
        console.error('Error fetching queries:', err);
        alert('Failed to fetch queries. Please try again later.');
      },
    });
  }
  

  // Pagination: go to previous page
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchQueries();
    }
  }

  // Pagination: go to next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchQueries();
    }
  }
}
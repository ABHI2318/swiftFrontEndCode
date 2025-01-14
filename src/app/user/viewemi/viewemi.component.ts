import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewapplyloansService } from 'src/app/services/applyloan/viewapplyloans.service';
import { EmiServiceService } from 'src/app/services/emiservice/emi-service.service';

@Component({
  selector: 'app-viewemi',
  templateUrl: './viewemi.component.html',
  styleUrls: ['./viewemi.component.css']
})
export class ViewemiComponent {
  emis: any[] = [];
  loanId: any;

  constructor(private emiService: EmiServiceService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.loanId = params['loanId'];
      if (!this.loanId) {
        console.error('Loan scheme ID is missing.');
      }
    });
    if (this.loanId) {
      this.emiService.getEmisByLoanId(this.loanId).subscribe(
        (response) => {
          this.emis = response;
          console.log(this.emis);
          
        },
        (error) => {
          console.error('Error fetching EMIs', error);
        }
      );
    };
    this.getEmiDetails();
  }

  getEmiDetails(): void {
    // Fetch EMI data based on loanId
    this.emiService.getEmisByLoanId(this.loanId).subscribe(
      (data) => {
        this.emis = data; // Assign the fetched data to the emis array
        
        
        this.emis.forEach((emi, index) => {
          const emiDate = new Date(emi.date); // Parse the date string into a Date object
          emiDate.setMonth(emiDate.getMonth() + index); // Increment month by index
          emi.date = emiDate.toLocaleDateString(); // Update the date
        });
      },
      (error) => {
        console.error('Error fetching EMI details:', error);
        alert('Failed to fetch EMI details. Please try again later.');
      }
    );
  }


}
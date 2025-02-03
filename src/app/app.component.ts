import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  employee = {
    empId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    department: '',
    joiningDate: '',
    salary: 0
  };

  employees: any[] = []; // Array to store the list of employees
  apiUrl = 'http://localhost:8484/api/employees'; // Replace with your actual API URL
  isEditing = false;

  private http = inject(HttpClient);

  ngOnInit(): void {
    this.getAllEmployees(); // Fetch the list of employees when the component initializes
  }

  // Method to handle form submission (Create or Update)
  onSubmit(): void {
    if (this.isEditing) {
      this.updateEmployeeData();
    } else {
      this.createEmployeeData();
    }
  }

  // Fetch all employees (GET request)
  getAllEmployees(): void {
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        this.employees = data; // Store the employee list
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }

  // Create a new employee (POST request)
  createEmployeeData(): void {
    this.employee.empId = uuidv4().substring(0,8);
    this.http.post<any>(this.apiUrl, this.employee).subscribe(
      (response) => {
        alert('Employee created successfully!');
        console.log('Employee created:', response);
        this.getAllEmployees(); // Refresh the employee list
        this.resetForm();
      },
      (error) => {
        console.error('Error creating employee:', error);
      }
    );
  }

  // Fetch employee data for editing (GET request)
  fetchEmployeeData(empId: string): void {
    this.http.get<any>(`${this.apiUrl}/${empId}`).subscribe(
      (data) => {
        this.employee = data;
        this.isEditing = true;
      },
      (error) => {
        console.error('Error fetching employee data:', error);
      }
    );
  }

  // Update existing employee data (PUT request)
  updateEmployeeData(): void {
    this.http.put<any>(`${this.apiUrl}/${this.employee.empId}`, this.employee).subscribe(
      (response) => {
        alert('Employee updated successfully!');
        console.log('Employee updated:', response);
        this.getAllEmployees(); // Refresh the employee list
        this.resetForm();
      },
      (error) => {
        console.error('Error updating employee:', error);
      }
    );
  }

  // Delete an employee (DELETE request)
  deleteEmployee(empId: string): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.http.delete<any>(`${this.apiUrl}/${empId}`).subscribe(
        (response) => {
          alert('Employee deleted successfully!');
          console.log('Employee deleted:', response);
          this.getAllEmployees(); // Refresh the employee list
          this.resetForm();
        },
        (error) => {
          console.error('Error deleting employee:', error);
        }
      );
    }
  }

  // Reset the form after submission or deletion
  resetForm(): void {
    this.employee = {
      empId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      gender: '',
      address: '',
      department: '',
      joiningDate: '',
      salary: 0
    };
    this.isEditing = false;
  }
}

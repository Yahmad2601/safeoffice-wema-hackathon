import { 
  type Employee, 
  type InsertEmployee, 
  type Session,
  type LoanApplication,
  type TransferRequest,
  type Activity
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Employee management
  getEmployee(id: string): Promise<Employee | undefined>;
  getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  
  // Session management
  createSession(employeeId: string, token: string): Promise<Session>;
  getSessionByToken(token: string): Promise<Session | undefined>;
  deleteSession(token: string): Promise<void>;
  
  // Loan applications
  getLoanApplications(): Promise<LoanApplication[]>;
  updateLoanStatus(id: string, status: string): Promise<void>;
  
  // Transfer requests
  getTransferRequests(): Promise<TransferRequest[]>;
  updateTransferStatus(id: string, status: string): Promise<void>;
  
  // Activities
  createActivity(employeeId: string, action: string, description: string): Promise<Activity>;
  getActivitiesByEmployee(employeeId: string): Promise<Activity[]>;
  
  // Dashboard stats
  getDashboardStats(): Promise<{
    pendingApprovals: number;
    loansProcessed: number;
    totalTransactions: string;
    activeCustomers: number;
  }>;
}

export class MemStorage implements IStorage {
  private employees: Map<string, Employee>;
  private sessions: Map<string, Session>;
  private loanApplications: Map<string, LoanApplication>;
  private transferRequests: Map<string, TransferRequest>;
  private activities: Map<string, Activity>;
  private loansProcessedCount: number;

  constructor() {
    this.employees = new Map();
    this.sessions = new Map();
    this.loanApplications = new Map();
    this.transferRequests = new Map();
    this.activities = new Map();
    this.loansProcessedCount = 187; // Default value
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Create sample employee
    const employee: Employee = {
      id: randomUUID(),
      employeeId: "WB001",
      password: "password123", // In real app, this would be hashed
      name: "John Adebayo",
      role: "Senior Banking Officer",
      isActive: true,
      createdAt: new Date(),
    };
    this.employees.set(employee.id, employee);

    // Create sample loan applications
    const loanApps: LoanApplication[] = [
      { id: randomUUID(), loanNumber: "LOAN-005623", customerName: "Emeka Okafor", customerAccount: "9876543210", amount: 5000000, priority: "medium", status: "pending", createdAt: new Date() },
      { id: randomUUID(), loanNumber: "LOAN-005624", customerName: "Chioma Nwosu", customerAccount: "2345678901", amount: 3000000, priority: "high", status: "pending", createdAt: new Date() },
      { id: randomUUID(), loanNumber: "LOAN-005625", customerName: "Aisha Bello", customerAccount: "4567890123", amount: 7000000, priority: "low", status: "pending", createdAt: new Date() },
    ];
    loanApps.forEach(app => this.loanApplications.set(app.id, app));

    // Create sample transfer requests
    const transferReqs: TransferRequest[] = [
      { id: randomUUID(), transactionNumber: "TXN-001247", customerName: "Adunni Adebayo", customerAccount: "1234567890", amount: 2500000, priority: "high", status: "pending", createdAt: new Date() },
      { id: randomUUID(), transactionNumber: "TXN-001248", customerName: "Femi Adekunle", customerAccount: "3456789012", amount: 1500000, priority: "medium", status: "pending", createdAt: new Date() },
      { id: randomUUID(), transactionNumber: "TXN-001249", customerName: "Ngozi Okoro", customerAccount: "5678901234", amount: 500000, priority: "high", status: "pending", createdAt: new Date() },
    ];
    transferReqs.forEach(req => this.transferRequests.set(req.id, req));
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployeeByEmployeeId(employeeId: string): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(
      (employee) => employee.employeeId === employeeId
    );
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = randomUUID();
    const employee: Employee = { 
      ...insertEmployee, 
      id, 
      isActive: true,
      createdAt: new Date()
    };
    this.employees.set(id, employee);
    return employee;
  }

  async createSession(employeeId: string, token: string): Promise<Session> {
    const session: Session = {
      id: randomUUID(),
      employeeId,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      createdAt: new Date(),
    };
    this.sessions.set(session.token, session);
    return session;
  }

  async getSessionByToken(token: string): Promise<Session | undefined> {
    const session = this.sessions.get(token);
    if (session && session.expiresAt > new Date()) {
      return session;
    }
    if (session) {
      this.sessions.delete(token);
    }
    return undefined;
  }

  async deleteSession(token: string): Promise<void> {
    this.sessions.delete(token);
  }

  async getLoanApplications(): Promise<LoanApplication[]> {
    return Array.from(this.loanApplications.values());
  }

  async updateLoanStatus(id: string, status: string): Promise<void> {
    const loan = this.loanApplications.get(id);
    if (loan && loan.status !== status) {
      if (status === 'approved') {
        this.loansProcessedCount++;
      }
      loan.status = status;
      this.loanApplications.set(id, loan);
    }
  }

  async getTransferRequests(): Promise<TransferRequest[]> {
    return Array.from(this.transferRequests.values());
  }

  async updateTransferStatus(id: string, status: string): Promise<void> {
    const transfer = this.transferRequests.get(id);
    if (transfer) {
      transfer.status = status;
      this.transferRequests.set(id, transfer);
    }
  }

  async createActivity(employeeId: string, action: string, description: string): Promise<Activity> {
    const activity: Activity = {
      id: randomUUID(),
      employeeId,
      action,
      description,
      createdAt: new Date(),
    };
    this.activities.set(activity.id, activity);
    return activity;
  }

  async getActivitiesByEmployee(employeeId: string): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.employeeId === employeeId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getDashboardStats(): Promise<{
    pendingApprovals: number;
    loansProcessed: number;
    totalTransactions: string;
    activeCustomers: number;
  }> {
    const pendingLoans = Array.from(this.loanApplications.values()).filter(l => l.status === 'pending').length;
    const pendingTransfers = Array.from(this.transferRequests.values()).filter(t => t.status === 'pending').length;
    
    return {
      pendingApprovals: pendingLoans + pendingTransfers,
      loansProcessed: this.loansProcessedCount,
      totalTransactions: "₦2.4M",
      activeCustomers: 1247,
    };
  }
}

export const storage = new MemStorage();

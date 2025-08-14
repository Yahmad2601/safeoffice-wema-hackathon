import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Shield, Clock, Eye } from 'lucide-react';
import DocumentViewer from '../security/document-viewer';

interface Document {
  id: string;
  title: string;
  type: string;
  classification: string;
  lastAccessed: Date;
  content: string;
}

interface SecureDocumentsProps {
  employeeName: string;
}

export default function SecureDocuments({ employeeName }: SecureDocumentsProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const secureDocuments: Document[] = [
    {
      id: '1',
      title: 'Customer Due Diligence Report - ACC/2024/001',
      type: 'Compliance Report',
      classification: 'CONFIDENTIAL',
      lastAccessed: new Date('2024-08-13T10:30:00'),
      content: `CUSTOMER DUE DILIGENCE REPORT
      
Account Number: ACC/2024/001
Customer Name: Lagos State Manufacturing Ltd.
Risk Assessment: HIGH RISK

EXECUTIVE SUMMARY:
This report contains sensitive customer information and financial data that requires maximum security protocols. The customer profile indicates significant transaction volumes with international counterparts, requiring enhanced monitoring procedures.

CUSTOMER PROFILE:
The customer operates in the manufacturing sector with primary business activities in textile production and export. Annual turnover exceeds ₦500 million with regular international wire transfers to suppliers in Asia and Europe.

COMPLIANCE FINDINGS:
1. All required documentation has been submitted and verified
2. Enhanced due diligence procedures have been completed
3. PEP screening returned negative results
4. AML/CFT checks are satisfactory

RISK FACTORS:
- High volume international transactions
- Cash-intensive business model
- Operations in multiple jurisdictions
- Complex corporate structure with offshore entities

RECOMMENDATIONS:
1. Implement quarterly transaction monitoring reviews
2. Maintain enhanced customer due diligence file
3. Report any suspicious activities immediately
4. Update customer information annually

This document contains confidential banking information and must be handled in accordance with Wema Bank's information security policies.`
    },
    {
      id: '2',
      title: 'Loan Underwriting Analysis - LN/2024/089',
      type: 'Credit Analysis',
      classification: 'RESTRICTED',
      lastAccessed: new Date('2024-08-13T09:15:00'),
      content: `LOAN UNDERWRITING ANALYSIS REPORT
      
Loan Application: LN/2024/089
Applicant: Abuja Tech Solutions Ltd.
Requested Amount: ₦75,000,000
Purpose: Equipment Financing

CREDIT ASSESSMENT:
The applicant has requested financing for the purchase of specialized technology equipment to support their IT services expansion. This analysis provides a comprehensive review of the credit worthiness and risk factors.

FINANCIAL ANALYSIS:
Based on the submitted financial statements for the past three years:
- Revenue Growth: 23% annually
- Debt-to-Equity Ratio: 0.4:1
- Current Ratio: 2.1:1
- Interest Coverage Ratio: 8.5:1

SECURITY AND COLLATERAL:
- Primary Security: Equipment being financed (₦75M value)
- Secondary Security: Corporate guarantee from parent company
- Personal guarantees from two directors
- Insurance coverage: Comprehensive equipment insurance

MANAGEMENT ASSESSMENT:
The management team demonstrates strong technical expertise and proven track record in the IT sector. Key management personnel have been with the company for over 5 years.

INDUSTRY OUTLOOK:
The technology services sector shows positive growth trends with increasing demand for digital transformation services across various industries.

RECOMMENDATION:
APPROVE with following conditions:
1. Quarterly financial reporting
2. Insurance maintenance requirements
3. Personal guarantee enforceability
4. Equipment inspection rights

This document contains sensitive financial information and credit decisions that are proprietary to Wema Bank.`
    },
    {
      id: '3',
      title: 'Anti-Money Laundering Investigation - AML/2024/034',
      type: 'AML Report',
      classification: 'TOP SECRET',
      lastAccessed: new Date('2024-08-12T16:45:00'),
      content: `ANTI-MONEY LAUNDERING INVESTIGATION REPORT
      
Case Reference: AML/2024/034
Investigation Subject: Account 1234567890
Alert Generated: Unusual Transaction Pattern
Investigation Period: January 2024 - July 2024

CONFIDENTIAL INVESTIGATION SUMMARY:
This report documents the findings of an internal AML investigation triggered by automated monitoring systems. The investigation involved detailed transaction analysis and customer behavior assessment.

SUSPICIOUS ACTIVITY INDICATORS:
1. Rapid movement of large amounts through multiple accounts
2. Transactions just below reporting thresholds
3. Unusual geographic patterns in wire transfers
4. Inconsistent transaction patterns with stated business purpose

INVESTIGATION METHODOLOGY:
- Transaction pattern analysis over 6-month period
- Enhanced customer due diligence review
- Cross-referencing with sanctions lists
- International transaction flow mapping
- Source of funds verification

FINDINGS:
After thorough investigation, the suspicious activities were determined to be legitimate business transactions related to the customer's seasonal import business. The unusual patterns coincided with peak import seasons and were consistent with the industry practices.

CUSTOMER COOPERATION:
The customer provided full cooperation during the investigation, submitting all requested documentation and explanations for the transaction patterns identified.

CONCLUSION:
No evidence of money laundering or terrorist financing was found. The account monitoring parameters have been adjusted to reflect the customer's legitimate business patterns.

RECOMMENDATIONS:
1. Update customer risk profile
2. Adjust monitoring parameters
3. File internal clearance report
4. No STR filing required

This document contains highly confidential AML investigation details and must be handled with maximum security protocols.`
    }
  ];

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'TOP SECRET':
        return 'bg-red-100 text-red-800';
      case 'CONFIDENTIAL':
        return 'bg-orange-100 text-orange-800';
      case 'RESTRICTED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Less than 1 hour ago';
    if (diffHours === 1) return '1 hour ago';
    return `${diffHours} hours ago`;
  };

  return (
    <>
      <Card data-testid="card-secure-documents">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-purple-600" />
            Secure Document Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {secureDocuments.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                data-testid={`document-item-${doc.id}`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate" data-testid={`text-document-title-${doc.id}`}>
                      {doc.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500">{doc.type}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getClassificationColor(doc.classification)}`}
                        data-testid={`badge-classification-${doc.id}`}
                      >
                        {doc.classification}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>Last accessed: {formatTimeAgo(doc.lastAccessed)}</span>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={() => setSelectedDocument(doc)}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  data-testid={`button-view-document-${doc.id}`}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Secure View
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Security Notice</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              All documents are protected with advanced security features including watermarking, 
              access logging, and copy protection. Unauthorized access attempts are monitored and logged.
            </p>
          </div>
        </CardContent>
      </Card>

      {selectedDocument && (
        <DocumentViewer
          title={selectedDocument.title}
          content={selectedDocument.content}
          employeeName={employeeName}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </>
  );
}
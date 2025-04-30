import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const Certificate = ({ courseTitle, studentName, completionDate, instructorName = "Course Instructor" }: { 
  courseTitle: string; 
  studentName: string; 
  completionDate: Date;
  instructorName?: string;
}) => {
  const generateCertificate = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Create gradient background
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();
    
    // Light cream background
    doc.setFillColor(252, 251, 247);
    doc.rect(0, 0, width, height, 'F');
    
    // Gold border with corner decorations
    doc.setDrawColor(190, 162, 60);
    doc.setLineWidth(3);
    doc.rect(15, 15, width - 30, height - 30, 'S');
    
    // Inner border (thinner)
    doc.setDrawColor(190, 162, 60);
    doc.setLineWidth(0.5);
    doc.rect(20, 20, width - 40, height - 40, 'S');
    
    // Corner ornaments (simplified fancy corners)
    const cornerSize = 15;
    
    // Top left corner
    doc.setDrawColor(70, 90, 140);
    doc.setLineWidth(1.5);
    doc.line(15, 25, 15 + cornerSize, 15);
    doc.line(25, 15, 15, 15 + cornerSize);
    
    // Top right corner
    doc.line(width - 15, 25, width - 15 - cornerSize, 15);
    doc.line(width - 25, 15, width - 15, 15 + cornerSize);
    
    // Bottom left corner
    doc.line(15, height - 25, 15 + cornerSize, height - 15);
    doc.line(25, height - 15, 15, height - 15 - cornerSize);
    
    // Bottom right corner
    doc.line(width - 15, height - 25, width - 15 - cornerSize, height - 15);
    doc.line(width - 25, height - 15, width - 15, height - 15 - cornerSize);
    
    // Add watermark logo in very light gray
    doc.setTextColor(240, 240, 240);
    doc.setFontSize(120);
    doc.setFont('helvetica', 'bold');
    doc.text('E', width / 2, height / 2, { align: 'center' });
    
    // Header with decorative line
    doc.setFont('times', 'bold');
    doc.setFontSize(42);
    doc.setTextColor(70, 90, 140); // Navy blue
    doc.text('Certificate of Completion', width / 2, 50, { align: 'center' });
    
    // Decorative line under header
    doc.setDrawColor(190, 162, 60); // Gold
    doc.setLineWidth(1);
    doc.line(width / 2 - 80, 58, width / 2 + 80, 58);
    
    // Certificate Body
    doc.setFontSize(20);
    doc.setTextColor(70, 70, 70);
    doc.setFont('times', 'italic');
    doc.text('This certifies that', width / 2, 80, { align: 'center' });
    
    // Student Name with underline effect
    doc.setFont('times', 'bold');
    doc.setFontSize(32);
    doc.setTextColor(70, 90, 140); // Navy blue
    doc.text(studentName, width / 2, 100, { align: 'center' });
    
    // Decorative line under name (shorter)
    doc.setDrawColor(190, 162, 60); // Gold
    doc.setLineWidth(0.5);
    doc.line(width / 2 - 50, 105, width / 2 + 50, 105);
    
    // Course Details
    doc.setFont('times', 'italic');
    doc.setFontSize(20);
    doc.setTextColor(70, 70, 70);
    doc.text('has successfully completed the course', width / 2, 120, { align: 'center' });
    
    // Course Title (highlighted)
    doc.setFont('times', 'bold');
    doc.setFontSize(26);
    doc.setTextColor(70, 90, 140); // Navy blue
    
    // Background highlight for course title
    const courseTitle1 = doc.getTextWidth(courseTitle);
    if (courseTitle1 < 180) { // Only if the title isn't too long
      doc.setFillColor(245, 245, 250);
      doc.roundedRect(width/2 - courseTitle1/2 - 10, 128, courseTitle1 + 20, 14, 2, 2, 'F');
    }
    doc.text(courseTitle, width / 2, 138, { align: 'center' });
    
    // Completion Date with icon
    doc.setFont('times', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(70, 70, 70);
    const dateText = `Completed on: ${format(new Date(completionDate), 'MMMM dd, yyyy')}`;
    doc.text(dateText, width / 2, 160, { align: 'center' });
    
    // Official seal/stamp effect (circle) in the middle
    doc.setDrawColor(190, 162, 60); // Gold
    doc.setLineWidth(1);
    doc.circle(width / 2, 170, 15);
    doc.circle(width / 2, 170, 12);
    
    // Add verification text at the bottom of the page (inside border)
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'normal');
    doc.text('Issued by EduPlatform | Verify at eduplatform.com/verify', width / 2, height - 35, { align: 'center' });
    
    // Certificate ID
    const certId = `Certificate ID: EDU-${Date.now().toString().substring(5)}`;
    doc.setFontSize(10);
    doc.text(certId, width / 2, height - 28, { align: 'center' });
    
    // Signature lines with decorative elements - positioned higher to be inside border
    doc.setDrawColor(70, 90, 140); // Navy blue
    doc.setLineWidth(0.5);
    
    // Label for both signatures (small text above the lines)
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    doc.text('Course Instructor:', width / 4, height - 50, { align: 'center' });
    doc.text('Authorized By:', width * 3/4, height - 50, { align: 'center' });
    
    // Signature lines
    doc.line(width / 4 - 30, height - 45, width / 4 + 30, height - 45);
    doc.line(width * 3/4 - 30, height - 45, width * 3/4 + 30, height - 45);
    
    // Signature names
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.text(instructorName, width / 4, height - 40, { align: 'center' });
    doc.text('EduWorld Team', width * 3/4, height - 40, { align: 'center' });
    
    // Note: Footer is now moved inside the border with the signatures

    // Save the PDF
    doc.save(`${courseTitle}_Certificate.pdf`);
  };

  return (
    <button
      onClick={generateCertificate}
      className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-lg flex items-center justify-center"
    >
      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v5m0 0l-3-3m3 3l3-3M2 6a2 2 0 012-2h16a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
      </svg>
      Download Certificate
    </button>
  );
};

export default Certificate;
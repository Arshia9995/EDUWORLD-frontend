import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

const Certificate = ({ courseTitle, studentName, completionDate }: { courseTitle: string; studentName: string; completionDate: Date }) => {
  const generateCertificate = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Background and Border
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 297, 210, 'F');
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    doc.setTextColor(0, 102, 204);
    doc.text('Certificate of Completion', 148.5, 40, { align: 'center' });

    // Certificate Body
    doc.setFontSize(20);
    doc.setTextColor(51, 51, 51);
    doc.setFont('helvetica', 'normal');
    doc.text('This certifies that', 148.5, 70, { align: 'center' });

    // Student Name
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.setTextColor(0, 102, 204);
    doc.text(studentName, 148.5, 90, { align: 'center' });

    // Course Details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.setTextColor(51, 51, 51);
    doc.text('has successfully completed the course', 148.5, 110, { align: 'center' });
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text(courseTitle, 148.5, 130, { align: 'center' });

    // Completion Date
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text(`Date of Completion: ${format(new Date(completionDate), 'MMMM dd, yyyy')}`, 148.5, 150, { align: 'center' });

    // Signature Line
    doc.setFontSize(14);
    doc.text('___________________________', 80, 180);
    doc.text('Instructor Signature', 80, 190, { align: 'center' });
    doc.text('___________________________', 200, 180);
    doc.text('Program Director', 200, 190, { align: 'center' });

    // Footer
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text('Issued by EduPlatform', 148.5, 200, { align: 'center' });

    // Save the PDF
    doc.save(`${courseTitle}_Certificate.pdf`);
  };

  return (
    <button
      onClick={generateCertificate}
      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center justify-center"
    >
      <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
      </svg>
      Download Certificate
    </button>
  );
};

export default Certificate;
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { format } from 'date-fns';

// const Certificate = ({ courseTitle, studentName, completionDate, instructorName = "Course Instructor" }: { 
//   courseTitle: string; 
//   studentName: string; 
//   completionDate: Date;
//   instructorName?: string;
// }) => {
//   const generateCertificate = () => {
//     const doc = new jsPDF({
//       orientation: 'landscape',
//       unit: 'mm',
//       format: 'a4',
//     });

   
//     const width = doc.internal.pageSize.getWidth();
//     const height = doc.internal.pageSize.getHeight();
    
    
//     doc.setFillColor(252, 251, 247);
//     doc.rect(0, 0, width, height, 'F');
    
    
//     doc.setDrawColor(190, 162, 60);
//     doc.setLineWidth(3);
//     doc.rect(15, 15, width - 30, height - 30, 'S');
    
    
//     doc.setDrawColor(190, 162, 60);
//     doc.setLineWidth(0.5);
//     doc.rect(20, 20, width - 40, height - 40, 'S');
    
    
//     const cornerSize = 15;
    
    
//     doc.setDrawColor(70, 90, 140);
//     doc.setLineWidth(1.5);
//     doc.line(15, 25, 15 + cornerSize, 15);
//     doc.line(25, 15, 15, 15 + cornerSize);
    
    
//     doc.line(width - 15, 25, width - 15 - cornerSize, 15);
//     doc.line(width - 25, 15, width - 15, 15 + cornerSize);
    
    
//     doc.line(15, height - 25, 15 + cornerSize, height - 15);
//     doc.line(25, height - 15, 15, height - 15 - cornerSize);
    
    
//     doc.line(width - 15, height - 25, width - 15 - cornerSize, height - 15);
//     doc.line(width - 25, height - 15, width - 15, height - 15 - cornerSize);
    
    
//     doc.setTextColor(240, 240, 240);
//     doc.setFontSize(120);
//     doc.setFont('helvetica', 'bold');
//     doc.text('E', width / 2, height / 2, { align: 'center' });
    
    
//     doc.setFont('times', 'bold');
//     doc.setFontSize(42);
//     doc.setTextColor(70, 90, 140); 
//     doc.text('Certificate of Completion', width / 2, 50, { align: 'center' });
    
    
//     doc.setDrawColor(190, 162, 60); 
//     doc.setLineWidth(1);
//     doc.line(width / 2 - 80, 58, width / 2 + 80, 58);
    
    
//     doc.setFontSize(20);
//     doc.setTextColor(70, 70, 70);
//     doc.setFont('times', 'italic');
//     doc.text('This certifies that', width / 2, 80, { align: 'center' });
    
    
//     doc.setFont('times', 'bold');
//     doc.setFontSize(32);
//     doc.setTextColor(70, 90, 140); 
//     doc.text(studentName, width / 2, 100, { align: 'center' });
    
    
//     doc.setDrawColor(190, 162, 60); 
//     doc.setLineWidth(0.5);
//     doc.line(width / 2 - 50, 105, width / 2 + 50, 105);
    
    
//     doc.setFont('times', 'italic');
//     doc.setFontSize(20);
//     doc.setTextColor(70, 70, 70);
//     doc.text('has successfully completed the course', width / 2, 120, { align: 'center' });
    
    
//     doc.setFont('times', 'bold');
//     doc.setFontSize(26);
//     doc.setTextColor(70, 90, 140); 
    
    
//     const courseTitle1 = doc.getTextWidth(courseTitle);
//     if (courseTitle1 < 180) { 
//       doc.setFillColor(245, 245, 250);
//       doc.roundedRect(width/2 - courseTitle1/2 - 10, 128, courseTitle1 + 20, 14, 2, 2, 'F');
//     }
//     doc.text(courseTitle, width / 2, 138, { align: 'center' });
    
    
//     doc.setFont('times', 'normal');
//     doc.setFontSize(16);
//     doc.setTextColor(70, 70, 70);
//     const dateText = `Completed on: ${format(new Date(completionDate), 'MMMM dd, yyyy')}`;
//     doc.text(dateText, width / 2, 160, { align: 'center' });
    
    
//     doc.setDrawColor(190, 162, 60); 
//     doc.setLineWidth(1);
//     doc.circle(width / 2, 170, 15);
//     doc.circle(width / 2, 170, 12);
    
    
//     doc.setFontSize(8);
//     doc.setTextColor(120, 120, 120);
//     doc.setFont('helvetica', 'normal');
//     doc.text('Issued by EduPlatform | Verify at eduplatform.com/verify', width / 2, height - 35, { align: 'center' });
    
    
//     const certId = `Certificate ID: EDU-${Date.now().toString().substring(5)}`;
//     doc.setFontSize(10);
//     doc.text(certId, width / 2, height - 28, { align: 'center' });
    
    
//     doc.setDrawColor(70, 90, 140); 
//     doc.setLineWidth(0.5);
    
    
//     doc.setFont('times', 'normal');
//     doc.setFontSize(10);
//     doc.setTextColor(70, 70, 70);
//     doc.text('Course Instructor:', width / 4, height - 50, { align: 'center' });
//     doc.text('Authorized By:', width * 3/4, height - 50, { align: 'center' });
    
    
//     doc.line(width / 4 - 30, height - 45, width / 4 + 30, height - 45);
//     doc.line(width * 3/4 - 30, height - 45, width * 3/4 + 30, height - 45);
    
    
//     doc.setFont('times', 'bold');
//     doc.setFontSize(14);
//     doc.text(instructorName, width / 4, height - 40, { align: 'center' });
//     doc.text('EduWorld Team', width * 3/4, height - 40, { align: 'center' });
    
    

    
//     doc.save(`${courseTitle}_Certificate.pdf`);
//   };

//   return (
//     <button
//       onClick={generateCertificate}
//       className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-lg flex items-center justify-center"
//     >
//       <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v5m0 0l-3-3m3 3l3-3M2 6a2 2 0 012-2h16a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"></path>
//       </svg>
//       Download Certificate
//     </button>
//   );
// };

// export default Certificate;




import React from 'react';
import { format } from 'date-fns';

interface CertificateProps {
  courseTitle: string;
  studentName: string;
  completionDate: Date;
  instructorName?: string;
}

const Certificate: React.FC<CertificateProps> = ({
  courseTitle,
  studentName,
  completionDate,
  instructorName = 'Course Instructor',
}) => {
  const generateCertificate = () => {
    // Dynamically load jsPDF to ensure it's available
    import('jspdf').then(({ default: jsPDF }) => {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      // Background
      doc.setFillColor(252, 251, 247);
      doc.rect(0, 0, width, height, 'F');

      // Outer border
      doc.setDrawColor(190, 162, 60);
      doc.setLineWidth(3);
      doc.rect(15, 15, width - 30, height - 30, 'S');

      // Inner border
      doc.setDrawColor(190, 162, 60);
      doc.setLineWidth(0.5);
      doc.rect(20, 20, width - 40, height - 40, 'S');

      // Corner decorations
      const cornerSize = 15;
      doc.setDrawColor(70, 90, 140);
      doc.setLineWidth(1.5);
      doc.line(15, 25, 15 + cornerSize, 15);
      doc.line(25, 15, 15, 15 + cornerSize);
      doc.line(width - 15, 25, width - 15 - cornerSize, 15);
      doc.line(width - 25, 15, width - 15, 15 + cornerSize);
      doc.line(15, height - 25, 15 + cornerSize, height - 15);
      doc.line(25, height - 15, 15, height - 15 - cornerSize);
      doc.line(width - 15, height - 25, width - 15 - cornerSize, height - 15);
      doc.line(width - 25, height - 15, width - 15, height - 15 - cornerSize);

      // Watermark
      doc.setTextColor(240, 240, 240);
      doc.setFontSize(120);
      doc.setFont('helvetica', 'bold');
      doc.text('E', width / 2, height / 2, { align: 'center' });

      // Title
      doc.setFont('times', 'bold');
      doc.setFontSize(42);
      doc.setTextColor(70, 90, 140);
      doc.text('Certificate of Completion', width / 2, 50, { align: 'center' });

      // Title underline
      doc.setDrawColor(190, 162, 60);
      doc.setLineWidth(1);
      doc.line(width / 2 - 80, 58, width / 2 + 80, 58);

      // Student text
      doc.setFontSize(20);
      doc.setTextColor(70, 70, 70);
      doc.setFont('times', 'italic');
      doc.text('This certifies that', width / 2, 80, { align: 'center' });

      // Student name
      doc.setFont('times', 'bold');
      doc.setFontSize(32);
      doc.setTextColor(70, 90, 140);
      doc.text(studentName, width / 2, 100, { align: 'center' });

      // Name underline
      doc.setDrawColor(190, 162, 60);
      doc.setLineWidth(0.5);
      doc.line(width / 2 - 50, 105, width / 2 + 50, 105);

      // Course completion text
      doc.setFont('times', 'italic');
      doc.setFontSize(20);
      doc.setTextColor(70, 70, 70);
      doc.text('has successfully completed the course', width / 2, 120, { align: 'center' });

      // Course title
      doc.setFont('times', 'bold');
      doc.setFontSize(26);
      doc.setTextColor(70, 90, 140);
      const courseTitleWidth = doc.getTextWidth(courseTitle);
      if (courseTitleWidth < 180) {
        doc.setFillColor(245, 245, 250);
        doc.roundedRect(width / 2 - courseTitleWidth / 2 - 10, 128, courseTitleWidth + 20, 14, 2, 2, 'F');
      }
      doc.text(courseTitle, width / 2, 138, { align: 'center' });

      // Completion date
      doc.setFont('times', 'normal');
      doc.setFontSize(16);
      doc.setTextColor(70, 70, 70);
      const dateText = `Completed on: ${format(new Date(completionDate), 'MMMM dd, yyyy')}`;
      doc.text(dateText, width / 2, 160, { align: 'center' });

      // Decorative circles
      doc.setDrawColor(190, 162, 60);
      doc.setLineWidth(1);
      doc.circle(width / 2, 170, 15);
      doc.circle(width / 2, 170, 12);

      // Footer text
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('Issued by EduPlatform | Verify at eduplatform.com/verify', width / 2, height - 35, {
        align: 'center',
      });

      // Certificate ID
      const certId = `Certificate ID: EDU-${Date.now().toString().substring(5)}`;
      doc.setFontSize(10);
      doc.text(certId, width / 2, height - 28, { align: 'center' });

      // Signatures
      doc.setDrawColor(70, 90, 140);
      doc.setLineWidth(0.5);
      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(70, 70, 70);
      doc.text('Course Instructor:', width / 4, height - 50, { align: 'center' });
      doc.text('Authorized By:', width * 3 / 4, height - 50, { align: 'center' });
      doc.line(width / 4 - 30, height - 45, width / 4 + 30, height - 45);
      doc.line(width * 3 / 4 - 30, height - 45, width * 3 / 4 + 30, height - 45);
      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.text(instructorName, width / 4, height - 40, { align: 'center' });
      doc.text('EduWorld Team', width * 3 / 4, height - 40, { align: 'center' });

      // Trigger download
      try {
        doc.save(`${courseTitle}_Certificate.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate certificate. Please try again.');
      }
    }).catch((error) => {
      console.error('Error loading jsPDF:', error);
      alert('Failed to load PDF library. Please try again.');
    });
  };

  return (
    <button
      onClick={generateCertificate}
      className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-lg flex items-center justify-center"
    >
      <svg
        className="h-5 w-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 15v5m0 0l-3-3m3 3l3-3M2 6a2 2 0 012-2h16a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
        ></path>
      </svg>
      Download Certificate
    </button>
  );
};

export default Certificate;
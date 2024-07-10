import React from 'react';
import jsPDF from 'jspdf';
import { Award } from 'lucide-react';

interface CertificateProps {
  studentName: string;
  courseName: string;
}

const Certificate: React.FC<CertificateProps> = ({ studentName, courseName }) => {
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Set background color
    doc.setFillColor(247, 247, 247);
    doc.rect(0, 0, 297, 210, 'F');

    // Add border
    doc.setDrawColor(0);
    doc.setLineWidth(1);
    doc.rect(5, 5, 287, 200);

    // Add inner border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 277, 190);

    // Add decorative corners
    const cornerSize = 20;
    doc.setLineWidth(1);
    doc.setDrawColor(0);
    // Top left
    doc.line(5, 5, 5 + cornerSize, 5);
    doc.line(5, 5, 5, 5 + cornerSize);
    // Top right
    doc.line(292, 5, 292 - cornerSize, 5);
    doc.line(292, 5, 292, 5 + cornerSize);
    // Bottom left
    doc.line(5, 205, 5 + cornerSize, 205);
    doc.line(5, 205, 5, 205 - cornerSize);
    // Bottom right
    doc.line(292, 205, 292 - cornerSize, 205);
    doc.line(292, 205, 292, 205 - cornerSize);

    // Add EDU NEXUS in top left corner
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text('EDU NEXUS', 15, 20);

    // Add title
    doc.setFontSize(40);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(44, 62, 80);
    doc.text('Certificate of Completion', 148.5, 40, { align: 'center' });

    // Add content
    doc.setFontSize(20);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(52, 73, 94);
    doc.text('This is to certify that', 148.5, 70, { align: 'center' });

    doc.setFontSize(30);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text(studentName, 148.5, 90, { align: 'center' });

    doc.setFontSize(20);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(52, 73, 94);
    doc.text('has successfully completed the course', 148.5, 110, { align: 'center' });

    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185);
    doc.text(courseName, 148.5, 130, { align: 'center' });

    doc.setFontSize(16);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(52, 73, 94);
    doc.text(`Awarded on ${new Date().toLocaleDateString()}`, 148.5, 150, { align: 'center' });

    // Add signature line
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(70, 180, 227, 180);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Authorized Signature', 148.5, 188, { align: 'center' });

    doc.save('EDU_NEXUS_certificate.pdf');
  };

  return (
    <div className=" h-screen bg-gray-100 mt-6">
        <p className="mb-6 text-gray-600 text-center inter">Click the button below to generate and download your certificate.</p>
        <button 
          className="bg-black mx-auto hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out flex items-center justify-center"
          onClick={generatePDF}
        >
          <Award className="mr-2" size={20} />
          Download Certificate
        </button>
    </div>
  );
};

export default Certificate;
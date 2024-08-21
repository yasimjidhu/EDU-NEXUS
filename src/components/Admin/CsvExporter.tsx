import React from 'react';
import { Download } from 'lucide-react';
import Papa from 'papaparse';

interface CsvExporterProps {
  data: any[];
  filename: string;
  headers?: { label: string; key: string }[];
}

const CsvExporter: React.FC<CsvExporterProps> = ({ data, filename, headers }) => {
  const exportToCSV = () => {
    const csvData = headers
      ? data.map((item) =>
          headers.reduce((acc, header) => {
            acc[header.label] = item[header.key];
            return acc;
          }, {} as Record<string, any>)
        )
      : data;

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={exportToCSV}
      className="bg-black text-white px-4 py-2 rounded-lg transition duration-300 flex items-center"
    >
      <Download size={20} className="mr-2" />
      Export CSV
    </button>
  );
};

export default CsvExporter;

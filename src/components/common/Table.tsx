import React from 'react';

interface TableProps {
  heading: string;
  headings: string[];
  data: Array<{ [key: string]: any }>;
}

export const Table: React.FC<TableProps> = ({ heading, headings, data }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">{heading}</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              {headings.map((item, index) => (
                <th key={index} className="text-left p-2">{item}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
                {headings.map((heading, idx) => (
                  <td key={idx} className="p-2">{row[heading]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

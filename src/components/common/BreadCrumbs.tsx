import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BreadCrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav className="flex ml-56" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 inter-sm">
        <li className="inline-flex items-center">
          <Link to="/" className="text-gray-700 hover:text-gray-900">
            
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          return (
            <li key={to} className="inline-flex items-center">
             /
              <Link to={to} className="text-gray-700 hover:text-gray-900">
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default BreadCrumbs;

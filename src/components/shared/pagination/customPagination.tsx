import React, { useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  variant?: 'simple' | 'compact' | 'detailed';
  className?: string;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showTotal?: boolean;
  alwaysShowFirstLast?: boolean;
  maxDisplayedPages?: number;
}

interface PaginationItemProps {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const PaginationItem: React.FC<PaginationItemProps> = ({
  children,
  active,
  disabled,
  onClick,
  className = ''
}) => {
  const baseStyles = `
    flex items-center justify-center w-10 h-10 rounded-lg
    transition-all duration-200 cursor-pointer text-sm font-medium
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
  `;

  const activeStyles = active
    ? 'bg-orange-500 text-white hover:bg-orange-600'
    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200';

  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : '';

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      className={`${baseStyles} ${activeStyles} ${disabledStyles} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
};

// Items Per Page Selector Component
const ItemsPerPageSelector: React.FC<{
  value: number;
  options: number[];
  onChange: (value: number) => void;
}> = ({ value, options, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Items per page:</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-2 py-1 border border-gray-200 rounded-lg text-sm focus:outline-none
          focus:ring-2 focus:ring-orange-500"
          title='items per page'
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  variant = 'detailed',
  className = '',
  showItemsPerPage = false,
  itemsPerPageOptions = [10, 20, 50, 100],
  onItemsPerPageChange,
  showTotal = true,
  alwaysShowFirstLast = true,
  maxDisplayedPages = 5
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getPageNumbers = useCallback(() => {
    const pages: (number | string)[] = [];
    const halfDisplay = Math.floor(maxDisplayedPages / 2);

    // Always add first page
    if (alwaysShowFirstLast) {
      pages.push(1);
      if (currentPage > halfDisplay + 2) {
        pages.push('...');
      }
    }

    // Calculate range of pages to display
    let start = Math.max(alwaysShowFirstLast ? 2 : 1, currentPage - halfDisplay);
    let end = Math.min(alwaysShowFirstLast ? totalPages - 1 : totalPages, currentPage + halfDisplay);

    // Adjust range if at the start or end
    if (currentPage <= halfDisplay) {
      end = Math.min(maxDisplayedPages, totalPages);
    }
    if (currentPage >= totalPages - halfDisplay) {
      start = Math.max(alwaysShowFirstLast ? 2 : 1, totalPages - maxDisplayedPages + 1);
    }

    // Add page numbers
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Always add last page
    if (alwaysShowFirstLast && currentPage < totalPages - halfDisplay - 1) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages, maxDisplayedPages, alwaysShowFirstLast]);

  const pageNumbers = useMemo(() => getPageNumbers(), [getPageNumbers]);

  const renderPaginationItems = () => {
    switch (variant) {
      case 'simple':
        return (
          <div className="flex items-center gap-2">
            <PaginationItem
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </PaginationItem>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <PaginationItem
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </PaginationItem>
          </div>
        );

      case 'compact':
        return (
          <div className="flex items-center gap-2">
            <PaginationItem
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              <ChevronLeft className="w-4 h-4 -ml-2" />
            </PaginationItem>
            <PaginationItem
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </PaginationItem>
            <PaginationItem active>
              {currentPage}
            </PaginationItem>
            <PaginationItem
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </PaginationItem>
            <PaginationItem
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
              <ChevronRight className="w-4 h-4 -ml-2" />
            </PaginationItem>
          </div>
        );

      case 'detailed':
      default:
        return (
          <div className="flex items-center gap-2">
            <PaginationItem
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </PaginationItem>
            
            {pageNumbers.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-2">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </span>
                ) : (
                  <PaginationItem
                    active={currentPage === page}
                    onClick={() => onPageChange(Number(page))}
                  >
                    {page}
                  </PaginationItem>
                )}
              </React.Fragment>
            ))}
            
            <PaginationItem
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </PaginationItem>
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-4">
        {showItemsPerPage && onItemsPerPageChange && (
          <ItemsPerPageSelector
            value={itemsPerPage}
            options={itemsPerPageOptions}
            onChange={onItemsPerPageChange}
          />
        )}
        {showTotal && (
          <span className="text-sm text-gray-500">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{' '}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
          </span>
        )}
      </div>
      {renderPaginationItems()}
    </div>
  );
};

// Example Usage
export const PaginationExample: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const totalItems = 256;

  return (
    <div className="space-y-8">
      {/* Detailed Variant */}
      <div>
        <h3 className="text-lg font-medium mb-4">Detailed Pagination</h3>
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          showItemsPerPage
          variant="detailed"
        />
      </div>

      {/* Simple Variant */}
      <div>
        <h3 className="text-lg font-medium mb-4">Simple Pagination</h3>
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          variant="simple"
        />
      </div>

      {/* Compact Variant */}
      <div>
        <h3 className="text-lg font-medium mb-4">Compact Pagination</h3>
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          variant="compact"
        />
      </div>
    </div>
  );
};
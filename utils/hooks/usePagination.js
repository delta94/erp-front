import { useState, useCallback } from 'react';

const usePagination = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
  });

  const handlePaginationChange = useCallback((page, size) => {
    setPagination({ page, size });
  }, []);

  return [
    pagination,
    {
      showSizeChanger: true,
      onShowSizeChange: handlePaginationChange,
      onChange: handlePaginationChange,
    },
  ];
};

export default usePagination;

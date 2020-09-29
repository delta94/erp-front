import { useState, useCallback, useMemo } from 'react';
import {
  applyFilter, applySorter, mapFilters, mapSorting,
} from '../index';

const useFilters = (col, filtersData = {}) => {
  const [filters, setFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  const columns = useMemo(() => col.map((item) => ({
    ...item,
    filters: item.filters || applyFilter(filtersData[item.dataIndex]),
    sorter: item.sorter || applySorter(filtersData[item.dataIndex]),
  })), [col, filtersData]);

  const onChange = useCallback((p, f, sorter, source) => {
    if (source.action === 'filter') setFilters(mapFilters(f));
    if (source.action === 'sort') setSorting(mapSorting(sorter));
  }, []);

  return [
    filters, sorting, { onChange, columns },
  ];
};

export default useFilters;

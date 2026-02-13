import { useState, useMemo } from 'react';

export const useTIDPFilters = (tidps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMilestone, setFilterMilestone] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const disciplines = useMemo(() => {
    const disciplineSet = new Set(tidps.map(tidp => tidp.discipline).filter(Boolean));
    return Array.from(disciplineSet);
  }, [tidps]);

  const statuses = useMemo(() => {
    const statusSet = new Set(tidps.map(tidp => tidp.status).filter(Boolean));
    return Array.from(statusSet);
  }, [tidps]);

  const milestones = useMemo(() => {
    const milestoneSet = new Set();
    tidps.forEach(tidp => {
      tidp.containers?.forEach(container => {
        const milestone = container.Milestone || container.deliveryMilestone || container['Delivery Milestone'];
        if (milestone) milestoneSet.add(milestone);
      });
    });
    return Array.from(milestoneSet).sort();
  }, [tidps]);

  const filteredTidps = useMemo(() => {
    return tidps.filter(tidp => {
      const matchesSearch = !searchTerm ||
        tidp.teamName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tidp.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tidp.discipline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tidp.leader?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tidp.company?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDiscipline = filterDiscipline === 'all' || tidp.discipline === filterDiscipline;

      const matchesStatus = filterStatus === 'all' || tidp.status === filterStatus;

      const matchesMilestone = filterMilestone === 'all' || tidp.containers?.some(c => {
        const m = c.Milestone || c.deliveryMilestone || c['Delivery Milestone'];
        return m === filterMilestone;
      });

      let matchesDateRange = true;
      if (filterDateFrom || filterDateTo) {
        const containerDates = tidp.containers?.map(c => c['Due Date'] || c.dueDate).filter(Boolean) || [];
        if (containerDates.length > 0) {
          const from = filterDateFrom ? new Date(filterDateFrom) : new Date('1900-01-01');
          const to = filterDateTo ? new Date(filterDateTo) : new Date('9999-12-31');
          matchesDateRange = containerDates.some(d => {
            const date = new Date(d);
            return !isNaN(date.getTime()) && date >= from && date <= to;
          });
        }
      }

      return matchesSearch && matchesDiscipline && matchesStatus && matchesMilestone && matchesDateRange;
    });
  }, [tidps, searchTerm, filterDiscipline, filterStatus, filterMilestone, filterDateFrom, filterDateTo]);

  return {
    searchTerm,
    setSearchTerm,
    filterDiscipline,
    setFilterDiscipline,
    filterStatus,
    setFilterStatus,
    filterMilestone,
    setFilterMilestone,
    filterDateFrom,
    setFilterDateFrom,
    filterDateTo,
    setFilterDateTo,
    disciplines,
    statuses,
    milestones,
    filteredTidps
  };
};

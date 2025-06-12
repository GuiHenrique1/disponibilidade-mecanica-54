
export const formatDateTimeForInput = (dateStr: string, timeStr: string): string => {
  if (!dateStr || !timeStr) return '';
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month}-${day}T${timeStr}`;
};

export const formatDateTimeForStorage = (dateTimeStr: string) => {
  if (!dateTimeStr) return { date: '', time: '' };
  const [datePart, timePart] = dateTimeStr.split('T');
  const [year, month, day] = datePart.split('-');
  return {
    date: `${day}-${month}-${year}`,
    time: timePart
  };
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Aberta': return 'text-red-600 bg-red-50';
    case 'Concluída': return 'text-green-600 bg-green-50';
    case 'Cancelada': return 'text-gray-600 bg-gray-50';
    default: return 'text-gray-600 bg-gray-50';
  }
};

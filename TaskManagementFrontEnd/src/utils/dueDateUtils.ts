export const getUrgencyColor = (dueDate: string | Date | undefined): string => {
    if (!dueDate) return '#e0e0e0'; // Gray for no date

    const today = new Date();
    const due = new Date(dueDate);
    const diffInDays = (due.getTime() - today.getTime()) / (1000 * 3600 * 24);

    if (diffInDays < 0) return '#dc3545'; // Overdue: Red
    if (diffInDays <= 2) return '#ffc107'; // Due soon (within 2 days): Yellow/Orange
    return '#28a745'; // Far off: Green
};
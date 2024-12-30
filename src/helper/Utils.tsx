import dayjs from 'dayjs';

export function formatDate (dateString: string | undefined): string {
    if (!dateString) {
        return '';
    }
    return dayjs(dateString).format('DD.MM.YYYY');
}

export function formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}






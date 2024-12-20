import dayjs from 'dayjs';

export default function formatDate (dateString: string | undefined): string {
    if (!dateString) {
        return ''; // return an empty string or a default value if undefined
    }
    return dayjs(dateString).format('DD.MM.YYYY');
};





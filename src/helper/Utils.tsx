import dayjs from 'dayjs';

export function formatStringToDate (dateString: string | undefined): string {
    if (!dateString) {
        return '';
    }
    return dayjs(dateString).format('DD.MM.YYYY');
}

export function getGermanMonthName(month: number): string {
    interface GermanMonthNames {
        [key: number]: string
    }
    const germanMonthNames: GermanMonthNames = {
        0: "Januar",
        1: "Februar",
        2: "März",
        3: "April",
        4: "Mai",
        5: "Juni",
        6: "Juli",
        7: "August",
        8: "September",
        9: "Oktober",
        10: "November",
        11: "Dezember",
    };
    return germanMonthNames[month];
}






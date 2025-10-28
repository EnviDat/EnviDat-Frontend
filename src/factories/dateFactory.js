import { format, parse } from 'date-fns';

/**
 * @param {string} date expecting a format like 2017-08-15T15:25:45.175790
 * @param {string} inputFormat, it's optional
 * @param {boolean} formatNoTime, if true, only the date is returned in dd.MM.yyyy format
 * @return {string} Returns a date string; if formatNoTime is true, returns "dd.MM.yyyy", otherwise returns date and hours:minutes
 */
export function formatDate(date, inputFormat = 'yyyy-MM-dd', formatNoTime = false) {
  let formatedDate = '';

  if (typeof date === 'string' && date.trim() !== '') {
    const split = date.split('T');
    if (split.length > 1) {
      const dateOnly = split[0];
      const parsedDate = parse(dateOnly, inputFormat, new Date(date));

      if (formatNoTime) {
        // Return only the date in dd.MM.yyyy format
        formatedDate = format(parsedDate, 'dd.MM.yyyy');
      } else {
        // Return date and time (hours:minutes)
        const newDate = format(parsedDate, 'd. MMM yyyy');
        const timeOnly = split[1];
        const timeSplit = timeOnly.split('.');
        let timeToMinutes = timeSplit[0];
        timeToMinutes = timeToMinutes.substring(0, 5);
        formatedDate = `${newDate} ${timeToMinutes}`;
      }
    } else {
      // fallback: just return the input
      formatedDate = date;
    }
  }

  return formatedDate;
}

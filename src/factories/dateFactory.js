import { format, parse } from 'date-fns';

/**
 * @param {String} date expecting a format like 2017-08-15T15:25:45.175790
 * @param {String} inputFormat, it's optional
 * @return {String} Returns a date string containing the date and hours:minutes:seconds
 */
export function formatDate(date, inputFormat = 'yyyy-MM-dd') {
  // expecting a format like 2017-08-15T15:25:45.175790
  let formatedDate = '';

  if (typeof date === 'string' && date.trim() !== '') {
    const split = date.split('T');
    if (split.length > 1) {
      const dateOnly = split[0];
      const parsedDate = parse(dateOnly, inputFormat, new Date(date));
      const newDate = format(parsedDate, 'd. MMM yyyy');

      const timeOnly = split[1];
      const timeSplit = timeOnly.split('.');
      let timeToMinutes = timeSplit[0];
      timeToMinutes = timeToMinutes.substring(0, 5);

      formatedDate = `${newDate} ${timeToMinutes}`;
    } else {
      // fallback: just return the input
      formatedDate = date;
    }
  }


  return formatedDate;
}

import { parseISO, format } from 'date-fns';

//You can view the different format() string options on the date-fns website.
export default function Date({ dateString }) {
  const date = parseISO(dateString);
  return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>;
}
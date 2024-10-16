import {monthNames} from '../constants/appInfo';

export class HandleDateTime {
  static DateString = (num: number) => {
    const date = new Date(num);

    return `${date.getDate()} ${
      monthNames[date.getMonth()]
    } ${date.getFullYear()}`;
  };

  //   static GetHour = (num: number) => {
  //     const date = new Date(num);

  //     return `${date.getHours()}`;
  //   };
  static GetHour = (num: number) => {
    const date = new Date(num);
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert hour from 24-hour format to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If hour is 0, it should be 12

    return `${hours} ${ampm}`;
  };
}

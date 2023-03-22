const currentDate = new Date();
const totalDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

export const daysInArray = Array.from({ length: totalDays }, (_, index) => index + 1);

export function CollectDateNumFromFirestore(day) {
    const dateObj = new Date(day);
    const dayofMonth = dateObj.getDate();

    return [dayofMonth];
}

export function getMonthName() {
    const currentDate = new Date();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return monthNames[currentDate.getMonth()];
}

export function getNextMonthName() {
    const currentDate = new Date();

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return monthNames[currentDate.getMonth()+1];
}

export function getOrdinalSuffix(num) {
    const lastDigit = num % 10;
    const lastTwoDigits = num % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
        return "th";
      } else if (lastDigit === 1) {
        return "st";
      } else if (lastDigit === 2) {
        return "nd";
      } else if (lastDigit === 3) {
        return "rd";
      } else {
        return "th";
      }
}

export function addLeadingZero(num) {
    if (num >= 1 && num <= 9) {
        return "0" + num;
    } else {
        return num;
    }
}

export function parseDeadlineData(deadline) {
    const regex = /^[0-9][1,2,3,4,5,6,7,8,9,0]/;
    const match = regex.exec(deadline);

    if (match) {
        return match[0];
    }
    return null;
}
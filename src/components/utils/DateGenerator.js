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
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

export function FormattedFirstDayCurrentMonth() {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // add 1 because getMonth() returns a zero-based index
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const formattedDate = `${firstDayOfMonth.getFullYear()}-${currentMonth.toString().padStart(2, '0')}-01T00:00:00.000Z`;

    return formattedDate;
}
//數字加千位數逗點 0,000
function addComma(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Date
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('/');
}

//加總
function totalData(arr) {
    let num = 0;
    for (let i = 0; i < arr.length; i++) {
        num += arr[i];
    };
    return num;
}

export { addComma, formatDate, totalData }
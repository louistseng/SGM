//數字加千位數逗點 0,000
function addComma(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export { addComma }
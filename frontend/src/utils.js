const getCurrentDate = function () {
    const date = new Date().toJSON().slice(0, 10);
    return date;
};

const getDaysDiff = function (earlyDateString, laterDateString) {
    const date1 = new Date(earlyDateString);
    const date2 = new Date(laterDateString);
    return Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
};

export { getCurrentDate, getDaysDiff };

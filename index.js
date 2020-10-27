const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, '/', 'currency.json');
const logFilePath = path.join(__dirname, '/', 'text.txt');

let currencyData = {};

function convert(value, currencyFrom, currencyTo) {
    const rateFrom = currencyData.rates[currencyFrom];
    const rateTo = currencyData.rates[currencyTo];
    const endValue = (value * rateTo / rateFrom).toFixed(3);

    console.log(endValue);

    fs.appendFile(logFilePath, `\n${value} ${currencyFrom} = ${endValue} ${currencyTo}`, err => {
        if (err) {
            throw err;
        }
    })

    return endValue;
};


fs.readFile(filePath, (err, data) => {
    console.log('Get data from local json file');
    if (err) {
        throw err
    }

    try {
        currencyData = JSON.parse(data);

        // convert(100, 'EUR', 'BYN');
        // convert(100, 'USD', 'EUR');
        // convert(200, 'PLN', 'EUR');
        // convert(1000, 'UAH', 'BYN');
        convert(1, 'BYN', 'KZT');

    } catch (err) {
        console.log(err.message);
    }
})
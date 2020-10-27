const fs = require("fs");
const path = require("path");
const http = require('https');

const filePath = path.join(__dirname, '/', 'currency.json');
const logFilePath = path.join(__dirname, '/', 'text.txt');

const key = '0e173ac4cf374fdb91ace24e7b6e5f77';
const app_key = `https://openexchangerates.org/api/latest.json?app_id=${key}`;

let currencyData = {};

function convert(value, currencyFrom, currencyTo) {
    const rateFrom = currencyData.rates[currencyFrom];
    const rateTo = currencyData.rates[currencyTo];
    const endValue = (value * rateTo / rateFrom).toFixed(3);

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


http.get(app_key, (res) => {
    console.log('Get data from API');
    let data = '';
    res.on('data', (chunk) => data += chunk);

    res.on('end', () => {
        try {
            currencyData = JSON.parse(data);

            convert(100, 'EUR', 'BYN');
            // convert(100, 'USD', 'EUR');
            // convert(200, 'PLN', 'EUR');
            // convert(1000, 'UAH', 'BYN');
            // convert(100, 'BYN', 'KZT');

        } catch (e) {
            console.log(e.message);
        }
    });

}).on('error', (err) => {
    console.log(`Got error: ${err.message}`);
});
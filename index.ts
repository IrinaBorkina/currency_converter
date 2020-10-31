import fs from 'fs';
import path from 'path';
import https from 'https';
import express from 'express';
import { parseData, addition, subtraction, multiplication, division } from './utils';
import { ICurrency, IRequest, IDataForConvert, IDataForCalculate } from './models';

const logFilePath = path.join(__dirname, '/', 'text.txt');

const key: string = '0e173ac4cf374fdb91ace24e7b6e5f77';
const currencyConverterEndpoint: string = `https://openexchangerates.org/api/latest.json?app_id=${key}`;

const app = express();


let currencyData: ICurrency;

// get data with currency courses
https.get(currencyConverterEndpoint, res => {
    console.log('Get data from currency API');

    let dataFromApi = '';

    res.on('data', (chunk) => {
        dataFromApi += chunk;
    });

    res.on('end', () => {
        try {
            currencyData = parseData(dataFromApi);
        } catch (err) {
            console.log(err.message);
        }
    });
}).on('error', (err) => {
    console.log(`Conversion is not possible: ${err.message}`);
});


// define a route handler for the default home page
app.get("/", (req, res) => {
    console.log('Hello from Express!');

    res.send("Hello from Express!");
});



let dataForConvert: IDataForConvert;

// converting sum from one currency to another
app.get("/convert", (req: IRequest, res) => {
    console.log('---Converting---');

    let messageToUI = '';

    const regexp = /(^\d*\.\d*[1-9]+\d*$)|(^[1-9]+\.?\d*$)/gm;

    if (currencyData.rates[req.query.from] === undefined
        || currencyData.rates[req.query.to] === undefined
        || !regexp.test(req.query.amount)
    ) {
        messageToUI = "please, enter a valid FROM or TO or AMOUNT values"
        console.log(messageToUI);
    } else {
        dataForConvert = {
            currencyFrom: req.query.from,
            currencyTo: req.query.to,
            value: +req.query.amount
        };

        let rateFrom: number = currencyData.rates[dataForConvert.currencyFrom];
        let rateTo: number = currencyData.rates[dataForConvert.currencyTo];

        let endValue = (dataForConvert.value * rateTo / rateFrom).toFixed(3);
        messageToUI = `${dataForConvert.value} ${dataForConvert.currencyFrom} = ${endValue} ${dataForConvert.currencyTo}`
        console.log(messageToUI);

        fs.appendFile(logFilePath, `\n${messageToUI}`, err => {
            if (err) {
                console.log(`Adding to file is not possible: ${err.message}`);
            }
        })
    }

    res.send(messageToUI)
});



let dataForCalculate: IDataForCalculate;

let arithmeticOperations = ['addition', 'subtraction', 'multiplication', 'division']

// currency calculating
app.get("/calculate", (req: any, res: any) => {
    console.log('---Calculating---');

    let message: string = '';

    const regexp = /^(-?\d+\.\d+)$|^(-?\d+)$/gm;

    if (req.query.first === ''
        || req.query.second === ''
        || req.query.action === ''
        || currencyData.rates[req.query.first.slice(-3)] === undefined
        || currencyData.rates[req.query.second.slice(-3)] === undefined
        || !arithmeticOperations.includes(req.query.action)
        || (req.query.first.substring(0, req.query.first.length - 3).match(regexp) === null)
        || (req.query.second.substring(0, req.query.second.length - 3).match(regexp) === null)
    ) {
        message = "please, enter a valid FIRST ot SECOND or ACTION values";
        console.log(message);
    } else {
        dataForCalculate = {
            firstPart: req.query.first,
            secondPart: req.query.second,
            action: req.query.action
        };

        let currFrom: number = currencyData.rates[dataForCalculate.firstPart.slice(-3)];
        let currTo: number = currencyData.rates[dataForCalculate.secondPart.slice(-3)];

        let firstValue = +dataForCalculate.firstPart.substring(0, dataForCalculate.firstPart.length - 3);
        let secondValue = +dataForCalculate.secondPart.substring(0, dataForCalculate.secondPart.length - 3);

        let a = +firstValue.toFixed(3);
        let b = +(secondValue * currFrom / currTo).toFixed(3);

        let a1 = +(firstValue * currTo / currFrom).toFixed(3);
        let b1 = +secondValue.toFixed(3);

        let resultFirstCurrency: number;
        let resultSecondCurrency: number;

        switch (dataForCalculate.action) {
            case arithmeticOperations[0]:
                resultFirstCurrency = addition(a, b);
                resultSecondCurrency = addition(a1, b1);
                message = `addition: ${dataForCalculate.firstPart} + ${dataForCalculate.secondPart} = ${resultFirstCurrency} ${dataForCalculate.firstPart.slice(-3)} || ${resultSecondCurrency} ${dataForCalculate.secondPart.slice(-3)}`;
                console.log(message);
                break;
            case arithmeticOperations[1]:
                resultFirstCurrency = subtraction(a, b);
                resultSecondCurrency = subtraction(a1, b1);
                message = `subtraction: ${dataForCalculate.firstPart} - ${dataForCalculate.secondPart} = ${resultFirstCurrency} ${dataForCalculate.firstPart.slice(-3)} || ${resultSecondCurrency} ${dataForCalculate.secondPart.slice(-3)}`;
                console.log(message);
                break;
            case arithmeticOperations[2]:
                resultFirstCurrency = multiplication(a, b);
                resultSecondCurrency = multiplication(a1, b1);
                message = `multiplication: ${dataForCalculate.firstPart} * ${dataForCalculate.secondPart} = ${resultFirstCurrency} ${dataForCalculate.firstPart.slice(-3)} || ${resultSecondCurrency} ${dataForCalculate.secondPart.slice(-3)}`;
                console.log(message);
                break;
            case arithmeticOperations[3]:
                resultFirstCurrency = division(a, b);
                resultSecondCurrency = division(a1, b1);
                message = `division: ${dataForCalculate.firstPart} / ${dataForCalculate.secondPart} = ${resultFirstCurrency} ${dataForCalculate.firstPart.slice(-3)} || ${resultSecondCurrency} ${dataForCalculate.secondPart.slice(-3)}`;
                console.log(message);
                break;

            default:
                break;
        }

        fs.appendFile(logFilePath, `\n${message}`, err => {
            if (err) {
                console.log(`Adding to file is not possible: ${err.message}`);
            }
        })
    }
    res.send(message)
});

// start the express server
app.listen(3000, () => console.log(`Server started at http://localhost:3000`));


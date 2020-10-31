export interface ICurrency {
    disclaimer: string,
    license: string,
    timestamp: string,
    base: string,
    rates: { [x: string]: number; }
}


export interface IRequest {
    query: {
        from: string;
        to: string;
        amount: string;
    };
}


export interface IDataForConvert {
    currencyFrom: string,
    currencyTo: string,
    value: number
}


export interface IDataForCalculate {
    firstPart: string,
    secondPart: string,
    action: string
}
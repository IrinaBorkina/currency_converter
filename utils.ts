export function parseData(data: string) {
    return JSON.parse(data);
}

export function addition(a: number, b: number) {
    return +(a + b).toFixed(3);
}

export function subtraction(a: number, b: number) {
    return +(a - b).toFixed(3);
}

export function multiplication(a: number, b: number) {
    return +(a * b).toFixed(3);
}

export function division(a: number, b: number) {
    return +(a / b).toFixed(3);
}
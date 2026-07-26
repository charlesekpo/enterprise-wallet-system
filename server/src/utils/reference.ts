export const generateReference = (prefix: string = 'TRX'): string =>{
    return `${prefix}-${Date.now()}`;
}
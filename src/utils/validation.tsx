export const isValidCudosAddress = (addr: string) => {
    if (addr === '' || addr === undefined) return false
    const addressCheck = addr.replace(/^cudos[0-9a-z]{39}$/gm, 'OK');
    return addressCheck === 'OK'
}

// Handling whole numbers at the moment
export const isValidAmount = (amount: string) => {
    if (amount === '' || amount === undefined) return false
    const amountCheck = amount.replace(/^[1-9]{1}[0-9]*$/gm, 'OK')
    return amountCheck === 'OK'
}

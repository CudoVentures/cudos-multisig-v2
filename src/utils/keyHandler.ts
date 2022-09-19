import { Coin } from "cudosjs"
import { FORBIDDEN_SYMBOLS, FORBIDDEN_SYMBOLS_CUDOS_ADMIN } from "./constants"

export const handleKeyDownBalance = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, balance: Coin | undefined) => {
    let forbiddenSymbols: string[]
    if (balance!.denom === 'cudosAdmin') {
        forbiddenSymbols = FORBIDDEN_SYMBOLS_CUDOS_ADMIN
    } else {
        forbiddenSymbols = FORBIDDEN_SYMBOLS
    }

    if (forbiddenSymbols.includes(event.key)) {
        event!.preventDefault()
    }
}

export const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (FORBIDDEN_SYMBOLS_CUDOS_ADMIN.includes(event.key)) {
        event.preventDefault()
    }
}
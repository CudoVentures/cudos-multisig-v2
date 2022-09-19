import { coin, Coin } from "cudosjs"
import { ADMIN_TOKEN_DENOM, FORBIDDEN_SYMBOLS, FORBIDDEN_SYMBOLS_CUDOS_ADMIN } from "./constants"

export const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    denom: string = ADMIN_TOKEN_DENOM
) => {
    let forbiddenSymbols = FORBIDDEN_SYMBOLS
    if (denom === ADMIN_TOKEN_DENOM) {
        forbiddenSymbols = FORBIDDEN_SYMBOLS_CUDOS_ADMIN
    }

    if (forbiddenSymbols.includes(event.key)) {
        event!.preventDefault()
    }
}

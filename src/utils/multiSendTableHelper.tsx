import styled from "@emotion/styled";
import { Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import BigNumber from "bignumber.js";
import { Coin } from "cudosjs";
import { amountToAcudos, denomToAlias } from "./helpers";

export interface MultiSendUser {
    address: string;
    coins: Coin[];
}

export interface BalanceMap {
    [key: string]: BigNumber
}

export interface multisendRow {
    recipient: string,
    amount: string,
    denom: string
}

export interface RecipientBalances {
    [key: string]: number
}

export interface TableRecipients {
    [key: string]: RecipientBalances
}

export interface AmountDueBalances {
    [key: string]: string
}

export const sortArrayOfCoinsByDenom = (coins: Coin[], direction: 'asc' | 'desc'): Coin[] => {
    if (direction === 'asc') {
        return coins.sort((a, b) => a.denom.localeCompare(b.denom))
    }
    return coins.sort((a, b) => b.denom.localeCompare(a.denom))
}

export const createArrayOfRecipients = (rows: multisendRow[]) => {
    const recipients = rows.map((item) => ({
        address: item.recipient,
        coins: [{
            denom: item.denom,
            amount: item.denom === "acudos" ? amountToAcudos(parseFloat(item.amount)) : item.amount
        }]
    }))

    return recipients
}
export const createArrayOfCoinsFromMapper = (dueBalances: RecipientBalances): Coin[] => {
    const coins: Coin[] = []
    const entries = Object.entries(dueBalances)

    entries.map(
        ([denom, amount]) => {

            let tempAmount: string = amount.toString()

            switch (denom) {
                case 'acudos':
                    tempAmount = amountToAcudos(amount)
                    break
                default:
                    break
            }

            const coin: Coin = {
                denom: denom,
                amount: tempAmount
            }
            coins.push(coin)
        }
    )

    return sortArrayOfCoinsByDenom(coins, 'asc')
}

export const displayDueBalances = (dueBalances: RecipientBalances): JSX.Element => {
    const entries = Object.entries(dueBalances);
    const listItems = entries.map(
        ([denom, amount]) => {
            return (
                <div>
                    {`${amount} ${denomToAlias[denom as keyof typeof denomToAlias]}`}
                </div>
            )
        }
    )
    return (
        <div>
            {listItems}
        </div>
    )
}

export const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 'max-content',
        //@ts-ignore
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))

export const totalAmountDue = (rows: multisendRow[]): RecipientBalances => {
    const balanceMapper: RecipientBalances = {}

    if (rows) {
        for (const txBalance of rows) {
            if (!balanceMapper[txBalance.denom]) {
                balanceMapper[txBalance.denom] = parseFloat(txBalance.amount)
            } else {
                balanceMapper[txBalance.denom] += parseFloat(txBalance.amount)
            }
        }
    }

    return balanceMapper
}

export const mergeData = (oldData: multisendRow[], newData: TableRecipients): multisendRow[] => {

    const newRows: multisendRow[] = []
    const updatedData: TableRecipients = { ...newData }

    if (oldData!.length > 0) {
        for (let i = 0; i < oldData!.length; i++) {
            const oldRecord = oldData![i]

            if (updatedData[oldRecord.recipient]) {
                if (updatedData[oldRecord.recipient][oldRecord.denom]) {
                    updatedData[oldRecord.recipient][oldRecord.denom] += parseFloat(oldRecord.amount)
                } else {
                    updatedData[oldRecord.recipient][oldRecord.denom] = parseFloat(oldRecord.amount)
                }

            } else {
                updatedData[oldRecord.recipient] = {
                    [oldRecord.denom]: parseFloat(oldRecord.amount)
                }
            }

        }

    }

    Object.entries(updatedData).forEach(([newAddress, balances]) => {
        Object.entries(balances).forEach(([denom, amount]) => {
            newRows.push({
                recipient: newAddress,
                amount: amount.toString(),
                denom: denom
            })
        })
    })

    return newRows
}

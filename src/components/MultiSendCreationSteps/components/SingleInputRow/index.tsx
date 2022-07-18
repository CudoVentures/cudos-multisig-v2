
import { Tooltip, Input, Button, Select, MenuItem, FormControl, Box }  from '@mui/material'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { styles } from './styles'
import PlusIcon from 'assets/vectors/plus-icon.svg'
import { updateSendFunds } from 'store/sendFunds'
import { isValidAmount, isValidCudosAddress } from 'utils/validation'
import { Coin } from 'cudosjs'
import { denomToAlias } from 'utils/helpers'
import BigNumber from 'bignumber.js'
import { mergeData, TableRecipients } from 'utils/multiSendTableHelper'

const SingleInputRow = () => {

    const initialState = {
        isOpen: false,
        recipientAddress: '',
        recipientAmount: '',
        selectedDenom: ''
    }

    const dispatch = useDispatch()
    const [state, setState] = useState({ ...initialState })
    const { multisendRows } = useSelector((state: RootState) => state.sendFunds)
    const { selectedWallet } = useSelector((state: RootState) => state.userState)


    const handleChange = (e: any) => {
        const { name, value } = e.target
        setState({...state,
            [e.target.name]:[value]
        })
    }

    const handleAddRow = () => {

        const newRecord: TableRecipients = {
            [state.recipientAddress[0]]: {
                [state.selectedDenom[0]]: parseFloat(state.recipientAmount[0])
            }
        }

        const updatedData = mergeData(multisendRows!, newRecord)
        dispatch(updateSendFunds({multisendRows: updatedData}))

        //@ts-ignore
        document!.getElementById('singleAddressTab').value! = ''
        //@ts-ignore
        document!.getElementById('singleAmountTab').value! = ''
        
        setState({...state,
            recipientAddress: '',
            recipientAmount: '',
        })
    }

    const enoughBalance = (): boolean => {
        for (const balance of selectedWallet!.walletBalances!) {
            if (balance.denom == state.selectedDenom[0]) {
                const amount = balance.denom === 'acudos'?parseFloat(state.recipientAmount[0]) * 10 ** 18:state.recipientAmount[0]
                return new BigNumber(amount).lte(new BigNumber(balance.amount))
            }
        }
        return false
    }

    const validInput = isValidCudosAddress(state.recipientAddress[0]) && isValidAmount(state.recipientAmount[0]) && enoughBalance()

    return (
            <div className='input-group' style={styles.inputGroup}>
                <div id='wallet-address-group' style={{display: 'grid', justifyItems: 'start'}}>
                    <span style={{margin: '20px 0 10px 0'}}>Wallet address</span>
                    <Input
                    disableUnderline
                    style={styles.walletInput}
                    type="text"
                    name="recipientAddress"
                    id='singleAddressTab'
                    placeholder="e.g cudos1nkf0flyugd2ut40cg4tn48sp70p2e65wse8abc"
                    onChange={handleChange}
                    className="form-control"
                    />
                </div>
                <div id='amount-group' style={{ display: 'grid', justifyItems: 'start'}}>
                    <span style={{margin: '20px 0 10px 0'}}>Amount</span>
                    <Input
                        disableUnderline
                        style={styles.amountInput}
                        type="number"
                        name="recipientAmount"
                        id='singleAmountTab'
                        placeholder="0"
                        onKeyDown={event => {
                            const forbiddenSymbols = 
                                state.selectedDenom[0] === 'cudosAdmin'?
                                ['e', 'E', '+', "-", ",", "."]:
                                ['e', 'E', '+', "-"]
                            if (forbiddenSymbols.includes(event.key)) {event!.preventDefault()}
                        }}
                        onPaste={(e)=>{e.preventDefault()}} 
                        onChange={handleChange}
                    />
                </div>
                <div id='amount-group' style={{ position: 'relative', display: 'grid', justifyItems: 'start'}}>
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth style={{borderRadius: '5px', backgroundColor:'#28314E', width: 'fit-content'}}>
                            <Select
                                sx={() => ({
                                width: '160px',
                                height: '50px',
                                borderRadius: '10px'
                                })}
                                name="selectedDenom"
                                variant='standard'
                                disableUnderline
                                value={state.selectedDenom[0]}
                                onChange={handleChange}
                            >
                            {selectedWallet?.walletBalances!.map((balance: Coin, idx) => (
                                <MenuItem value={balance.denom}>{denomToAlias[balance.denom as keyof typeof denomToAlias]}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </Box>
                </div>
                <Tooltip title={!validInput?"Please provide valid address and amount":'Add address and amount to list'}>
                    <div className='tooltip-base'>
                        <Button
                            variant="contained"
                            color="primary"
                            style={styles.addToListButton}
                            disabled={!validInput}
                            onClick={handleAddRow}
                        >
                        {!validInput?null:<img style={{marginRight: '10px'}} src={PlusIcon} alt="Keplr Logo" />}
                        Add to list
                        </Button>
                    </div>
                </Tooltip>
            </div>
    )
}

export {
    SingleInputRow
}

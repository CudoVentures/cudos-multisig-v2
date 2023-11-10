import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { COLORS_DARK_THEME } from "theme/colors"
import { CHAIN_ID, INVALID_DATA_PROMPT_MSG, NATIVE_TOKEN_DENOM } from "utils/constants"
import WalletIcon from 'assets/vectors/wallet-icon.svg'
import { styles } from "./styles"
import { handleFullBalanceToPrecision, separateFractions } from "utils/regexFormatting"
import { denomToAlias, denomToIcon } from "utils/helpers"
import PlusIcon from 'assets/vectors/plus-icon.svg'
import { Coin } from "cudosjs"
import { useEffect, useState } from "react"
import { isValidCudosAddress } from "utils/validation"
import { BigNumber } from "bignumber.js"
import { updateSendFunds } from "store/sendFunds"
import { updateModalState } from "store/modals"
import ToolTipIcon from 'assets/vectors/tooltip-icon.svg'
import AccountBalance from "utils/subscriptions/accountBalance"
import { chainIDToAlias } from "components/Layout/Networkinfo"

import {
    displayDueBalances,
    HtmlTooltip,
    mergeData,
    TableRecipients,
    totalAmountDue
} from "utils/multiSendTableHelper"

import {
    Box,
    Button,
    Input,
    MenuItem,
    Select,
    SelectChangeEvent,
    Table,
    TableContainer,
    TableRow,
    Tooltip,
    Typography
} from "@mui/material"
import { handleKeyDown } from "utils/keyHandler"

export const Preview = ({ displayWorthyFee }: { displayWorthyFee: string }): JSX.Element => {

    const { multisendRows } = useSelector((state: RootState) => state.sendFunds)

    return (
        <Box id='component-holder'>
            <TableContainer style={{ width: '100%' }}>
                <Table style={styles.upperSummaryTable}>
                    <TableRow style={{ display: 'inline' }}>
                        <h3 style={{ float: 'left' }}>Transaction Details</h3>
                    </TableRow>
                    <TableRow style={{ display: 'inline' }}>
                        <Typography
                            style={{ float: 'left' }}
                            variant="subtitle1"
                            color="text.secondary"
                        >
                            Total Recipients
                        </Typography>
                        <span style={{ float: 'right', marginRight: '8px' }}>{multisendRows?.length!}</span>
                    </TableRow>
                    <TableRow style={{ display: 'inline' }}>
                        <Tooltip title={"The wallet balance required at execution time"}>
                            <div>
                                <Typography
                                    style={{ float: 'left' }}
                                    variant="subtitle1"
                                    color="text.secondary"
                                >
                                    Total Amount Due
                                </Typography>
                                <img style={styles.smallTooltip} src={ToolTipIcon} alt="Tooltip" />
                            </div>
                        </Tooltip>
                        <span style={{ float: 'right' }}>
                            <div>{displayDueBalances(totalAmountDue(multisendRows!))}</div>
                        </span>
                    </TableRow>
                </Table>
            </TableContainer>
            <TableContainer>
                <Table style={styles.lowerSummaryTable}>
                    <TableRow style={{ display: 'inline' }}>
                        <Typography
                            style={{ float: 'left' }}
                            variant="subtitle1"
                            color="text.secondary"
                        >
                            Your Account Balance
                        </Typography>
                        <span style={{ float: 'right' }}><AccountBalance /></span>
                    </TableRow>
                    <TableRow style={{ display: 'inline-flex', flexDirection: 'column' }}>
                        <div>
                            <Typography
                                style={{ float: 'left' }}
                                variant="subtitle1"
                                color="text.secondary"
                            >
                                Approximate cost of operations
                            </Typography>
                            <Typography
                                style={{
                                    color: COLORS_DARK_THEME.PRIMARY_BLUE,
                                    float: 'right'
                                }}
                            >
                                {displayWorthyFee}
                            </Typography>
                        </div>
                    </TableRow>
                </Table>
            </TableContainer>
        </Box>
    )
}

export const SingleUserInput = (): JSX.Element => {

    const dispatch = useDispatch()
    const [amountToSend, setAmountToSend] = useState<number>(0)
    const [recipientAddress, setRecipientAddress] = useState<string>('')
    const { selectedWallet } = useSelector((state: RootState) => state.userState)
    const { multisendRows } = useSelector((state: RootState) => state.sendFunds)
    const { openAssetsTable, selectFromAddressBook } = useSelector((state: RootState) => state.modalState)

    const defaultBalance: Coin = {
        denom: NATIVE_TOKEN_DENOM,
        amount: selectedWallet!.nativeBalance!
    }

    const [chosenBalance, setChosenBalance] = useState<Coin>(defaultBalance)

    useEffect(() => {
        if (selectedWallet!.chosenBalance?.denom !== '') {
            setChosenBalance(selectedWallet!.chosenBalance!)
        }

    }, [selectedWallet!.chosenBalance])

    useEffect(() => {
        setAmountToSend(0)

    }, [openAssetsTable])

    const handleChange = (event: SelectChangeEvent<string> | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {

        if (event.target.name === 'recipientAddress') {
            setRecipientAddress(event.target.value)
            return
        }

        setAmountToSend(parseInt(event.target.value))
    }

    const validInput = () => {
        return amountToSend != undefined &&
            amountToSend != null &&
            amountToSend > 0 &&
            recipientAddress !== '' &&
            isValidCudosAddress(recipientAddress) &&
            new BigNumber(amountToSend).isLessThanOrEqualTo(
                chosenBalance!.denom === 'cudosAdmin' ?
                    chosenBalance!.amount :
                    separateFractions(chosenBalance!.amount!))
    }

    const handleAddRow = () => {

        const newRecord: TableRecipients = {
            [recipientAddress]: {
                [chosenBalance.denom]: parseFloat(amountToSend.toString())
            }
        }

        const updatedData = mergeData(multisendRows!, newRecord)
        dispatch(updateSendFunds({ multisendRows: updatedData }))

        setRecipientAddress('')
        setAmountToSend(0)
    }


    const handleChangeAsset = () => {
        dispatch(updateModalState({
            openAssetsTable: true,
            walletRelated: true
        }))
    }


    useEffect(() => {
        setRecipientAddress('')
    }, [selectFromAddressBook])

    return (
        <Box style={styles.addRowHolder}>
            <Box id='recipientHolder'>
                <Box style={styles.walletAddress}>
                    <Typography marginRight={10} fontWeight={600}>
                        Recipient address
                    </Typography>
                    <SelectFromAddrBookBtn />
                </Box>
                {
                    selectFromAddressBook ?
                        <SelectFromAddrBookDropDown
                            onChangeProp={handleChange}
                            componentWidth={"401px"}
                        />
                        :
                        <Input
                            style={styles.formattedRecipientAddressHolder}
                            disableUnderline
                            placeholder='enter recipients address'
                            type="text"
                            name='recipientAddress'
                            value={recipientAddress}
                            onChange={handleChange}
                        />
                }
            </Box>
            <Box style={{ margin: '0 20px' }}>
                <Box id='amountHolder' style={styles.walletAddress}>
                    <Typography marginRight={10} fontWeight={600}>
                        Amount
                    </Typography>
                    <Box style={{ display: 'flex' }}>
                        <Typography
                            marginRight={1}
                            fontWeight={600}
                            variant='subtitle2'
                            color='text.secondary'
                        >
                            Balance
                        </Typography>
                        <Typography
                            fontWeight={600}
                            variant='subtitle2'
                            color={COLORS_DARK_THEME.PRIMARY_BLUE}>

                            {handleFullBalanceToPrecision(
                                chosenBalance!.amount! || '0', 2,
                                denomToAlias[chosenBalance!.denom as keyof typeof denomToAlias]
                            )}
                        </Typography>
                    </Box>
                </Box>
                <Box style={styles.formattedBalanceHolder}>
                    <img
                        style={{ margin: '0 10px' }}
                        src={denomToIcon[chosenBalance!.denom as keyof typeof denomToIcon]}
                        alt={`${chosenBalance!.denom}-icon`} />
                    <Input
                        disableUnderline
                        placeholder='enter amount'
                        type="number"
                        value={amountToSend ? amountToSend : ""}
                        onKeyDown={event => handleKeyDown(event, chosenBalance?.denom)}
                        onPaste={event => { event.preventDefault() }}
                        onChange={handleChange}
                    />
                    <Box>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={styles.changeBtn}
                            onClick={handleChangeAsset}
                        >
                            Change
                        </Button>
                    </Box>
                </Box>
            </Box>
            <Tooltip title={!validInput() ? INVALID_DATA_PROMPT_MSG : 'Add address and amount to list'}>
                <div className='tooltip-base'>
                    <Button
                        variant="contained"
                        color="primary"
                        style={styles.addToListButton}
                        disabled={!validInput()}
                        onClick={handleAddRow}
                    >
                        <img style={{ marginRight: '10px' }} src={PlusIcon} alt="Add to list Icon" />
                        Add
                    </Button>
                </div>
            </Tooltip>
        </Box>
    )
}

export const ConnectedAddressAndNetwork = (): JSX.Element => {

    const { selectedWallet } = useSelector((state: RootState) => state.userState)

    return (
        <Box>
            <Box style={styles.connectedAddress}>
                <Typography marginRight={10} fontWeight={600}>
                    Connected MultiSig address
                </Typography>
                <Box style={{ display: 'flex' }}>
                    <Typography
                        marginRight={1}
                        fontWeight={600}
                        variant='subtitle2'
                        color='text.secondary'
                    >
                        Network
                    </Typography>

                    <Typography
                        fontWeight={600}
                        variant='subtitle2'
                        color={COLORS_DARK_THEME.PRIMARY_BLUE}
                    >
                        {chainIDToAlias(CHAIN_ID)}
                    </Typography>
                </Box>
            </Box>
            <Box style={styles.formattedSenderAddressHolder}>
                <img style={{ margin: '0 10px' }} src={WalletIcon} alt="wallet-icon" />
                {selectedWallet?.walletAddress!}
            </Box>
        </Box>
    )
}

export const SelectFromAddrBookDropDown = ({
    onChangeProp,
    componentWidth
}: {
    onChangeProp: (event: SelectChangeEvent<string>) => void,
    componentWidth: string
}): JSX.Element => {

    const { addressBook } = useSelector((state: RootState) => state.userState)
    const { multisendRows } = useSelector((state: RootState) => state.sendFunds)
    const [selected, setSelected] = useState<string>('')

    useEffect(() => {
        setSelected('')
    }, [multisendRows])

    const handleChange = (event: SelectChangeEvent<string>) => {
        onChangeProp(event)
        setSelected(event.target.value)
    }

    return (
        <Select
            sx={{ ...styles.formattedRecipientAddressHolder, width: componentWidth }}
            MenuProps={styles.menuProps}
            name='recipientAddress'
            variant='standard'
            disableUnderline
            displayEmpty
            value={selected}
            onChange={handleChange}
            renderValue={selected ? undefined : () =>
                <Typography style={styles.placeholder} >
                    select from the list
                </Typography>
            }
        >
            {Object.entries(addressBook!).map((e, i) => {
                const address = e[0]
                const name = e[1]
                return (
                    <MenuItem key={i} value={address}>
                        <Tooltip title={name}>
                            <Box>{address}</Box>
                        </Tooltip>
                    </MenuItem>
                )
            })}
        </Select>
    )
}

export const SelectFromAddrBookBtn = (): JSX.Element => {

    const dispatch = useDispatch()
    const { addressBook } = useSelector((state: RootState) => state.userState)
    const { selectFromAddressBook } = useSelector((state: RootState) => state.modalState)
    const haveAddressBook: boolean = Object.keys(addressBook!).length > 0

    return haveAddressBook ? selectFromAddressBook ?
        <Button
            style={styles.clearBtn}
            disableRipple
            onClick={() => dispatch(updateModalState({ selectFromAddressBook: false }))}
        >
            Enter Manually
        </Button> :
        <Button
            style={styles.clearBtn}
            disableRipple
            onClick={() => dispatch(updateModalState({ selectFromAddressBook: true }))}
        >
            Select from Address Book
        </Button>
        : <></>
}

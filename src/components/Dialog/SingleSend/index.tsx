import { assertIsDeliverTxSuccess, Coin, EncodeObject, StdFee } from 'cudosjs'
import { RootState } from 'store'
import { styles } from './styles'
import { ArrowBackIcon, styles as defaultStyles } from '../styles'
import BigNumber from 'bignumber.js'
import Card from 'components/Card/Card'
import { amountToAcudos, calculateFeeFromGas, formatAddress } from 'utils/helpers'
import { updateModalState } from 'store/modals'
import { COLORS_DARK_THEME } from 'theme/colors'
import { Dialog as MuiDialog } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import InfoIcon from 'assets/vectors/info-icon.svg'
import ArrowIcon from 'assets/vectors/arrow-right.svg'
import WalletIcon from 'assets/vectors/wallet-icon.svg'
import { useDispatch, useSelector } from 'react-redux'
import { denomToIcon, denomToAlias } from 'utils/helpers'
import AssetsTable from 'components/AssetsTable/AssetsTable'
import { CancelRoundedIcon, ModalContainer } from '../styles'
import { initialState as initialModalState } from 'store/modals'
import { Box, Button, Input, Tooltip, Typography } from '@mui/material'
import { handleFullBalanceToPrecision, separateFractions } from 'utils/regexFormatting'
import { executeMsgs, getSingleSendMsgAndFees } from '../ReusableModal/helpers'
import { isValidCudosAddress } from 'utils/validation'

import {
    CHAIN_NAME,
    DEFAULT_LOADING_MODAL_MSG,
    FEE_ESTIMATION_ERROR,
    GENERAL_FAILURE_MSG,
    GENERAL_FAILURE_TITLE,
    INSUFFICIENT_BALANCE,
    INVALID_DATA_PROMPT_MSG,
    NATIVE_TOKEN_DENOM,
    PROPOSAL_CREATION_FAILURE_TITLE,
    PROPOSAL_CREATION_LOADING_TITLE,
    PROPOSAL_CREATION_SUCCESS_MSG,
    SINGLE_SEND_TYPE_URL,
} from 'utils/constants'

const SingleSend = () => {

    const dispatch = useDispatch()
    const [amountToSend, setAmountToSend] = useState<number>(0)
    const [recipientAddress, setRecipientAddress] = useState<string>('')
    const [maxOut, setMaxOut] = useState<boolean>(false)
    const [toggled, setToggled] = useState<boolean>(false)
    const [msg, setMsg] = useState<EncodeObject>({ typeUrl: '', value: '' })
    const [fees, setFees] = useState<StdFee>({ gas: '', amount: [] })
    const defaultElement = document.createElement('div') as HTMLInputElement
    const detailsDropdown = useRef<HTMLInputElement>(defaultElement)
    const contentToAppear = useRef<HTMLInputElement>(defaultElement)

    const { openSingleSendModal, openAssetsTable } = useSelector((state: RootState) => state.modalState)
    const { selectedWallet, address, nativeBalance } = useSelector((state: RootState) => state.userState)

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


    useEffect(() => {
        if (maxOut && isValidCudosAddress(recipientAddress)) {
            generateMsgAndFees()
        }
        if (fees.gas !== '') {
            showDropdownDetails()
        }

    }, [fees.gas, maxOut])

    const clean = () => {
        setAmountToSend(0)
        hideDropdownDetails()
        setToggled(false)
        setMaxOut(false)
        setFees({ gas: '', amount: [] })
    }

    const handleModalClose = () => {
        clean()
        dispatch(updateModalState({ ...initialModalState }))
    }

    const closeModal = (ev: any, reason: string) => {
        if (reason !== 'backdropClick') {
            handleModalClose()
        }
    }

    const generateMsgAndFees = async () => {
        try {
            const { msg, fee } = await getSingleSendMsgAndFees(
                recipientAddress,
                [{
                    denom: chosenBalance.denom,
                    amount: isAdminTransfer() ? amountToSend.toString() : amountToAcudos(amountToSend)
                }],
                selectedWallet?.walletAddress!,
                address!
            )

            setMsg(msg)
            setFees(fee)

        } catch (error: any) {
            dispatch(updateModalState({
                failure: true,
                title: GENERAL_FAILURE_TITLE,
                msgType: FEE_ESTIMATION_ERROR,
                message: GENERAL_FAILURE_MSG
            }))
            console.debug(error.message)
        }
    }

    const showDropdownDetails = async () => {
        setToggled(true)
        detailsDropdown.current.style.display = 'block'
        setTimeout(() => detailsDropdown.current.style.height = '230px', 50)
        setTimeout(() => detailsDropdown.current.style.backgroundColor = COLORS_DARK_THEME.LIGHT_BACKGROUND, 500)
        setTimeout(() => contentToAppear.current.style.opacity = '1', 550)
    }

    const hideDropdownDetails = () => {
        contentToAppear.current.style.opacity = '0'
        detailsDropdown.current.style.backgroundColor = '#7d87aa21'
        setTimeout(() => detailsDropdown.current.style.height = '0px', 350)
        setTimeout(() => detailsDropdown.current.style.display = 'none', 650)
    }

    const handleChange = (event: any) => {

        if (toggled) {
            clean()
        }

        if (event.target.name === 'recipientAddress') {
            setRecipientAddress(event.target.value)
            return
        }

        setMaxOut(false)
        setAmountToSend(event.target.value as number)
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

    const showFee = (): string => {
        const feesAmount = fees.gas ? fees.amount[0].amount : '0'
        const displayWorthyFee = handleFullBalanceToPrecision(feesAmount, 4, 'CUDOS')
        return displayWorthyFee
    }

    const handleChangeAsset = () => {
        detailsDropdown.current.style.display = 'none'
        clean()
        dispatch(updateModalState({
            openAssetsTable: true,
            walletRelated: true
        }))
    }

    const signAndBroadcast = async () => {

        dispatch(updateModalState({
            openSingleSendModal: false,
            loading: true,
            title: PROPOSAL_CREATION_LOADING_TITLE,
            message: DEFAULT_LOADING_MODAL_MSG
        }))

        try {
            const result = await executeMsgs(address!, [msg], fees)
            assertIsDeliverTxSuccess(result)

            const tempFee = calculateFeeFromGas(result.gasUsed)
            const displayWorthyFee = handleFullBalanceToPrecision(tempFee, 4, 'CUDOS')

            const dataObjectForSuccessModal = {
                from: selectedWallet?.walletAddress!,
                to: recipientAddress,
                amount: `${amountToSend.toString()} ${denomToAlias[chosenBalance!.denom as keyof typeof denomToAlias]}`,
                txHash: result.transactionHash,
                txFee: displayWorthyFee,
            }

            dispatch(updateModalState({
                loading: false,
                success: true,
                msgType: SINGLE_SEND_TYPE_URL,
                dataObject: dataObjectForSuccessModal,
                message: PROPOSAL_CREATION_SUCCESS_MSG
            }))

        } catch (e: any) {
            dispatch(updateModalState({
                loading: false,
                failure: true,
                title: PROPOSAL_CREATION_FAILURE_TITLE,
                message: GENERAL_FAILURE_MSG
            }))
            console.debug(e.message)
        }
    }

    const maxingOut = () => {
        setMaxOut(true)
        const tempAmount = parseFloat(handleFullBalanceToPrecision(
            chosenBalance!.amount!,
            2,
            chosenBalance!.denom!
        ))
        setAmountToSend(tempAmount)
    }

    const isAdminTransfer = () => {
        return chosenBalance?.denom === 'cudosAdmin'
    }

    const enoughBalance = (): boolean => {
        const accountBalance = new BigNumber(chosenBalance?.amount!)
        const neededFees = new BigNumber(fees.amount[0].amount)
        const cudosBalance = new BigNumber(nativeBalance!)

        const transferAmount =
            isAdminTransfer() ?
                amountToSend.toString() :
                amountToAcudos(amountToSend)

        if (isAdminTransfer()) {
            return new BigNumber(transferAmount).isLessThanOrEqualTo(accountBalance) &&
                neededFees.isLessThanOrEqualTo(cudosBalance)
        }

        return new BigNumber(transferAmount).plus(neededFees).isLessThanOrEqualTo(accountBalance)
    }

    const getTooltip = (): string => {
        if (toggled && !enoughBalance()) {
            return INSUFFICIENT_BALANCE
        }

        if (!validInput()) {
            return INVALID_DATA_PROMPT_MSG
        }

        return ''
    }

    const goBackToTxTypeSelector = () => {
        handleModalClose()
        dispatch(updateModalState({
            transactionSelector: true,
            dataObject: {
                selectSendType: true
            }
        }))
    }

    return (
        <MuiDialog
            BackdropProps={defaultStyles.defaultBackDrop}
            open={openSingleSendModal!}
            onClose={closeModal}
            PaperProps={defaultStyles.defaultPaperProps}
        >
            <ModalContainer sx={{ padding: '30px' }}>
                {openAssetsTable ? <AssetsTable /> :
                    <div>
                        <ArrowBackIcon onClick={goBackToTxTypeSelector} />
                        <CancelRoundedIcon onClick={handleModalClose} />
                        <Typography
                            style={styles.multiSigTitle}
                            variant="h5"
                            fontWeight={900}
                            letterSpacing={2}>

                            Send Funds: Single
                        </Typography>
                        <Box style={styles.contentHolder} gap={1} >
                            <Box style={styles.connectedAddress}>
                                <Typography marginRight={10} fontWeight={600}>
                                    Connected MultiSig address
                                </Typography>
                                <Box style={{ display: 'flex' }}>
                                    <Typography
                                        marginRight={1}
                                        fontWeight={600}
                                        variant='subtitle2'
                                        color='text.secondary'>

                                        Network
                                    </Typography>

                                    <Typography
                                        fontWeight={600}
                                        variant='subtitle2'
                                        color={COLORS_DARK_THEME.PRIMARY_BLUE}>

                                        {CHAIN_NAME}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box style={styles.formattedSenderAddressHolder}>
                                <img style={{ margin: '0 10px' }} src={WalletIcon} alt="wallet-icon" />
                                {formatAddress(selectedWallet?.walletAddress!, 35)}
                            </Box>
                            <Box style={styles.walletAddress}>
                                <Typography marginRight={10} fontWeight={600}>
                                    Recipient address
                                </Typography>
                            </Box>
                            <Input
                                style={styles.formattedRecipientAddressHolder}
                                disableUnderline
                                placeholder='enter recipients address'
                                type="text"
                                name='recipientAddress'
                                value={recipientAddress}
                                onChange={handleChange}
                            />
                            <Box style={styles.walletAddress}>
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
                                    onKeyDown={event => {
                                        const forbiddenSymbols =
                                            chosenBalance!.denom === 'cudosAdmin' ?
                                                ['e', 'E', '+', "-", ",", "."] :
                                                ['e', 'E', '+', "-"]
                                        if (forbiddenSymbols.includes(event.key)) { event!.preventDefault() }
                                    }}
                                    onPaste={(e: any) => { e.preventDefault() }}
                                    onChange={handleChange}
                                />
                                <Box style={{ width: '90%' }}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        style={{ float: 'left' }}
                                        sx={styles.innerBtns}
                                        onClick={handleChangeAsset}
                                    >
                                        Change Asset
                                    </Button>

                                    <Button
                                        disabled={maxOut || new BigNumber(chosenBalance!.amount!).isZero()}
                                        variant="contained"
                                        color="primary"
                                        style={{ float: 'right' }}
                                        sx={styles.innerBtns}
                                        onClick={maxingOut}
                                    >
                                        MAX
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                        <Box style={styles.mainBtnsHolder}>
                            <Tooltip title={getTooltip()}>
                                <div>
                                    <Button
                                        disabled={toggled ? !enoughBalance() : !validInput()}
                                        variant="contained"
                                        color="primary"
                                        sx={styles.mainBtns}
                                        onClick={toggled ? signAndBroadcast : generateMsgAndFees}
                                    >
                                        {toggled ? !enoughBalance() ? 'Insufficient balance' : "Propose" : "Transaction Summary"}
                                    </Button>
                                </div>
                            </Tooltip>
                        </Box>
                    </div>}
            </ModalContainer>
            <Box style={styles.dropDownHolder}>
                <Card ref={detailsDropdown} style={styles.initialDropDownState}>
                    <Box ref={contentToAppear} style={styles.TxSummaryHolder}>
                        <Typography variant='subtitle1'>
                            Transaction summary
                        </Typography>
                        <Box style={styles.TxSummaryAddressesHolder}>
                            <Box style={styles.TxSummaryAddrBoxStyle}>
                                <Typography variant='subtitle2' color={"text.secondary"}>
                                    Sender
                                </Typography>
                                <Typography variant='subtitle2' color={"text.primary"}>
                                    {formatAddress(selectedWallet?.walletAddress!, 20)}
                                </Typography>
                            </Box>
                            <img src={ArrowIcon} alt="arrow-icon" />
                            <Box style={styles.TxSummaryAddrBoxStyle}>
                                <Typography variant='subtitle2' color={"text.secondary"}>
                                    Recipient
                                </Typography>
                                <Typography variant='subtitle2' color={"text.primary"}>
                                    {formatAddress(recipientAddress, 20)}
                                </Typography>
                            </Box>
                        </Box>
                        <Box style={{ padding: '10px 15px', display: 'flex', width: '100%' }}>
                            <Box style={styles.TxSummaryAddrBoxStyle}>
                                <Typography variant='subtitle2' color={"text.secondary"}>
                                    Amount
                                </Typography>
                                <Typography variant='subtitle2' color={"text.primary"}>
                                    {`${amountToSend} ${denomToAlias[chosenBalance!.denom as keyof typeof denomToAlias]}`}
                                </Typography>
                            </Box>
                            <Box style={{ margin: '0 100px', ...styles.TxSummaryAddrBoxStyle }}>
                                <Typography variant='subtitle2' color={"text.secondary"}>
                                    Transaction fees
                                    <Tooltip title={"This is approximate calculation"}>
                                        {<img style={{ marginLeft: '5px', height: '15px' }} src={InfoIcon} alt="winfo-icon" />}
                                    </Tooltip>
                                </Typography>
                                <Typography variant='subtitle2' color={"text.primary"}>
                                    {toggled ? showFee() : null}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Card>
            </Box>
        </MuiDialog>
    )
}

export default SingleSend

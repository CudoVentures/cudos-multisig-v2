import { assertIsDeliverTxSuccess, Coin, EncodeObject, GasPrice, StdFee } from 'cudosjs'
import { RootState } from 'store'
import { styles } from './styles'
import { styles as defaultStyles } from '../styles'
import BigNumber from 'bignumber.js'
import Card from 'components/Card/Card'
import { updateUser } from 'store/user'
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
import { getSigningClient } from 'utils/config'
import { MultiSendUser } from 'utils/multiSendTableHelper'
import { chainIDToAlias } from 'components/Layout/Networkinfo'

import { 
    CHAIN_ID,
    DEFAULT_LOADING_MODAL_MSG, 
    DEFAULT_MEMO, DEFAULT_MULTIPLIER, 
    FEE_ESTIMATION_ERROR, 
    GAS_PRICE, 
    GENERAL_FAILURE_MSG, 
    GENERAL_FAILURE_TITLE, 
    INSUFFICIENT_BALANCE, 
    NATIVE_TOKEN_DENOM, 
    WALLET_FUNDING_FAILURE_TITLE, 
    WALLET_FUNDING_LOADING_TITLE,
     WALLET_FUNDING_SUCCESS_MSG, 
     WALLET_FUNDING_SUCCESS_TYPE 
} from 'utils/constants'
import { handleKeyDown } from 'utils/keyHandler'

const FundWallet = () => {

    const dispatch = useDispatch()
    const [amountToSend, setAmountToSend] = useState<number>(0)
    const [maxOut, setMaxOut] = useState<boolean>(false)
    const [toggled, setToggled] = useState<boolean>(false)
    const [msg, setMsg] = useState<EncodeObject>({typeUrl: '', value: ''})
    const [fees, setFees] = useState<StdFee>({gas: '', amount: []})
    const defaultElement = document.createElement('div') as HTMLInputElement
    const detailsDropdown = useRef<HTMLInputElement>(defaultElement)
    const dialog = useRef<HTMLInputElement>(defaultElement)
    const input = useRef<HTMLInputElement>(defaultElement)
    const contentToAppear = useRef<HTMLInputElement>(defaultElement)
    const { openFundWallet, openAssetsTable} = useSelector((state: RootState) => state.modalState)
    const { 
        selectedWallet, 
        address, 
        nativeBalance, 
        chosenBalance, 
        connectedLedger 
    } = useSelector((state: RootState) => state.userState)
    
    const defaultBalance: Coin = {
        denom: NATIVE_TOKEN_DENOM,
        amount: nativeBalance!
    }

    useEffect(() => {
        setAmountToSend(0)

    }, [openAssetsTable])

    useEffect(() => {
        dispatch(updateUser({chosenBalance: defaultBalance}))

    }, [])

    useEffect(() => {
        if (maxOut) { generateFundWalletMsg() }
        if (fees.gas !== '') { showDropdownDetails() }

    }, [fees.gas, maxOut])

    const clean = () => {
        setAmountToSend(0)
        hideDropdownDetails()
        setToggled(false)
        setMaxOut(false)
        setFees({gas: '', amount: []})
    }

    const handleModalClose = () => {
        clean()
        dispatch(updateModalState({ ...initialModalState }))
    }
      
    const closeModal = (event: {}, reason: string) => {
        if (reason !== 'backdropClick') {
          handleModalClose()
        }
    }

    const generateFundWalletMsg = async () => {
        try {
            const { msg, fee } = await getFundWalletMsgAndFees()
            setMsg(msg)
            setFees(fee)

        } catch (error) {
            dispatch(updateModalState({
                failure: true, 
                title: GENERAL_FAILURE_TITLE,
                msgType: FEE_ESTIMATION_ERROR,
                message: GENERAL_FAILURE_MSG
            }))
            console.error((error as Error).message)
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

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (toggled) { clean() }
        setAmountToSend(parseInt(event.target.value))
    }

    const validInput = () => {
        return amountToSend != undefined &&
            amountToSend != null &&
            amountToSend > 0 &&
            new BigNumber(amountToSend).isLessThanOrEqualTo(
                chosenBalance!.denom==='cudosAdmin'?
                chosenBalance!.amount:
                separateFractions(chosenBalance!.amount))
    }

    const showFee = (): string => {
        const feesAmount = fees.gas?fees.amount[0].amount:'0'
        const displayWorthyFee = handleFullBalanceToPrecision(feesAmount, 4, 'CUDOS')
        return displayWorthyFee
    }

    const clearState = async () => {
        clean()
        dispatch(updateUser({chosenBalance: defaultBalance}))
      }

    const handleChangeAsset = () => {
        detailsDropdown.current.style.display = 'none'
        clean()
        dispatch(updateModalState({
            openAssetsTable: true
        }))
    }

    const signAndBroadcast = async () => {
        
        dispatch(updateModalState({
            openFundWallet: false,
            loading: true,
            title: WALLET_FUNDING_LOADING_TITLE,
            message: DEFAULT_LOADING_MODAL_MSG
        }))

        try {
            const client = await getSigningClient(connectedLedger!);
            const result = await client.signAndBroadcast(
                address!, 
                [msg], 
                fees, 
                DEFAULT_MEMO
            )
            assertIsDeliverTxSuccess(result)

            const tempFee = calculateFeeFromGas(result.gasUsed)
            const displayWorthyFee = handleFullBalanceToPrecision(tempFee, 4, 'CUDOS')

            const dataObjectForSuccessModal = {
                from: address,
                to: selectedWallet?.walletAddress,
                amount: `${amountToSend.toString()} ${denomToAlias[chosenBalance!.denom as keyof typeof denomToAlias]}`,
                txHash: result.transactionHash,
                txFee: displayWorthyFee,
            }

            clearState()

            dispatch(updateModalState({
                loading: false,
                success: true,
                msgType: WALLET_FUNDING_SUCCESS_TYPE,
                dataObject: dataObjectForSuccessModal,
                message: WALLET_FUNDING_SUCCESS_MSG
            }))

        } catch (error){
            dispatch(updateModalState({
                loading: false,
                failure: true,
                title: WALLET_FUNDING_FAILURE_TITLE, 
                message: GENERAL_FAILURE_MSG
            }))
            console.error((error as Error).message)
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
            isAdminTransfer()?
            amountToSend.toString():
            amountToAcudos(amountToSend)

        if (isAdminTransfer()) {
            return new BigNumber(transferAmount).isLessThanOrEqualTo(accountBalance) &&
            neededFees.isLessThanOrEqualTo(cudosBalance)
        }

        return new BigNumber(transferAmount).plus(neededFees).isLessThanOrEqualTo(accountBalance)
    }

    const handleIsAdminTransfer = (): string => {
        const isAdminTransfer = chosenBalance?.denom === 'cudosAdmin'
        const transferAmount = 
            isAdminTransfer?
            amountToSend.toString():
            amountToAcudos(amountToSend)
        return transferAmount
    }

    const getFundWalletMsgAndFees = async () => {
        const transferAmount = handleIsAdminTransfer()

        const sender: MultiSendUser[] = [{
            address: address!,
            coins: [{
                denom: chosenBalance?.denom || '',
                amount: transferAmount || '0',
            }]
        }]

        const recipient: MultiSendUser[] = [{
            address: selectedWallet?.walletAddress!,
            coins: [{
                denom: chosenBalance?.denom || '',
                amount: transferAmount || '0',
            }]
        }]

        const client = await getSigningClient(connectedLedger!);
        return client.msgMultisend(
            sender,
            recipient,
            GasPrice.fromString(GAS_PRICE+NATIVE_TOKEN_DENOM),
            DEFAULT_MULTIPLIER,
            DEFAULT_MEMO
         )
     }
    
    return (
        <MuiDialog
        BackdropProps={defaultStyles.defaultBackDrop}
            ref={dialog}
            open={openFundWallet!}
            onClose={closeModal}
            PaperProps={defaultStyles.defaultPaperProps}
        >
            <ModalContainer sx={{padding: '30px' }}>
                {openAssetsTable?<AssetsTable />:
                <div>
                    <CancelRoundedIcon onClick={handleModalClose} />
                    <Typography 
                        style={styles.multiSigTitle} 
                        variant="h5" 
                        fontWeight={900} 
                        letterSpacing={2}>
                        
                        Fund MultiSig Wallet
                    </Typography>
                            
        
                    <Box
                        width='100%'
                        height='100%'
                        display="block"
                        flexDirection="column"
                        alignItems="center"
                        textAlign="center"
                        gap={1}
                    >
                        <Box style={styles.connectedAddress}>
                            <Typography marginRight={10} fontWeight={600}>
                                Connected account address
                            </Typography>
                            <Box style={{display: 'flex'}}>
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
                                    
                                    {chainIDToAlias(CHAIN_ID)}
                                </Typography>
                            </Box>
                        </Box>
                        <Box style={styles.formattedSenderAddressHolder}>
                            <img style={{margin: '0 10px'}} src={WalletIcon} alt="wallet-icon" />
                            {address}
                        </Box>

                        <Box style={styles.walletAddress}>
                            <Typography marginRight={10} fontWeight={600}>
                                MultiSig wallet address
                            </Typography>
                        </Box>
                        <Box style={styles.formattedRecipientAddressHolder}>
                            <Tooltip title={selectedWallet?.walletAddress!}>
                                <div style={{marginLeft: '10px'}}>
                                    {formatAddress(selectedWallet?.walletAddress!, 40)}
                                </div>
                            </Tooltip>
                        </Box>

                        <Box style={styles.walletAddress}>
                            <Typography marginRight={10} fontWeight={600}>
                                Amount
                            </Typography>
                            <Box style={{display: 'flex'}}>
                                <Typography 
                                    marginRight={1} 
                                    fontWeight={600} 
                                    variant='subtitle2' 
                                    color='text.secondary'>
                                    
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
                                style={{margin: '0 10px'}} 
                                src={denomToIcon[chosenBalance!.denom as keyof typeof denomToIcon]} 
                                alt={`${chosenBalance!.denom}-icon`} />
                            <Input
                                disableUnderline
                                placeholder='enter amount'
                                type="number"
                                ref={input}
                                value={amountToSend?amountToSend:""}
                                onKeyDown={event => handleKeyDown(event, chosenBalance?.denom)}
                                onPaste={event=>{event.preventDefault()}} 
                                onChange={handleChange}
                            />
                            <Box style={{width: '90%'}}>
                                <Button
                                variant="contained"
                                color="secondary"
                                style={{float: 'left'}}
                                sx={styles.innerBtns}
                                onClick={handleChangeAsset}
                            >
                                    Change Asset
                                </Button>

                                <Button
                                disabled={maxOut || new BigNumber(chosenBalance!.amount!).isZero()}
                                variant="contained"
                                color="primary"
                                style={{float: 'right'}}
                                sx={styles.innerBtns}
                                onClick={maxingOut}
                            >
                                    MAX
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                    <Box style={styles.mainBtnsHolder}>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={styles.mainBtns}
                            onClick={toggled?clean:handleModalClose}
                        >
                            {toggled?"Back":"Cancel"}
                        </Button>
                        <Tooltip title={toggled?!enoughBalance()?INSUFFICIENT_BALANCE:'':''}>
                        <div>
                            <Button
                                disabled={toggled?!enoughBalance():!validInput()}
                                variant="contained"
                                color="primary"
                                sx={styles.mainBtns}
                                onClick={toggled?signAndBroadcast:generateFundWalletMsg}
                            >
                                {toggled?!enoughBalance()?'Insufficient balance':"Fund":"Preview"}
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
                                        Current address
                                    </Typography>
                                    <Typography variant='subtitle2' color={"text.primary"}>
                                    {formatAddress(address!, 20)}
                                    </Typography>
                                </Box>
                                <img src={ArrowIcon} alt="arrow-icon" />
                                <Box style={styles.TxSummaryAddrBoxStyle}>
                                    <Typography variant='subtitle2' color={"text.secondary"}>
                                        Recipient address
                                    </Typography>
                                    <Typography variant='subtitle2' color={"text.primary"}>
                                    {formatAddress(selectedWallet?.walletAddress!, 20)}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box style={{padding: '10px 15px', display: 'flex', width: '100%'}}>
                                <Box style={styles.TxSummaryAddrBoxStyle}>
                                    <Typography variant='subtitle2' color={"text.secondary"}>
                                        Amount
                                    </Typography>
                                    <Typography variant='subtitle2' color={"text.primary"}>
                                        {`${amountToSend} ${denomToAlias[chosenBalance!.denom as keyof typeof denomToAlias]}`}
                                    </Typography>
                                </Box>
                                <Box style={{margin: '0 100px', ...styles.TxSummaryAddrBoxStyle}}>
                                    <Typography variant='subtitle2' color={"text.secondary"}>
                                        Transaction fees
                                        <Tooltip title={"This is approximate calculation"}>
                                            {<img style={{marginLeft: '5px', height: '15px'}} src={InfoIcon} alt="winfo-icon" />}
                                        </Tooltip>
                                    </Typography>
                                    <Typography variant='subtitle2' color={"text.primary"}>
                                        {toggled?showFee():null}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Card>
                </Box>
        </MuiDialog>
    )
}

export default FundWallet

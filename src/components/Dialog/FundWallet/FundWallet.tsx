import { Coin } from 'cudosjs'
import { RootState } from 'store'
import { styles } from './styles'
import BigNumber from 'bignumber.js'
import Card from 'components/Card/Card'
import { updateUser } from 'store/user'
import { formatAddress } from 'utils/helpers'
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
import { CHAIN_NAME, NATIVE_TOKEN_DENOM } from 'utils/constants'
import { Box, Button, Input, Tooltip, Typography } from '@mui/material'
import { handleFullBalanceToPrecision, separateFractions } from 'utils/regexFormatting'

const FundWallet = () => {

    const dispatch = useDispatch()
    const [amountToSend, setAmountToSend] = useState<number>(0)
    const [maxOut, setMaxOut] = useState<boolean>(false)
    const [toggled, setToggled] = useState<boolean>(false)
    const defaultElement = document.createElement('div') as HTMLInputElement
    const detailsDropdown = useRef<HTMLInputElement>(defaultElement)
    const dialog = useRef<HTMLInputElement>(defaultElement)
    const contentToAppear = useRef<HTMLInputElement>(defaultElement)
    const { openFundWallet, openAssetsTable} = useSelector((state: RootState) => state.modalState)
    const { selectedWallet, address, nativeBalance, chosenBalance } = useSelector((state: RootState) => state.userState)

    useEffect(() => {
        setAmountToSend(0)
    }, [openAssetsTable])

    useEffect(() => {
        const defaultBalance: Coin = {
            denom: NATIVE_TOKEN_DENOM,
            amount: nativeBalance!
        }
        dispatch(updateUser({chosenBalance: defaultBalance}))
    }, [])

    const handleModalClose = () => {
        setAmountToSend(0)
        hideDropdownDetails()
        setToggled(false)
        dispatch(updateModalState({ ...initialModalState }))
    }
      
    const closeModal = (ev: any, reason: string) => {
        if (reason !== 'backdropClick') {
          handleModalClose()
        }
    }

    const showDropdownDetails = () => {
        // TODO add GET MULTISEND MSG and FEES HERE
        setToggled(true)
        detailsDropdown.current.style.display = 'block'
        setTimeout(() => detailsDropdown.current.style.height = '230px', 50)
        setTimeout(() => detailsDropdown.current.style.backgroundColor = COLORS_DARK_THEME.LIGHT_BACKGROUND, 500)
        setTimeout(() => contentToAppear.current.style.opacity = '1', 550)
    }

    const hideDropdownDetails = () => {
        setMaxOut(false)
        setToggled(false)
        contentToAppear.current.style.opacity = '0'
        detailsDropdown.current.style.backgroundColor = '#7d87aa21'
        setTimeout(() => detailsDropdown.current.style.height = '0px', 350)
        setTimeout(() => detailsDropdown.current.style.display = 'none', 650)
    }

    const handleChange = (event: any) => {
        hideDropdownDetails()
        setAmountToSend(event.target.value as number)
    }

    const validInput = () => {
        return amountToSend != undefined &&
            amountToSend != NaN &&
            amountToSend != null &&
            amountToSend > 0 &&
            new BigNumber(amountToSend).isLessThanOrEqualTo(
                chosenBalance!.denom==='cudosAdmin'?
                chosenBalance!.amount:
                separateFractions(chosenBalance!.amount))
    }

    const showFee = (): string => {
        const displayWorthyFee = handleFullBalanceToPrecision(
            '100000000000000000' || '0', 4, 'CUDOS'
        )
        return displayWorthyFee
    }

    const handleChangeAsset = () => {
        detailsDropdown.current.style.display = 'none'
        hideDropdownDetails()
        dispatch(updateModalState({
            openAssetsTable: true
        }))
    }

    const signAndBroadcast = () => {
        // TO DO
    }

    const maxingOut = () => {
        setMaxOut(true)
        setAmountToSend(parseFloat(handleFullBalanceToPrecision(chosenBalance!.amount!, 2, chosenBalance!.denom!)))
        showDropdownDetails()
    }

    const enoughBalance = (): boolean => {
        return false
        // Apply logic to check if users balance is > 0 after deducting fees and amountToSend from it
    }

    return (
        <MuiDialog
            ref={dialog}
            open={openFundWallet!}
            onClose={closeModal}
            PaperProps={{
                sx: {
                background: 'transparent',
                width: '100%',
                height: 'min-content',
                boxShadow: 'none',
                position: 'absolute',
                top: '1%',
                overflow: 'hidden',
                borderRadius: '25px'
                }
            }}
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
                                    
                                    {CHAIN_NAME}
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
                                value={amountToSend?amountToSend:null}
                                onKeyDown={event => {
                                    const forbiddenSymbols = 
                                        chosenBalance!.denom === 'cudosAdmin'?
                                        ['e', 'E', '+', "-", ",", "."]:
                                        ['e', 'E', '+', "-"]
                                    if (forbiddenSymbols.includes(event.key)) {event!.preventDefault()}
                                }}
                                onPaste={(e: any)=>{e.preventDefault()}} 
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
                            onClick={toggled?hideDropdownDetails:handleModalClose}
                        >
                            {toggled?"Back":"Cancel"}
                        </Button>
                        <Button
                            disabled={toggled?!enoughBalance():!validInput()}
                            variant="contained"
                            color="primary"
                            sx={styles.mainBtns}
                            onClick={toggled?signAndBroadcast:showDropdownDetails}
                        >
                            {toggled?"Fund":"Preview"}
                        </Button>
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
                                        {showFee()}
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

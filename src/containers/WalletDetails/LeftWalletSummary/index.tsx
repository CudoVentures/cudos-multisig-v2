
//@ts-nocheck
import { Box, Button, Divider, Tooltip, Typography } from '@mui/material'
import { styles } from './styles'
import { RootState } from 'store'
import { useDispatch, useSelector } from 'react-redux'
import { formatAddress, getCudosBalanceInUSD } from 'utils/helpers'
import copy from 'copy-to-clipboard'
import LinkIcon from 'assets/vectors/link-icon.svg'
import CopyIcon from 'assets/vectors/copy-icon.svg'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { EXPLORER_ADDRESS_DETAILS } from 'api/endpoints'
import { cutFractions } from 'utils/regexFormatting'
import { emptyWallet, updatedSelectedWallet } from 'store/user'
import { useNavigate } from 'react-router-dom'
import SlidingSwitchMenu from '../SlidingSwitchMenu'

const LeftWalletSummary = ({ 
    resizableCardLeft, 
    resizableCardRight,
    leftStepsContent,
    rightStepsContent,
    entireDashboardPage
    }:{
    resizableCardLeft: MutableRefObject<HTMLInputElement>;
    resizableCardRight: MutableRefObject<HTMLInputElement>;
    leftStepsContent: MutableRefObject<HTMLInputElement>;
    rightStepsContent: MutableRefObject<HTMLInputElement>;
    entireDashboardPage: MutableRefObject<HTMLInputElement>;}
    ) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [copied, setCopied] = useState<boolean>(false)
    const [usdValue, setUsdValue] = useState<string>('')
    const [toggled, setToggled] = useState<boolean>(false)
    const [disableButton, setDisableButton] = useState<boolean>(false)
    const { selectedWallet } = useSelector((state: RootState) => state.userState)
    const defaultElement = document.createElement('div') as HTMLInputElement
    const slidingHolder = useRef<HTMLInputElement>(defaultElement)
    
    const handleCopy = (value: string) => {
        copy(value)
        setCopied(true)
    
        setTimeout(() => {
          setCopied(false)
        }, 3000)
    }

    useEffect(() => {
        const getCurrencies = async () => {
            const usdValue = await getCudosBalanceInUSD(selectedWallet?.nativeBalance!)
            setUsdValue(usdValue)
          }
          getCurrencies()
    }, [selectedWallet?.nativeBalance!])

    const clearSelectedWalletState = async () => {
        dispatch(updatedSelectedWallet(emptyWallet))
    }

    const shrinkAndRemoveContent = () => {
        resizableCardLeft.current.style.width = '0'
        resizableCardRight.current.style.width = '0'
        leftStepsContent.current.style.opacity = '0'
        rightStepsContent.current.style.opacity = '0'
        entireDashboardPage.current.style.opacity = '0'
    }
      
    const backToWallets = () => {
        shrinkAndRemoveContent()
        setTimeout(() => navigate("/welcome"), 350)
        setTimeout(() => clearSelectedWalletState(), 360)
    }

    const lockBackround = () => {
        resizableCardRight.current.style.filter = 'blur(8px)'
        resizableCardRight.current.style.userSelect = 'none'
        resizableCardRight.current.style.zIndex = '-999'
    }

    const unlockBackround = () => {
        resizableCardRight.current.style.filter = 'blur(0px)'
        resizableCardRight.current.style.userSelect = 'auto'
        resizableCardRight.current.style.zIndex = '0'
    }

    const handleSliderClick = () => {
        setToggled(!toggled)
        setDisableButton(true)
        setTimeout(() => setDisableButton(false), 600)
        slidingHolder.current!.children[0].style.width = `${toggled?"0":"600"}px`

        if (toggled) {
            unlockBackround()
            slidingHolder.current!.children[0].firstChild.style.opacity = '0'
            
        } else {
            lockBackround()
            setTimeout(() => slidingHolder.current!.children[0].firstChild.style.opacity = '1', 600)
        }
    }

    return (
        <Box gap={1} style={styles.summaryHolder}>        
            <Box ref={slidingHolder} style={styles.slidingHolder}>
                <SlidingSwitchMenu />
            </Box>  
            <Box style={styles.boxHolder}>
                <div style={{width: '100%'}}>
                    <Button 
                        disableRipple 
                        disabled={disableButton} 
                        onClick={handleSliderClick}
                        variant="text" 
                        style={styles.switchBtn}
                    >
                        {toggled?"Close":"Switch"}
                    </Button>
                    <Button 
                        disableRipple 
                        onClick={backToWallets} 
                        variant="text" 
                        style={styles.logoutBtn}
                    > 
                        Logout 
                    </Button>
                </div>
                <div style= {styles.contentHolder}>
                    <Typography fontWeight={600} fontSize={14} >
                        <Tooltip title={selectedWallet?.walletName!}>
                            <div style={styles.textContainer}>
                                {selectedWallet?.walletName!}
                            </div>
                        </Tooltip> 
                    </Typography>
                    <Typography variant='subtitle2' color="text.secondary" fontWeight={500} fontSize={14} >
                        {formatAddress(selectedWallet?.walletAddress!, 14)}
                    </Typography>
                    <Box style={{ display: 'flex', justifyContent: 'center'}}>
                        <Tooltip
                            onClick={() => handleCopy(selectedWallet?.walletAddress!)}
                            title={copied ? 'Copied' : 'Copy to clipboard'}
                        >
                            <img
                            style={{ marginLeft: '10px', cursor: 'pointer' }}
                            src={CopyIcon}
                            alt="Copy"
                            />
                        </Tooltip>
                        <Tooltip title="Check address on explorer">
                            <a href={EXPLORER_ADDRESS_DETAILS(selectedWallet?.walletAddress!)} target='_blank'>
                            <img
                                style={styles.linkIcon}
                                src={LinkIcon}
                                alt="Link"
                            />
                            </a>
                        </Tooltip>
                    </Box>
                    <Divider style={{margin: '10px 0'}}/>
                    <Typography variant='subtitle2' color="text.secondary" fontWeight={600} fontSize={14} >
                        ACCOUNT BALANCE
                    </Typography>
                    <Typography variant='h6' margin={1} fontWeight={600} >
                        <Tooltip title={`$ ${usdValue}`}>
                            <div>
                                <span>$ {cutFractions(usdValue)}</span>
                            </div>
                        </Tooltip>
                    </Typography>
                </div>
            </Box>
        </Box>
    )
}

export default LeftWalletSummary

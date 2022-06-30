
import { Box, Button, Divider, Tooltip, Typography } from '@mui/material'
import { styles } from './styles'
import { RootState } from 'store'
import { useSelector } from 'react-redux'
import { formatAddress, getCudosBalanceInUSD } from 'utils/helpers'
import copy from 'copy-to-clipboard'
import LinkIcon from 'assets/vectors/link-icon.svg'
import CopyIcon from 'assets/vectors/copy-icon.svg'
import { useEffect, useState } from 'react'
import { EXPLORER_ADDRESS_DETAILS } from 'api/endpoints'
import { cutFractions } from 'utils/regexFormatting'

const LeftWalletSummary = () => {
    const { selectedWallet } = useSelector((state: RootState) => state.userState)
    const [copied, setCopied] = useState<boolean>(false)
    const [usdValue, setUsdValue] = useState<string>('')

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
   
    return (
        <Box gap={1} style={styles.summaryHolder}>
            
            <Box style={styles.boxHolder}>
                <div style={{marginBottom: '10px', width: '100%'}}>
                    <Button disableRipple variant="text" style={{fontSize: '12px', float: 'right'}}> Switch </Button>
                </div>
                <div>
                    <Typography fontWeight={600} fontSize={14} >
                        {selectedWallet?.walletName!.length! > 21?
                            <Tooltip title={selectedWallet?.walletName!}>
                                <div>
                                    {formatAddress(selectedWallet?.walletName!, 4)}
                                </div>
                            </Tooltip>
                            :selectedWallet?.walletName
                        }
                    </Typography>
                    <Typography variant='subtitle2' color="text.secondary" margin={1} fontWeight={500} fontSize={14} >
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
                                style={{ marginLeft: '10px', marginTop:'3px', cursor: 'pointer' }}
                                src={LinkIcon}
                                alt="Link"
                            />
                            </a>
                        </Tooltip>
                    </Box>
                    <Divider style={{margin: '10px'}}/>
                    <Typography variant='subtitle2' color="text.secondary" margin={1} fontWeight={600} fontSize={14} >
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

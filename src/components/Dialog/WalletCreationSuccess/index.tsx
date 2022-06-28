import { Box, Divider, Stack, Tooltip, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { OpenInNewRounded as OpenInNewRoundedIcon } from '@mui/icons-material'
import { EXPLORER_ADDRESS_DETAILS, TX_HASH_DETAILS } from 'api/endpoints'
import { useState } from 'react'
import { formatAddress } from 'utils/helpers'
import LinkIcon from 'assets/vectors/link-icon.svg'
import CopyIcon from 'assets/vectors/copy-icon.svg'
import copy from 'copy-to-clipboard'

interface WalletCreation {
    walletAddress: string,
    walletName: string,
    txHash: string,
    txFee: string,
  }

const WalletCreationSuccess = () => {
      
    const { dataObject } = useSelector((state: RootState) => state.modalState)
    const [copied, setCopied] = useState<boolean>(false)
    const successData: WalletCreation = new Object(dataObject) as WalletCreation;

    const handleCopy = (value: string) => {
        copy(value)
        setCopied(true)
    
        setTimeout(() => {
          setCopied(false)
        }, 3000)
      }

    return (
        <Box padding='0px 10px 0 10px' width='100%' display="flex" flexDirection="column" gap={2}>

            <Box>
              <Typography margin='10px 0 5px 0' color="text.secondary" variant="body2">
                Wallet Name
              </Typography>
              <Typography variant="body2">{successData.walletName}</Typography>
            </Box>

            <Box>
              <Typography margin='10px 0 5px 0' color="text.secondary" variant="body2">
                Wallet Address
              </Typography>
              
              <Box style={{display: 'flex', alignItems: 'center'}}>
              <Typography variant="body2">{formatAddress(successData.walletAddress, 40)}</Typography>
              <Tooltip
                    onClick={() => handleCopy(successData.walletAddress)}
                    title={copied ? 'Copied' : 'Copy to clipboard'}
                >
                    <img
                    style={{ marginLeft: '10px', cursor: 'pointer' }}
                    src={CopyIcon}
                    alt="Copy"
                    />
                </Tooltip>
                <Tooltip title="Check address on explorer">
                    <a style={{marginTop: '5px'}} href={EXPLORER_ADDRESS_DETAILS(successData.walletAddress)} target='_blank'>
                    <img
                        style={{ marginLeft: '10px', cursor: 'pointer' }}
                        src={LinkIcon}
                        alt="Link"
                    />
                    </a>
                </Tooltip>
              </Box>
            </Box>

            <Divider />

            <Box display="flex" alignItems="center" gap={1} padding="0.5rem 0">
              <Typography variant="body2">Fee</Typography>

              <Typography
                variant="body2"
                color="primary.main"
                fontWeight={700}
                letterSpacing={1}
                sx={{ marginLeft: 'auto' }}
              >
                {successData.txFee} CUDOS
              </Typography>
            </Box>
            <Divider />
            <Box>
              <Typography variant="body2">Transaction</Typography>
              <Tooltip title="Go to Explorer">
              <a href={TX_HASH_DETAILS(successData.txHash)} target='_blank'>
              <Stack
                marginBottom='20px'
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ cursor: 'pointer' }}
              >
                <Typography
                  variant="body2"
                  color="primary.main"
                  sx={{ textDecoration: 'underline' }}
                >
                  Transaction link
                </Typography>
                <OpenInNewRoundedIcon
                  fontSize="small"
                  sx={(theme) => ({
                    color: theme.palette.primary.main
                  })}
                />
              </Stack>
              </a>
            </Tooltip>
            </Box>
          </Box>
    )
}

export default WalletCreationSuccess



            
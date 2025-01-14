import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { StyledUser, styles } from './styles'
import WalletIcon from 'assets/vectors/wallet-icon.svg'
import KeplrLogo from 'assets/vectors/keplr-logo.svg'
import CosmostationLogo from 'assets/vectors/cosmostation-logo.svg'
import LinkIcon from 'assets/vectors/link-icon.svg'
import CopyIcon from 'assets/vectors/copy-icon.svg'
import CudosLogo from 'assets/vectors/cudos-logo.svg'
import ArrowIcon from 'assets/vectors/arrow-down.svg'
import copy from 'copy-to-clipboard'
import { formatAddress } from 'utils/helpers'
import { EXPLORER_ADDRESS_DETAILS } from '../../api/endpoints'
import AccountBalance from 'utils/subscriptions/accountBalance'
import { updateUser } from 'store/user'
import { initialState as initialUserState } from 'store/user'
import { initialState as initialSendFundsState } from 'store/sendFunds'
import { initialState as initialWalletObject, updateWalletObjectState } from 'store/walletObject'
import { initialState as initialModalState, updateModalState } from 'store/modals'
import { initialState as initialWalletCreationState, updateWalletCreationState } from 'store/walletCreation'
import { updateSendFunds } from 'store/sendFunds'
import { SUPPORTED_WALLET } from 'cudosjs'

import {
  Typography,
  Avatar,
  Box,
  Collapse,
  Button,
  Tooltip
} from '@mui/material'

const UserInfo = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { address, isAdmin, accountName, connectedLedger } = useSelector((state: RootState) => state.userState)

  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<boolean>(false)

  const toggleOpen = () => {
    setOpen(!open)
  }

  const handleCopy = (value: string) => {
    copy(value)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  const handleDisconnect = () => {
    sessionStorage.clear()
    localStorage.clear()
    dispatch(updateUser({ ...initialUserState }))
    dispatch(updateWalletObjectState({ ...initialWalletObject }))
    dispatch(updateModalState({ ...initialModalState }))
    dispatch(updateWalletCreationState({ ...initialWalletCreationState }))
    dispatch(updateSendFunds({ ...initialSendFundsState }))
    navigate("/")
  }

  return (
    <StyledUser>
      <Box onClick={() => toggleOpen()} style={styles.userContainer}>
        <Box style={styles.userInnerContainer}>
          <img src={CudosLogo} alt="Cudos logo" />
          <AccountBalance />
          <hr style={styles.fancyLine}></hr>
          <div style={{ display: 'contents' }}>
            <Box
              sx={{
                marginRight: '10px'
              }}
            >
              <Avatar
                style={styles.avatarStyling}
                src={
                  connectedLedger === SUPPORTED_WALLET.Keplr ? KeplrLogo :
                    connectedLedger === SUPPORTED_WALLET.Cosmostation ? CosmostationLogo :
                      WalletIcon
                }
                alt="Wallet Logo"
              />
            </Box>
            <Typography>
              {`Hi, ${accountName}`}
              {/* {formatAddress(address!, 10)} */}
            </Typography>
          </div>
          <Box style={{ marginLeft: '15px' }}>
            <img
              style={{
                cursor: 'pointer',
                transform: open ? 'rotate(180deg)' : 'rotate(360deg)'
              }}
              src={ArrowIcon}
              alt="Arrow Icon"
            />
          </Box>
        </Box>
      </Box>
      <Collapse
        onMouseLeave={() => setOpen(false)}
        style={{ marginTop: '-28px', zIndex: '-1' }}
        in={open}
      >
        <Box style={styles.dropdownMenuContainer}>
          <Box style={{ marginTop: '40px' }}>
            <Box style={{ display: 'flex' }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  marginTop: '10px',
                  flexDirection: 'column'
                }}
              >
                {isAdmin ?
                  <Typography
                    sx={{ color: 'chocolate', fontSize: '12px', marginBottom: '10px' }}
                  >
                    CUDOS NETWORK ADMIN
                  </Typography>
                  : null}
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: '13px', marginBottom: '10px' }}

                >
                  {formatAddress(address!, 20)}
                </Typography>
              </Box>
            </Box>
            <Box style={{ display: 'flex', justifyContent: 'center' }}>
              <Tooltip
                onClick={() => handleCopy(address!)}
                title={copied ? 'Copied' : 'Copy to clipboard'}
              >
                <img
                  style={{ marginLeft: '10px', cursor: 'pointer' }}
                  src={CopyIcon}
                  alt="Copy"
                />
              </Tooltip>
              <Tooltip title="Go to Explorer">
                <a href={EXPLORER_ADDRESS_DETAILS(address!)} target='_blank'>
                  <img
                    style={{ marginLeft: '10px', cursor: 'pointer' }}
                    src={LinkIcon}
                    alt="Link"
                  />
                </a>
              </Tooltip>
            </Box>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '30px'
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleDisconnect()}>Disconnect</Button>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </StyledUser>
  )
}

export default UserInfo

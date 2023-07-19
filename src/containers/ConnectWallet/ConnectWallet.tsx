import { Box, Tooltip, Typography } from '@mui/material'
import InfoIcon from 'assets/vectors/info-icon.svg'
import BackgroundImage from 'assets/vectors/background.svg'
import { styles } from './styles'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateModalState } from 'store/modals'
import Dialog from 'components/Dialog'
import { updateUser } from 'store/user'
import { RootState } from 'store'
import Header from 'components/Layout/Header'
import { connectUser } from 'utils/config'
import { Fragment, useEffect, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import { ReactComponent as LinkIcon } from 'assets/vectors/link-icon-fillable.svg'
import { ThreeDots as ThreeDotsLoading } from 'svg-loaders-react'

import {
  DEFAULT_LOGIN_FAILURE_MSG,
  LOGIN_FAIL_TITLE,
  SUPPORTED_WALLET_LOGOS
} from 'utils/constants'
import { authenticate } from 'utils/firebase'

import {
  detectUserBrowser,
  getExtensionUrlForBrowser,
  getSupportedBrowsersForWallet,
  getSupportedWallets,
  isExtensionAvailableForBrowser,
  isExtensionEnabled,
  isSupportedBrowser,
  SUPPORTED_BROWSER,
  SUPPORTED_WALLET
} from 'cudosjs'

const ConnectWallet = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { address } = useSelector((state: RootState) => state.userState)
  const [loading, setLoading] = useState(new Map())
  const [userBrowser, setUserBrowser] = useState<SUPPORTED_BROWSER | undefined>(undefined)

  const redirectToExtension = (extensionUrl: string | undefined) => {
    if (extensionUrl) {
      window.open(extensionUrl, '_blank')?.focus()
    }
  }

  const connect = async (walletName: SUPPORTED_WALLET) => {

    try {
      setLoading(new Map(loading.set(walletName, true)))
      const connectedUser = await connectUser(walletName)
      dispatch(updateUser(connectedUser))
      navigate('/welcome')

    } catch (error) {
      dispatch(updateModalState({
        failure: true,
        title: LOGIN_FAIL_TITLE,
        message: DEFAULT_LOGIN_FAILURE_MSG
      }))
      console.error((error as Error).message)

    } finally {
      setLoading(new Map())
    }
  }

  const btnTooltip = (walletName: SUPPORTED_WALLET): string => {
    let tooltipText = ''

    if (!isExtensionAvailableForBrowser(walletName, userBrowser!)) {
      tooltipText = `${walletName} supports: ${getSupportedBrowsersForWallet(walletName).map((browser) => {
        return ` ${browser}`
      })}`
    }

    return tooltipText
  }

  const isDisabledBtn = (walletName: SUPPORTED_WALLET): boolean => {

    // Disabling the Btn if into loading state
    if (loading.get(walletName)) {
      return true
    }

    // Disabling the btn, when other btn is loading
    if (loading.size > 0) {
      return true
    }

    // Disabling the btn if no extension is available for the current user browser
    if (!isExtensionAvailableForBrowser(walletName, userBrowser!)) {
      return true
    }

    return false
  }

  const click = (walletName: SUPPORTED_WALLET) => {

    if (isExtensionEnabled(walletName)) {
      connect(walletName)
      return
    }

    const extensionUrl = getExtensionUrlForBrowser(walletName, userBrowser!)
    redirectToExtension(extensionUrl)
  }

  const displayLogo = (walletName: SUPPORTED_WALLET): JSX.Element => {
    if (loading.get(walletName)) {
      return <Fragment></Fragment>
    }
    return SUPPORTED_WALLET_LOGOS[walletName] || <Fragment></Fragment>
  }

  const btnText = (walletName: SUPPORTED_WALLET): string | JSX.Element => {

    if (loading.get(walletName)) {
      return ''
    }

    if (isExtensionEnabled(walletName)) {
      return `Connect ${walletName.toUpperCase()}`
    }

    if (isExtensionAvailableForBrowser(walletName, userBrowser!)) {
      return (
        <Typography variant='subtitle2' sx={{ display: 'flex', alignItems: 'center' }}>
          {`Get ${walletName} plugin`}
          <LinkIcon style={{ marginLeft: '5px' }} />
        </Typography>
      )
    }

    return 'Unsupported browser'
  }

  const LoadingButtonComponent = (): JSX.Element => {
    return (
      <ThreeDotsLoading
        style={{ width: '30px', height: '30px' }}
      />
    )
  }

  useEffect(() => {
    const userBrowser = detectUserBrowser()
    if (isSupportedBrowser(userBrowser)) {
      setUserBrowser(userBrowser as SUPPORTED_BROWSER)
      return
    }
    setUserBrowser(undefined)
  }, [])

  return address ?
    (<Navigate to="/welcome" state={{ from: location }} replace />)
    :
    (
      // Inline styles required to fix building issues established with the background img while using imported styles.
      <Box style={{
        height: '100vh',
        width: '100vw',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundImage: 'url(' + BackgroundImage + ')'
      }}>
        <Dialog />
        <Header />
        <Box>
          <Box sx={styles.connectContainer}>
            <Box>
              <h1>Welcome to CUDOS MultiSig Wallet!</h1>
            </Box>
            <Box sx={styles.subHeaderContainer}>
              <Typography variant="subtitle1" color="text.secondary">
                CUDOS MultiSig Wallet is a digital wallet that is controlled by one or multiple owners
                <br />
                In order to continue you need to connect your Keplr Wallet.
              </Typography>
            </Box>

            <Box gap={2} style={styles.btnsHolder}>
              {getSupportedWallets().map((wallet, idx) => {
                return (
                  <Tooltip key={idx} placement='right' title={btnTooltip(wallet)}>
                    <Box>
                      <LoadingButton
                        loadingIndicator={<LoadingButtonComponent />}
                        disabled={isDisabledBtn(wallet)}
                        loading={loading.get(wallet)}
                        variant="contained"
                        color="primary"
                        onClick={() => click(wallet)}
                        sx={styles.connectButton}
                      >
                        {displayLogo(wallet)}
                        {btnText(wallet)}
                      </LoadingButton>
                    </Box>
                  </Tooltip>
                )
              })}
            </Box>
            <Box sx={styles.pluginWarning} color="primary.main">
              <img style={styles.infoIcon} src={InfoIcon} alt="Info" />
              Make sure you have Keplr and/or Cosmostation plugins installed.
            </Box>
          </Box>
        </Box>
      </Box>
    )
}

export default ConnectWallet

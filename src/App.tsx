import { ThemeProvider } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { CssBaseline, Container } from '@mui/material'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'

import Layout from 'components/Layout'
import RequireKeplr from 'components/RequireKeplr/RequireKeplr'
import ConnectWallet from 'containers/ConnectWallet/ConnectWallet'
import Welcome from 'containers/Welcome'
import CreateWallet from 'containers/CreateWallet'
import theme from 'theme'
import { RootState } from 'store'
import { useCallback, useEffect } from 'react'
import { ConnectLedger } from 'ledgers/KeplrLedger'
import { initialState as initialUserState } from 'store/user'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from './graphql/client'

import '@fontsource/poppins'
import { updateUser } from 'store/user'
import { checkForAdminToken, getAccountBalances, getNativeBalance } from 'utils/helpers'
import WalletDetails from 'containers/WalletDetails'
import SendFundsProposal from 'containers/SendFundsProposal'
import RequireWalletFunds from 'components/RequireWalletFunds/RequireWalletFunds'
import RequireWallet from 'components/RequireWallet/RequireWallet'

const App = () => {
  const location = useLocation()
  const apolloClient = useApollo(null)
  const themeColor = useSelector((state: RootState) => state.settings.theme)
  const { lastLoggedAddress, addressBook } = useSelector((state: RootState) => state.userState)
  const dispatch = useDispatch()

  const connectAccount = useCallback(async () => {
    try {
      const { address, keplrName } = await ConnectLedger()
      if (address !== lastLoggedAddress) {
        dispatch(updateUser({ ...initialUserState })
        )
      }
      const currentBalances = await getAccountBalances(address)
      const admin = checkForAdminToken(currentBalances)
      const userBalance = getNativeBalance(currentBalances)

      dispatch(updateUser({
        keplrName: keplrName,
        address: address,
        lastLoggedAddress: address,
        balances: currentBalances,
        nativeBalance: userBalance,
        isAdmin: admin,
        addressBook
      }))

    } catch (error: any) {
      console.debug(error.message)
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keplr_keystorechange", async () => {
      await connectAccount()
    });
  }, [connectAccount])

  return (
    <Container maxWidth='xl' style={{ display: 'contents', height: '100vh', width: '100vw', overflow: 'auto' }}>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme[themeColor]}>
          <CssBaseline />
          {location.pathname !== '/' ? null : (
            <Routes>
              <Route path="/" element={<ConnectWallet />} />
            </Routes>
          )}
          {location.pathname === '/' ? null : (
            <Layout>
              <Routes>
                <Route element={<RequireKeplr />}>
                  <Route path="welcome" element={<Welcome />} />
                  <Route path="create-wallet" element={<CreateWallet />} />
                  <Route element={<RequireWalletFunds />}>
                    <Route path="send-funds" element={<SendFundsProposal />} />
                  </Route>
                  <Route element={<RequireWallet />}>
                    <Route path="dashboard" element={<WalletDetails />} />
                    <Route path="transactions" element={<WalletDetails />} />
                    <Route path="members" element={<WalletDetails />} />
                    <Route path="settings" element={<WalletDetails />} />
                  </Route>
                </Route>
                <Route path="*" element={<Navigate to="/" state={{ from: location }} />} />
              </Routes>
            </Layout>
          )}
        </ThemeProvider>
      </ApolloProvider>
    </Container>
  )
}

export default App

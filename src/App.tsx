import { ThemeProvider } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { CssBaseline, Container } from '@mui/material'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'

import Layout from 'components/Layout'
import RequireLedger from 'components/RequireLedger/RequireLedger'
import ConnectWallet from 'containers/ConnectWallet/ConnectWallet'
import Welcome from 'containers/Welcome'
import CreateWallet from 'containers/CreateWallet'
import theme from 'theme'
import { RootState } from 'store'
import { useCallback, useEffect } from 'react'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from './graphql/client'

import '@fontsource/poppins'
import { updateUser } from 'store/user'
import WalletDetails from 'containers/WalletDetails'
import RequireWallet from 'components/RequireWallet/RequireWallet'
import { COSMOSTATION_LEDGER, KEPLR_LEDGER } from 'utils/constants'
import { connectUser } from 'utils/config'
import { initialState as initialUserState } from 'store/user'
import { updateModalState } from 'store/modals'

const App = () => {
  const location = useLocation()
  const apolloClient = useApollo(null)
  const themeColor = useSelector((state: RootState) => state.settings.theme)
  const dispatch = useDispatch()

  const connectAccount = useCallback(async (ledgerType: string) => {

    try {
      dispatch(updateModalState({
        loading: true,
        loadingType: true
      }))
      dispatch(updateUser(initialUserState))
      const connectedUser = await connectUser(ledgerType)
      dispatch(updateUser(connectedUser))

    } catch (error: any) {
      console.error(error.message)
    } finally {
      dispatch(updateModalState({
        loading: false,
        loadingType: false
      }))
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keplr_keystorechange",
      async () => {
        await connectAccount(KEPLR_LEDGER)
        return
      });

    //@ts-ignore
    window.cosmostation.cosmos.on("accountChanged",
      async () => {
        await connectAccount(COSMOSTATION_LEDGER)
        return
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
                <Route element={<RequireLedger />}>
                  <Route path="welcome" element={<Welcome />} />
                  <Route path="create-wallet" element={<CreateWallet />} />
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

import { ThemeProvider } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { CssBaseline, Container } from '@mui/material'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'

import Layout from './components/Layout'
import RequireKeplr from './components/RequireKeplr/RequireKeplr'
import ConnectWallet from './containers/ConnectWallet/ConnectWallet'
import Welcome from './containers/Welcome'
import theme from './theme'
import { RootState } from './store'
import { useCallback, useEffect } from 'react'
import { ConnectLedger } from './ledgers/KeplrLedger'

import '@fontsource/poppins'
import { updateUser } from './store/user'
import { checkForAdminToken, getAccountBalances, getNativeBalance } from 'utils/helpers'

const App = () => {
  const location = useLocation()
  const themeColor = useSelector((state: RootState) => state.settings.theme)
  const dispatch = useDispatch()

  const connectAccount = useCallback(async () => {
    try {
      const { address } = await ConnectLedger()
      const currentBalances = await getAccountBalances(address)
      const admin = checkForAdminToken(currentBalances)
      const userBalance = getNativeBalance(currentBalances)
      dispatch(updateUser({ 
        address: address, 
        balances: currentBalances, 
        nativeBalance: userBalance, 
        isAdmin: admin }))
        
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
    <Container maxWidth='xl' style={{display: 'contents', height: '100vh', width: '100vw', overflow: 'auto'}}>
      <ThemeProvider theme={theme[themeColor]}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<ConnectWallet />} />
        </Routes>
        {location.pathname === '/' ? null : (
          <Layout>
            <Routes>
              <Route element={<RequireKeplr />}>
                <Route path="welcome">
                  <Route index element={<Welcome />} />
                </Route>
              </Route>
              <Route path="*" element={<Navigate to="/" state={{ from: location }} />} />
            </Routes>
          </Layout>
        )}
      </ThemeProvider>
    </Container>
  )
}

export default App

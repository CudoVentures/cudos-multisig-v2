import { ThemeProvider } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { Container, CssBaseline } from '@mui/material'
import { Routes, Route } from 'react-router-dom'
import Footer from './components/Layout/Footer'
import ConnectWallet from './containers/ConnectWallet/ConnectWallet'
import { RootState } from './store'
import theme from './theme'
import Layout from 'components/Layout'
import { appStyles } from 'appStyles'

import '@fontsource/poppins'


const App = () => {
  const themeColor = useSelector((state: RootState) => state.settings.theme)

  return (
    <Container maxWidth='xl' style={{display: 'contents', height: '100vh', width: '100vw', overflow: 'auto'}}>
        <ThemeProvider theme={theme[themeColor]}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<ConnectWallet />} />
          </Routes>
          {location.pathname === '/' ? null : (
            <Layout>

              <div style={appStyles.footerHolder}>
                <Footer />
              </div>
            </Layout>
          )}
        </ThemeProvider>
    </Container>
  )
}

export default App

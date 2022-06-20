import { ThemeProvider } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { Container, CssBaseline } from '@mui/material'
import theme from './theme'
import { RootState } from './store'

import '@fontsource/poppins'
import Footer from './components/Layout/Footer'

const App = () => {
  const themeColor = useSelector((state: RootState) => state.settings.theme)

  return (
    <Container maxWidth='xl' style={{display: 'contents', height: '100vh', width: '100vw', overflow: 'auto'}}>
        <ThemeProvider theme={theme[themeColor]}>
          <CssBaseline />
          
          <Footer />
        </ThemeProvider>
    </Container>
  )
}

export default App

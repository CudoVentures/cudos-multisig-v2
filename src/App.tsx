import { ThemeProvider } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { CssBaseline } from '@mui/material'
import theme from './theme'
import { RootState } from './store'

import '@fontsource/poppins'

const App = () => {
  const themeColor = useSelector((state: RootState) => state.settings.theme)
  const dispatch = useDispatch()

  return (
        <ThemeProvider theme={theme[themeColor]}>
          <CssBaseline />
        </ThemeProvider>
  )
}

export default App

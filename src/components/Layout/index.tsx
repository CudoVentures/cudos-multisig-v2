import { Box } from '@mui/material'
import Footer from './Footer'
import Header from './Header'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box style={{height: '100vh', display: 'grid'}}>
      <Header />
        <Box sx={{ padding: '0 1rem' }} flexGrow={1}>
          {children}
        </Box>
      <Footer />
    </Box>
  )
}

export default Layout

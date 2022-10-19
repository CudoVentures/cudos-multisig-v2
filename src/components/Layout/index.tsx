import { Box } from '@mui/material'
import Footer from './Footer'
import Header from './Header'
import { styles } from './styles'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box style={styles.layoutHolder}>
      <Header />
        <Box sx={{ overflow: 'auto', padding: '0 1rem' }} flexGrow={1}>
          {children}
        </Box>
      <Footer />
    </Box>
  )
}

export default Layout

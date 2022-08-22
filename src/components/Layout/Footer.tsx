import { Box, Grid, Typography } from '@mui/material'
import { COLORS_DARK_THEME } from 'theme/colors'
import { styles } from './styles'

const centerLinks = [
  { text: 'All rights reserved 2022', url: 'https://www.cudos.org/' },
  { text: 'cudos.org', url: 'https://www.cudos.org/' },
  { text: 'v.02.00', url: 'https://github.com/CudoVentures/cudos-multisig-v2' },
]

const Footer = () => {
  return (
    <Box sx={styles.footerContainer} gap={6}>
      <Box display="flex" alignItems="center">
        {centerLinks.map((link) => (
          <Grid
            item
            key={link.text}
            sx={({ palette }) => ({
              padding: `0 0.5rem`,
              '&:not(:last-child)': {
                borderRight: `1px solid ${palette.text.secondary}`
              },
              cursor: 'pointer'
            })}
            onClick={() => window.open(link.url, '_blank')?.focus()}
          >
            <Typography
              sx={{
                "&:hover": {
                  color: COLORS_DARK_THEME.PRIMARY_BLUE
                }
              }}
              color="text.secondary"
              fontSize="0.8rem"
              fontWeight={500}
            >
              {link.text}
            </Typography>
          </Grid>
        ))}
      </Box>
    </Box>
  )
}

export default Footer
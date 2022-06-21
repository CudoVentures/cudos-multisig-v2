import { Typography } from '@mui/material'
import { CHAIN_NAME } from '../../utils/constants'
import { StyledNetwork } from './styles'

const NetworkInfo = () => {
  return (
    <StyledNetwork sx={{ width: 'max-content', marginRight: '20px' }}>
      <Typography
        sx={{
          fontSize: '14px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {CHAIN_NAME}
      </Typography>
    </StyledNetwork>
  )
}

export default NetworkInfo

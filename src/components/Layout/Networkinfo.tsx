import { Typography } from '@mui/material'
import { CHAIN_NAME } from '../../utils/constants'
import { StyledNetwork, styles } from './styles'
import globusIcon from 'assets/vectors/globus-icon.svg'

const NetworkInfo = () => {
  return (
    <StyledNetwork sx={styles.networkInfoHolder}>
       <img style={{marginRight: '10px'}} src={globusIcon} alt="globus-icon" />
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

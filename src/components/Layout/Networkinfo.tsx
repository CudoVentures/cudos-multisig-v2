import { useState } from 'react'
import { StyledNetwork, styles } from './styles'
import ArrowIcon from 'assets/vectors/arrow-down.svg'
import { CHAIN_ID } from 'utils/constants'
import { COLORS_DARK_THEME } from 'theme/colors'
import globusIcon from 'assets/vectors/globus-icon.svg'
import grayGlobusIcon from 'assets/vectors/gray-globus-icon.svg'
import { OpenInNewRounded as OpenInNewRoundedIcon } from '@mui/icons-material'
import { Typography, Box, Collapse } from '@mui/material'

const chainDetails = {
  local: { aliasName: 'CUDOS Local Testnet' },
  private: { aliasName: 'CUDOS Private Testnet' },
  public: {
    aliasName: 'CUDOS Public Testnet',
    link: 'http://multisig.testnet.cudos.org'
  },
  mainnet: {
    aliasName: 'CUDOS Main Network',
    link: 'http://multisig.cudos.org'
  },
}

const chainIDToAlias = (chainID: string): string => {

  if (chainID.toLowerCase().includes('local')) {
    return chainDetails.local.aliasName
  }

  if (chainID.toLowerCase().includes('private')) {
    return chainDetails.private.aliasName
  }

  if (chainID.toLowerCase().includes('public')) {
    return chainDetails.public.aliasName
  }

  if (chainID.toLowerCase() === 'cudos-1' || chainID.toLowerCase().includes('mainnet')) {
    return chainDetails.mainnet.aliasName
  }

  return "Unidentified Network"
}

const NetworkInfo = () => {
  const networksToDisplayInMenu = [chainDetails.public, chainDetails.mainnet]
  const [open, setOpen] = useState(false)

  return (
    <StyledNetwork>
      <Box onClick={() => setOpen(!open)} style={styles.userContainer}>
        <Box style={styles.userInnerContainer}>
          <img style={{ marginRight: '10px' }} src={globusIcon} alt="globus-icon" />
          <Typography>
            {chainIDToAlias(CHAIN_ID)}
          </Typography>
          <Box style={{ marginLeft: '15px' }}>
            <img
              style={{
                cursor: 'pointer',
                transform: open ? 'rotate(180deg)' : 'rotate(360deg)'
              }}
              src={ArrowIcon}
              alt="Arrow Icon"
            />
          </Box>
        </Box>
      </Box>
      <Collapse
        onMouseLeave={() => setOpen(false)}
        style={{ marginTop: '-28px', zIndex: '-1' }}
        in={open}
      >
        <Box gap={3} style={styles.networkSelectionMenuContainer}>
          {
            networksToDisplayInMenu.map((network) => {
              const [hovered, setHovered] = useState<boolean>(false)

              return (
                chainIDToAlias(CHAIN_ID) !== network.aliasName ?
                  <Box onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)}>
                    <a style={styles.anchorStyle} href={network.link}>
                      <img
                        style={{ marginRight: '10px' }}
                        src={hovered ? globusIcon : grayGlobusIcon}
                        alt="globus-icon"
                      />
                      <Typography
                        color={hovered ? COLORS_DARK_THEME.PRIMARY_BLUE : COLORS_DARK_THEME.SECONDARY_TEXT}>
                        {network.aliasName}
                      </Typography>
                      <OpenInNewRoundedIcon
                        style={{ marginLeft: '5px' }}
                        fontSize="inherit"
                        color={hovered ? 'primary' : 'disabled'}
                      />
                    </a>
                  </Box>
                  : null
              )
            })
          }
        </Box>
      </Collapse>
    </StyledNetwork>
  )
}

export default NetworkInfo

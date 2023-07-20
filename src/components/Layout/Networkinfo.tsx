import { useState } from 'react'
import { StyledNetwork, styles } from './styles'
import ArrowIcon from 'assets/vectors/arrow-down.svg'
import { CHAIN_ID } from 'utils/constants'
import { COLORS_DARK_THEME } from 'theme/colors'
import globusIcon from 'assets/vectors/globus-icon.svg'
import grayGlobusIcon from 'assets/vectors/gray-globus-icon.svg'
import { OpenInNewRounded as OpenInNewRoundedIcon } from '@mui/icons-material'
import { Typography, Box, Collapse } from '@mui/material'

enum CHAIN_IDS {
  local = 'cudos-local-network',
  dev = 'cudos-dev-test-network',
  private = 'cudos-testnet-private-3',
  public = 'cudos-testnet-public-3',
  mainnet = 'cudos-1'
}

const chainDetails = {
  CHAIN_IDS: {
    [CHAIN_IDS.local]: { aliasName: 'CUDOS Local Testnet' },
    [CHAIN_IDS.dev]: { aliasName: 'CUDOS Dev Environment' },
    [CHAIN_IDS.private]: { aliasName: 'CUDOS Private Testnet' },
    [CHAIN_IDS.public]: { aliasName: 'CUDOS Public Testnet' },
    [CHAIN_IDS.mainnet]: { aliasName: 'CUDOS Main Network' },
  },
  LINKS: {
    [CHAIN_IDS.public]: 'http://multisig.testnet.cudos.org',
    [CHAIN_IDS.mainnet]: 'http://multisig.cudos.org'
  }
}

export const chainIDToAlias = (chainID: string): string => {
  return chainDetails.CHAIN_IDS[chainID].aliasName || "Unidentified Network"
}

const NetworkInfo = () => {
  const networksToDisplayInMenu = [CHAIN_IDS.public, CHAIN_IDS.mainnet]
  const [open, setOpen] = useState(false)

  // Disabling network selection menu
  const collapsable = false

  return (
    <StyledNetwork sx={
      !collapsable ? {} : { cursor: 'pointer' }}
    >
      <Box onClick={!collapsable ? () => { } : () => setOpen(true)} style={styles.userContainer}>
        <Box style={styles.userInnerContainer}>
          <img style={{ marginRight: '10px' }} src={globusIcon} alt="globus-icon" />
          <Typography>
            {chainIDToAlias(CHAIN_ID)}
          </Typography>
          {collapsable ?
            <Box style={{ marginLeft: '15px' }}>
              <img
                style={{
                  cursor: 'pointer',
                  transform: open ? 'rotate(180deg)' : 'rotate(360deg)'
                }}
                src={ArrowIcon}
                alt="Arrow Icon"
              />
            </Box> : null}
        </Box>
      </Box>
      <Collapse
        onMouseLeave={() => setOpen(false)}
        style={{ marginTop: '-28px', zIndex: '-1' }}
        in={open}
      >
        <Box gap={3} style={styles.networkSelectionMenuContainer}>
          {
            networksToDisplayInMenu.map((network, idx) => {
              const [hovered, setHovered] = useState<boolean>(false)

              return (
                CHAIN_ID !== network ?
                  <Box key={network + idx.toString()} onMouseOver={() => setHovered(true)} onMouseOut={() => setHovered(false)}>
                    <a style={styles.anchorStyle} href={chainDetails.LINKS[network]}>
                      <img
                        style={{ marginRight: '10px' }}
                        src={hovered ? globusIcon : grayGlobusIcon}
                        alt="globus-icon"
                      />
                      <Typography
                        color={hovered ? COLORS_DARK_THEME.PRIMARY_BLUE : COLORS_DARK_THEME.SECONDARY_TEXT}>
                        {chainDetails.CHAIN_IDS[network].aliasName}
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
    </StyledNetwork >
  )
}

export default NetworkInfo

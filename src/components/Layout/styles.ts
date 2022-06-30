// @ts-nocheck
import { styled, Box } from '@mui/material'
import theme from '../../theme'

export const styles = {
  avatarStyling: {
    borderRadius: "0px", 
    width: '18px', 
    height: '18px'
  },
  menuContainer: {
    background: theme.dark.custom.backgrounds.primary,
    width: '88px',
    borderRadius: '1.3rem',
    height: '100%',
    padding: '20px',
    flexShrink: 0
  },
  userContainer: {
    padding: '12px 20px',
    position: 'relative',
    background: theme.dark.custom.backgrounds.primary,
    borderRadius: '35px',
    maxWidth: '100%',
    maxHeight: '48px'
  },
  userInnerContainer: {
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    justifyContent: 'center',
    alignItems: "center"
  },
  fancyLine: {
    border: "none",
    borderLeft: "2px solid #414963",
    height: "20px",
    margin: "0 15px 0 15px"
  },
  dropdownMenuContainer: {
    background: theme.dark.custom.backgrounds.light,
    float: 'right',
    fontSize: '14px',
    height: '224px',
    width: '224px',
    minWidth: '224px',
    fontWeight: '500',
    display: 'flex',
    borderRadius: '0px 0px 20px 20px',
    marginTop: '3px',
    justifyContent: 'center'
  },
  footerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    bottom: 0,
    right: 0,
    left: 0,
    width: 'inherit',
    padding: '20px 0 10px 0'
  }
} as const

export const StyledNetwork = styled(Box)(({ theme }) => ({
  maxWidth: '100%',
  maxHeight: '48px',
  borderRadius: '55px',
  backgroundColor: theme.custom.backgrounds.primary,
  padding: '15px 20px 15px 20px'
}))

export const StyledUser = styled(Box)(({ theme }) => ({
  minWidth: 'max-content',
  maxHeight: '48px',
  borderRadius: '55px',
  background: theme.custom.backgrounds.primary,
  zIndex: '10',
  cursor: 'pointer'
}))

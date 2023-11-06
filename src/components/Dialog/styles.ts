import { styled, Box } from '@mui/material'
import { CancelRounded, ArrowBack } from '@mui/icons-material'

export const styles = {
  loadingProps: {
    sx: {
      background: 'transparent',
      boxShadow: 'none',
      position: 'fixed',
      overflow: 'hidden',
      borderRadius: '25px'
    }
  },
  defaultPaperProps: {
    sx: {
      background: 'transparent',
      width: '100%',
      height: 'min-content',
      position: 'absolute',
      top: '1%',
      overflow: 'hidden',
      borderRadius: '25px'
    }
  },
  defaultBackDrop: {
    style: {
      backgroundColor: 'transparent',
      backdropFilter: "blur(6px)",
      opacity: 0.9
    }
  },
  successWalletInfoHolder: {
    overflow: 'auto',
    maxWidth: '200px',
    maxHeight: '150px',
    wordBreak: 'break-word'
  },
  SuccessHolderInfoBox: {
    margin: '0 0 10px 0',
    display: "flex",
    justifyContent: 'space-between',
    alignItems: "center",
  },
  SuccessHolderBox: {
    margin: '10px 0',
    display: "flex",
    justifyContent: 'space-between',
    alignItems: "center",
    padding: "0.5rem 0"
  },
  loadingModalContainer: {
    minWidth: '600px',
    minHeight: '300px',
    padding: '4rem'
  },
  icons: {
    marginLeft: '10px',
    cursor: 'pointer'
  },
  disabledIcons: {
    visibility: 'hidden',
    opacity: '0',
    marginLeft: '10px',
    pointerEvents: 'none'
  },
  alertInfo: {
    display: 'flex',
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: '-20px',
    height: '50px',
    borderRadius: '10px',
    backgroundColor: "rgba(245, 185, 94, 0.1)"
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  addressInput: {
    width: '550px',
    height: '50px',
    backgroundColor: '#28314E',
    fontSize: '90%',
    paddingLeft: '20px',
    borderRadius: '5px'
  },
  btnLogo: {
    marginRight: '15px'
  },
  addressBookIcon: {
    margin: '35px 0 20px 0'
  },
  infoHolder: {
    display: "flex",
    alignItems: "flex-start",
    width: '100%'
  },
  csvBtn: {
    background: 'none',
  },
  trashbin: {
    position: "absolute",
    right: "-180px",
    top: "-15px"
  },
  btn: {
    borderRadius: "12px",
    padding: '5px',
    display: "grid",
    placeItems: "center",
    heigth: '35px',
    width: 'max-content',
    minWidth: '40px',
    background: 'rgba(82, 166, 248, 1)',
  }
}

export const ModalContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  background: theme.custom.backgrounds.primary,
  padding: '30px 57px',
  borderRadius: '20px',
  boxShadow: '2px 10px 20px rgba(2, 6, 20, 0.6)',
  zIndex: 1
}))

export const CancelRoundedIcon = styled(CancelRounded)(({ theme }) => ({
  color: theme.palette.text.secondary,
  position: 'absolute',
  top: 32,
  right: 32,
  cursor: 'pointer'
}))

export const ArrowBackIcon = styled(ArrowBack)(({ theme }) => ({
  color: theme.palette.text.secondary,
  position: 'absolute',
  top: 32,
  left: 32,
  cursor: 'pointer'
}))

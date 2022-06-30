import { styled, Box } from '@mui/material'
import { CancelRounded } from '@mui/icons-material'

export const styles = {
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
    width: '40px',
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


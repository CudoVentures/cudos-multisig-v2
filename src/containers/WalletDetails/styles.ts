/* eslint-disable import/prefer-default-export */
export const styles = {
  topBtn: {
    width: '210px', height: '45px'
  },
  btnLogo: {
    marginRight: '10px'
  },
  connectButton: {
    height: '50px',
    width: '220px',
    marginTop: '50px',
    marginBottom: '40px'
  },
  plusIcon: {
    marginRight: '20px'
  },
  addressBookIcon: {
    marginRight: '10px'
  },
  addressBookBtn: {
    background: 'none',
    textDecoration: 'none',
    position: 'relative',
    marginRight: '10px',
    height: 'fit-content'
  },
  contentDissapear: {
    opacity: '1', 
    transition: 'all 0.5s', 
    WebkitTransition: 'all 0.5s'
  },
  Card: {
    textAlign: "center",
    width: '1000px',
    height: '100%',
    marginLeft: '40px',
    transition: "all 0.5s",
    backgroundColor: 'transparent'
  },
  leftSteps: {
      display: 'flex',
      opacity: '0',
      margin: '0',
      width: '250px',
      minWidth: '0',
      height: '580px',
      textAlign: "center",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: 'center',
      transition: "all 0.5s",
  },
  holder: {
      display: 'flex', 
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    },
  contentAppear: {
    opacity: '1', 
    transition: 'all 0.5s', 
    WebkitTransition: 'all 0.5s'
  },
  informativeBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start"
  },
} as const

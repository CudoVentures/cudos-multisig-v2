/* eslint-disable import/prefer-default-export */
export const styles = {
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
  btnLogo: {
    marginRight: '10px'
  },
  btn: {
    borderRadius: "12px",
    padding: '5px',
    display: "grid",
    placeItems: "center",
    heigth: '35px',
    width: '40px',
    background: 'rgba(82, 166, 248, 1)',
  },
  addressBookBtn: {
    background: 'none',
    textDecoration: 'none',
    position: 'relative',
    marginRight: '10px',
    height: 'fit-content'
  },
  contentDissapear: {
    opacity: '0', 
    transition: 'all 0.5s', 
    WebkitTransition: 'all 0.5s'
  },
  Card: {
    textAlign: "center",
    width: '100%',
    height: '500px',
    transition: "all 0.5s",
  },
  leftSteps: {
    padding: '0',
    margin: '0',
    width: '0',
    textAlign: "center",
    flexDirection: "column",
    justifyContent: "center",
    transition: "all 0.5s",
  },
  welcomeHolder: {
    display: 'flex', 
    height: '100%',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contentHolder: {
    display: 'flex',
    flexDirection: 'column',
    width: '1250px',
    height: 'inherit'
  }
} as const

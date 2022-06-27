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
  addressBookBtn: {
    background: 'none',
    textDecoration: 'none',
    position: 'relative',
    marginRight: '10px',
    height: 'fit-content'
  },
  contentDissapear: {
    opacity: '0', 
    transition: 'opacity 0.5s', 
    WebkitTransition: 'opacity 0.5s'
  },
  Card: {
    textAlign: "center",
    width: '100%',
    height: '500px',
    transition: "all 1s",
  },
  leftSteps: {
    padding: '0',
    margin: '0',
    width: '0',
    textAlign: "center",
    flexDirection: "column",
    justifyContent: "center",
    transition: "all 1s",
  },
  welcomeHolder: {
    display: 'flex', 
    height: '100%',
    justifyContent: 'center',
    width: '100%',
    padding: '0 100px',
    flexDirection: 'column',
    alignItems: 'center',
  },
  contentHolder: {
    display: 'flex',
    flexDirection: 'column',
    width: '50%',
    height: 'inherit'
  }
} as const

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
    opacity: '1', 
    transition: 'opacity 0.5s', 
    WebkitTransition: 'opacity 0.5s'
  },
  Card: {
    textAlign: "center",
    width: '0',
    height: '100%',
    marginLeft: '0',
    transition: "all 1s",
    backgroundColor: 'transparent'
  },
  leftSteps: {
      display: 'flex',
      margin: '0',
      width: '0',
      minWidth: '0',
      height: '580px',
      textAlign: "center",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: 'center',
      transition: "all 1s",
  },
  holder: {
      display: 'flex', 
      height: '100%',
      justifyContent: 'center',
      width: '100%',
    },
  contentAppear: {
    height: '100%',
    opacity: '0', 
    transition: 'opacity 0.5s', 
    WebkitTransition: 'opacity 0.5s'
  },
  informativeBlock: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start"
  },
} as const

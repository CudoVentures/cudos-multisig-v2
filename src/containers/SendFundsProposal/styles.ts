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
      transition: 'all 0.5s', 
      WebkitTransition: 'all 0.5s'
    },
    Card: {
      textAlign: "center",
      width: '0',
      height: '580px',
      marginLeft: '0',
      transition: "all 0.5s",
      padding: '50px 30px'
    },
    leftSteps: {
        display: 'flex',
        margin: '0',
        width: '0',
        minWidth: '0',
        height: '580px',
        textAlign: "center",
        flexDirection: "column",
        alignItems: 'center',
        paddingBottom: '50px',
        transition: "all 0.5s",
    },
    holder: {
        display: 'flex', 
        height: '100%',
        justifyContent: 'center',
        width: '100%',
      },
    contentAppear: {
      opacity: '0', 
      transition: 'all 0.5s', 
      WebkitTransition: 'all 0.5s'
    },
    informativeBlock: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start"
    },
  } as const
  
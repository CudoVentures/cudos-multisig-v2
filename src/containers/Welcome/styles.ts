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
  contentDissapear: {
    opacity: '1', 
    transition: 'opacity 0.5s', 
    WebkitTransition: 'opacity 0.5s'
  },
  Card: {
    textAlign: "center",
    width: '900px',
    height: '600px',
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    transition: "all 1s",
  },
  leftSteps: {
    padding: '0',
    margin: '0',
    width: '0',
    textAlign: "center",
    height: '600px',
    flexDirection: "column",
    justifyContent: "center",
    transition: "all 1s",
  },
  holder: {
    display: 'flex', 
    height: '600px',
    justifyContent: 'center',
    width: '100%'
  }
} as const

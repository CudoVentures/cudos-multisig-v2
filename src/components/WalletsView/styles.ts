/* eslint-disable import/prefer-default-export */
export const styles = {
  spanHolderSummary: {
    width: '20px',
    margin: '0 10px', 
    color: "rgb(82, 166, 248)", 
    fontSize: "14px", 
    fontWeight: "600"
  },
  summaryTableBody: {
    overflowY: 'scroll', 
    overflowX: 'clip', 
    height: '415px',
    width: "100%",
    display: 'flex',
    flexDirection: 'column',
    padding: "0px 20px 0px 5px"
  },
    connectButton: {
        height: '50px',
        width: '220px',
        margin: '10px'
      },
    contentDissapear: {
      opacity: '1', 
      transition: 'opacity 0.5s', 
      WebkitTransition: 'opacity 0.5s'
    },
    btnLogo: {
      marginRight: '10px'
    },
  } as const
  
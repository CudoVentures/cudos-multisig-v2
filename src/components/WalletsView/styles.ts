/* eslint-disable import/prefer-default-export */
export const styles = {
  spanHolderSummary: {
    width: '20px',
    margin: '0 10px', 
    color: "rgb(82, 166, 248)", 
    fontSize: "14px", 
    fontWeight: "600"
  },
  textContainer: {
    display: "block",
    width: "180px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  summaryTableCell: {
    fontWeight: '600', 
    padding: '0px 10px 0px 35px', 
    width: '190px'
  },
  summaryTableRow: {
    backgroundColor: '#28314E',
    width: '100%',
    borderRadius: '20px',
    boxShadow: 5,
    padding: '5px 20px 5px 5px',
    margin: '8px 10px'
  },
  summaryTableBody: {
    overflowY: 'scroll', 
    overflowX: 'clip', 
    height: '418px',
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
  
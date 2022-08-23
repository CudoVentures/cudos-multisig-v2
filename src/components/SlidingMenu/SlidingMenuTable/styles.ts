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
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontWeight: "600"
    },
    btnContentHolder: {
      ':hover': {
          bgcolor: 'rgba(82, 166, 248, 0.1)',
      },
      borderRadius: '10px',
      height: '50px',
      width: '100%',
      justifyContent: 'space-between',
      padding: '0 10px'
  },
    summaryTableCell: {
      fontWeight: '600', 
      width: '280px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
    slidingMenuBtn: {
      textDecoration: 'none'
    },
    summaryTableRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#28314E',
        width: '100%',
        height: '50px',
        borderRadius: '10px',
        boxShadow: 5,
        margin: '5px 0'
    },
    summaryTableBody: {
      overflowY: 'scroll', 
      overflowX: 'clip', 
      height: '178px',
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
      dynamicStyle: {
        fontSize: "14px",
        overflow: "hidden",
        fontWeight: '600'
      },
      btnLogo: {
        marginRight: '10px'
      },
    } as const
    
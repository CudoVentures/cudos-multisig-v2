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
      width: "260px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    summaryTableCell: {
      fontWeight: '600', 
      width: '280px'
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
    
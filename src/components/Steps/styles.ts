/* eslint-disable import/prefer-default-export */
export const styles = {
  spanHolder: {
    width: '20px',
    margin: '0 10px', 
    float: 'left', 
    color: "rgb(82, 166, 248)", 
    fontSize: "16px", 
    fontWeight: "600"
  },
  tableInfo: {
    marginBottom: '10px', 
    float: 'left', 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "flex-start"
  },
  infoHolder: {
    display: "flex",  
    alignItems: "flex-start",
    width: '100%'
  },
  connectButton: {
    height: '35px',
    width: '150px',
    margin: '10px',
    float: 'right'
  },
btnLogo: {
  marginRight: '10px'
},
  tableContainer: {
    display: "flex", 
    justifyContent: "center"
  },
  tableBody: {
    display: 'block', 
    height: '150px', 
    overflow: 'scroll'
  },
  table: {
    backgroundColor: '#28314E', 
    minWidth: 530, 
    width: '100%', 
    height: '100%'
  },
  tableContainerHolder: {
    backgroundColor: '#28314E', 
    borderRadius: '20px', 
    padding: '20px'
  },
    stepInfoStyler: {
      color:'#52A6F8', 
      fontSize: '12px', 
      fontWeight: '600', 
      float: 'left'
    },
    alertInfo: {
      display: 'flex',
      justifyContent: "flex-start", 
      alignItems: "center", 
      marginTop: '30px', 
      height: '60px', 
      borderRadius: '10px', 
      backgroundColor: "rgba(245, 185, 94, 0.1)"
    },
    stepOneHolder: {
      padding: '30px 0 30px 0', 
      width: '100%', 
      height: '100%'
    },
    addressInput: {
      width: '830px', 
      height: '50px', 
      backgroundColor: '#28314E', 
      fontSize: '90%', 
      paddingLeft: '20px',
      borderRadius: '5px'
  },
  textArea: {
    width: '830px', 
    height: '100px',
    resize: 'none',
    backgroundColor: '#28314E', 
    fontSize: '15px', 
    paddingLeft: '20px',
    borderRadius: '5px',
    border: 'none',
    color: "#fff",
    outline: "none",
    padding: '10px 0 0 15px',
},
    accountInfo: {
      height: '190px',
      display: 'flex',
      borderRadius: '20px', 
      backgroundColor: "#28314E" ,
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "20px"
    },
    connectedAccountInfo: {
      borderRadius: '10px', 
      backgroundColor: '#20273E', 
      display: 'flex', 
      marginTop: '15px',
      padding: '10px 20px'
    }
  } as const
  
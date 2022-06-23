/* eslint-disable import/prefer-default-export */
export const styles = {
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
      width: '550px', 
      height: '50px', 
      backgroundColor: '#28314E', 
      fontSize: '90%', 
      paddingLeft: '20px',
      borderRadius: '5px'
  },
  textArea: {
    width: '550px', 
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
      backgroundColor: "#1f2d6754",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "20px",
      blend: 'pass-through'
    },
    connectedAccountInfo: {
      borderRadius: '10px', 
      backgroundColor: '#141a2fbd', 
      display: 'flex', 
      marginTop: '15px',
      padding: '10px 20px'
    }
  } as const
  
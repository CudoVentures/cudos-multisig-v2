export const styles = {
    leftOrientedBtn: () => ({
        width: '220px',
        height: '50px',
        marginRight: '10px',
        fontWeight: 700
    }),
    rightOrientedBtn: () => ({
      marginLeft: '10px',
      width: '220px',
      height: '50px',
      fontWeight: 700
      }),
    btnLogo: {
        marginRight: '15px'
      },
    csvBtn: {
      background: 'none',
    },
    btnHolder: {
      display: 'flex', 
      height: '80px', 
      alignItems: "flex-end"
    }
} as const
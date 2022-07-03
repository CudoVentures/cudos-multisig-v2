/* eslint-disable import/prefer-default-export */
export const styles = {
  menuHolder: {
    width: '200px', 
    display: "flex", 
    alignItems: "center", 
    flexDirection: "column"
  },
  menuBtn: {
    justifyContent: 'flex-start',
    width: '100%',
    height: 'min-content',
    borderRadius: '10px',
    ':hover': {
      bgcolor: '#28314E',
      textDecoration: 'none',
    }
  },
  menuIcon: {
    margin: '10px 20px'
  }
} as const

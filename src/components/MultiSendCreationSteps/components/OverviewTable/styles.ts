/* eslint-disable import/prefer-default-export */
export const styles = {
  headerCells: {
      color: '#7D87AA', 
      fontWeight: '600',
      fontSize: '14px',
      padding: '10px'
  },
  resultCells: {
    padding: '5px 5px 5px 5px',
    textAlign: "left",
    verticalAlign: "middle",
    fontWeight: 'bold'
  },
  resultRow: {
    display: "flex",

    alignItems: 'center',
  },
  tableContainer: {
    borderRadius: '10px', 
    backgroundColor: '#28314E', 
    height: '100%', 
    padding: '0px 20px 0px 20px',
    margin: '20px 0 10px 0'
  },
  footerSummary: {
    height: '100%',
    backgroundColor: '#28314E',
    borderTop: '2px solid rgba(99, 109, 143, 0.2)'
  },
  footerSummaryLeft: {
    paddingTop: '20px', 
    float: 'left', 
    height: '70px', 
    margin: '0 10px 0 10px'
  },
  footerSummaryRight: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    width: '180px',
    paddingTop: '20px', 
    float: 'right', 
    height: '70px', 
    margin: '0 10px 0 10px'
  }
} as const

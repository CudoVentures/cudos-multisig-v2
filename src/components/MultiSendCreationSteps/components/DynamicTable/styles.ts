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
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '26%',
    },
    tableContainer: {
      borderRadius: '10px', 
      backgroundColor: '#28314E', 
      width: '100%', 
      height: '100%', 
      padding: '0px 20px',
      margin: '10px 0'
    }
  } as const
  
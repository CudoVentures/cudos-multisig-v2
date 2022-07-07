import { COLORS_DARK_THEME } from "theme/colors";

/* eslint-disable import/prefer-default-export */
export const styles = {
  summaryTable: {
    marginTop: '-10px', 
    backgroundColor: COLORS_DARK_THEME.PRIMARY_BACKGROUND
  },
  summaryTableHead: {
    marginBottom: '5px', 
    display: 'block', 
    backgroundColor: 'transparent'
  },
  summaryTableBody: {
    display: 'flex', 
    height: '175px', 
    overflow: 'scroll',
    flexDirection: 'column'
  },
  summaryTHRow: {
    height: '30px', 
    paddingLeft: '10px', 
    display:"flex", 
    justifyContent: 'space-between'
  },
  summaryTBRow: {
    paddingLeft: '10px', 
    background: COLORS_DARK_THEME.LIGHT_BACKGROUND, 
    borderRadius: '10px', 
    margin: '10px 10px 5px 0px'
  },
  defaultSummaryTableCell: {
    width: '120px', 
    backgroundColor: COLORS_DARK_THEME.PRIMARY_BACKGROUND, 
    padding:'10px', 
    borderRadius:'10px'
  }

} as const
    
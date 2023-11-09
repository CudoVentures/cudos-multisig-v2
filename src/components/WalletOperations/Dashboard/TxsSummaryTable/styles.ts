import { COLORS_DARK_THEME } from "theme/colors";

export const styles = {
  selectableBox: {
    backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND,
    margin: '12px 0px 5px 0px',
    paddingLeft: '10px',
    position: 'relative',
    borderRadius: '10px',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    boxShadow: '0 2px 2px -2px black',
    "&:hover": {
      cursor: 'pointer',
      backgroundColor: 'rgba(82, 166, 248, 0.1)'
    },
  },
  proposalStatusBox: {
    float: 'right',
    cursor: 'pointer',
    width: "fit-content",
    display: 'flex',
    justifyContent: 'flex-end'
  },
  clockIcon: {
    marginRight: '5px',
    width: '18px',
    height: '18px'
  },
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
    padding: '0px 5px',
    display: 'flex',
    minHeight: '175px',
    maxHeight: '175px',
    overflow: 'scroll',
    flexDirection: 'column'
  },
  summaryTHRow: {
    height: '30px',
    paddingLeft: '10px',
    display: "flex",
    justifyContent: 'space-between'
  },
  defaultSummaryTableCell: {
    width: '120px',
    backgroundColor: COLORS_DARK_THEME.PRIMARY_BACKGROUND,
    padding: '10px',
    borderRadius: '10px'
  }

} as const

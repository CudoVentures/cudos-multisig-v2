import { COLORS_DARK_THEME } from "theme/colors";

export const styles = {
    tableRow: {
        display: 'flex', 
        width: '100%', 
        justifyContent: 'flex-start', 
        alignItems:'center'
    },
    selectableBox: {
        backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND,
        position: 'relative',
        borderRadius: '10px',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        display: 'flex',
        boxShadow: '0 2px 2px -2px black',
        "&:hover": {
            cursor: 'pointer',
            backgroundColor: 'rgba(82, 166, 248, 0.1)'
        },
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
    votesBox: {
        width: '100%',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    proposalStatusBox: {
        width: "100%",
        display: 'flex',
        justifyContent: 'flex-end'
    },
    clockIcon: {
        marginRight: '5px',
        width: '18px',
        height: '18px'
    },
    tableHead: {
        padding: '0',
        marginBottom: '-15px',
        borderRadius: '10px',
        display: 'block',        
        backgroundColor: COLORS_DARK_THEME.PRIMARY_BACKGROUND
    },
    addressHolderCell: {
        alignItems: 'center',
        display: 'inline-flex',
        color: COLORS_DARK_THEME.SECONDARY_TEXT
    },
    bodyRow: {
        padding: '0 20px',
        justifyContent: 'space-between',
        display: 'flex',
        width: '100%'
    },
    tableBody: {
        width: '100%',
        display: 'block',
        maxHeight: '620px',
        overflow: 'scroll'
    },
    tableContainer: {
        display: "flex",
        justifyContent: "center",
        width: '100%',
        maxHeight: '100%'
    },
    cardHolder: {
        height: '512px',
        marginTop: '10px',
        width: '100%',
        maxHeight: '100%',
        display: 'inline-table'
    },
    boxHolder: {
        height: '100%',
    },
    blueCountDisplayer: {
        borderRadius: "12px",
        padding: '5px',
        display: "grid",
        placeItems: "center",
        heigth: '35px',
        width: 'max-content',
        minWidth: '40px',
        marginLeft: '15px',
        background: 'rgba(82, 166, 248, 1)',
    },
    adressCounterHolder: {
        alignItems: 'center',
        display: 'flex',
        float: 'left',
        margin: '5px 0 0 10px'
    },
    icons: {
        marginLeft: '10px',
        cursor: 'pointer'
    },
} as const

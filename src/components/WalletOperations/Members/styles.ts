import { COLORS_DARK_THEME } from "theme/colors";

export const styles = {
    tableHead: {
        padding: '0 40px',
        borderRadius: '10px',
        display: 'block'
    },
    headRow: {
        justifyContent: 'space-between',
        display: 'flex'
    },
    addressHolderCell: {
        width: '440px',
        justifyContent: 'space-between',
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
        padding: '0 20px',
        display: 'block',
        height: '350px',
        overflow: 'scroll'
    },
    tableContainer: {
        display: "flex",
        justifyContent: "center",
        width: '100%'
    },
    cardHolder: {
        height: '512px',
        marginTop: '10px',
        width: '100%',
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

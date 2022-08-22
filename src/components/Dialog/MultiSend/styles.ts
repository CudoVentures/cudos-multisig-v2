import { COLORS_DARK_THEME } from "theme/colors";
import { styles as defaultStyles } from "../styles";

export const styles = {
    specificPaperProps: {
        sx: {
            ...defaultStyles.defaultPaperProps.sx,
            maxWidth: 'max-content',
        }
    },
    contentHolder: {
        width: '100%',
        height: '100%',
        display: "block",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
    },
    walletAddress: {
        display: 'flex',
        margin: '30px 0 5px 0',
        justifyContent: 'space-between'
    },
    connectedAddress: {
        width: '100%',
        display: 'flex',
        margin: '50px 0 5px 0',
        justifyContent: 'space-between'
    },
    multiSigTitle: {
        textAlign: 'center',
        width: '910px',
        float: 'left'
    },
    mainBtnsHolder: {
        borderTop: `2px solid ${COLORS_DARK_THEME.LIGHT_BACKGROUND}`,
        width: '100%',
        justifyContent: 'space-evenly',
        display: 'flex'
    },
    borderlessMainBtnsHolder: {
        width: '100%',
        justifyContent: 'space-evenly',
        display: 'flex'
    },
    mainBtns: () => ({
        marginTop: '20px',
        width: '200px',
        fontWeight: 700
    }),
    changeBtn: () => ({
        width: 'max-content',
        height: '30px'
    }),
    formattedSenderAddressHolder: {
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '10px',
        width: '100%',
        color: COLORS_DARK_THEME.SECONDARY_TEXT,
        backgroundColor: COLORS_DARK_THEME.DARK_BACKGROUND
    },
    formattedBalanceHolder: {
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '5px',
        color: COLORS_DARK_THEME.SECONDARY_TEXT,
        backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND
    },
    formattedRecipientAddressHolder: {
        textAlign: 'left',
        padding: '10px',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '10px',
        backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND
    },
    addToListButton: {
        height: '35px',
        width: 'min-content',
    },
    headerCells: {
        color: COLORS_DARK_THEME.SECONDARY_TEXT,
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
        width: '100%',
        height: '100%',
    },
    csvBtn: {
        height: '30px',
        paddingRight: '0',
        marginBottom: '5px',
        float: 'right',
        background: 'none'
    },
    tableHead: {
        borderRadius: '10px',
        width: '100%',
        display: 'block'
    },
    invisibleClearBtn: {
        visibility: 'hidden',
        padding: '0 0 0 5px',
        margin: '0',
        float: 'right',
        background: 'none'
    },
    visibleClearBtn: {
        padding: '0px',
        margin: '0',
        float: 'right',
        background: 'none'
    },
    tableBody: {
        display: 'block',
        height: '130px',
        overflow: 'scroll',
        padding: '5px',
        marginBottom: '-10px'
    },
    thrashBinIcon: {
        paddingRight: '0',
        marginBottom: '5px',
        float: 'right',
        background: 'none'
    },
    upperSummaryTable: {
        display: 'grid',
        backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND,
        height: '173px',
        padding: '10px 20px 20px 20px',
        margin: '20px 0 20px 0',
        width: '100%',
        borderRadius: '10px'
    },
    lowerSummaryTable: {
        display: 'grid',
        backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND,
        height: '88px',
        padding: '20px',
        margin: '10px 0 10.5px 0',
        width: '100%',
        borderRadius: '10px',
        alignContent: 'center'
    },
    smallTooltip: {
        float: 'left',
        padding: '0',
        margin: '0',
        height: '25px'
    },
    addRowHolder: {
        marginTop: '-10px',
        alignItems: 'flex-end',
        width: '100%',
        display: 'flex'
    },
    amountHeadCell: {
        padding: '0px 0px 0px 65px',
        textAlign: 'left',
        width: '250px'
    },
    addressHeadCell: {
        padding: '10px',
        width: '410px'
    },
    hashHeadCell: {
        padding: '10px 10px 10px 24px'
    },
    menuProps: {
        style: {
            maxHeight: 195,
        },
    },
    clearBtn: {
        padding: '0', 
        textDecoration: 'none'
    },
    placeholder: {
        fontSize: '15.4px',
        color: '#8f95a5'
    }
} as const
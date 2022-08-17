import { COLORS_DARK_THEME } from "theme/colors";

export const styles = {
    icons: {
        marginLeft: '10px',
        cursor: 'pointer'
    },
    addressBookBtn: {
        background: 'none',
        textDecoration: 'none',
        position: 'relative',
        padding: '0',
        height: 'fit-content'
    },
    addressBookIcon: {
        marginRight: '10px'
    },
    centerFlexLinear: {
        alignItems: 'center', 
        display: 'flex', 
        justifyContent: 'center'
    },
    smallTooltip: {
        float: 'left', 
        padding: '0', 
        margin: '0'
      },
    controlsHolder: {
        width: '100%',
        display: "flex",
        justifyContent: 'space-evenly'
    },
    selectFromAddrBook: {
        width: '100%',
        display: "flex",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    centerFlex: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    backDrop: {
        style: {
            backgroundColor: 'transparent',
            backdropFilter: "blur(6px)",
            opacity: 0.8
        }
    },
    paperProps: {
        sx: {
            border: 'none',
            position: 'absolute',
            overflow: 'hidden',
            borderRadius: '25px'
        }
    },
    modalContainer: {
        padding: '50px',
        boxShadow: 'none',
        overflow: 'hidden',
        backgroundColor: COLORS_DARK_THEME.PRIMARY_BACKGROUND
    },
    goBackBtn: () => ({
        marginTop: '30px',
        width: '100%',
        fontWeight: 700
    }),
    ctrlBtn: () => ({
        marginTop: '30px',
        width: '100%',
        fontWeight: 700
    }),
    contentHolder: {
        width: '100%',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    addressInput: {
        width: '450px',
        height: '50px',
        backgroundColor: '#28314E',
        fontSize: '90%',
        paddingLeft: '20px',
        borderRadius: '5px'
    },
    typography: {
        margin: '20px 0 10px 0'
    }
} as const
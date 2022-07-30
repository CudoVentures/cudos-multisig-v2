import { COLORS_DARK_THEME } from "theme/colors";

export const styles = {
    titleHolder: {
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center'
    },
    controlsHolder: {
        width: '100%',
        display: "flex",
        justifyContent: 'space-evenly'
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
        width: '100%',
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
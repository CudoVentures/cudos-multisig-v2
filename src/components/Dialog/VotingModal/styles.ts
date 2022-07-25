import { COLORS_DARK_THEME } from "theme/colors";

export const styles = {
    uperInfoHolder: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textAreaHolder: {
        height: '90px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    backDrop: {
        style: {
            backgroundColor: 'transparent',
            backdropFilter: "blur(6px)",
            opacity: 0.8
        }
    },
    executePaperProps: {
        sx: {
            border: 'none',
            maxWidth: '500px',
            minWidth: '500px',
            width: '100%',
            height: '330px',
            position: 'absolute',
            overflow: 'hidden',
            borderRadius: '25px'
        }
    },
    paperProps: {
        sx: {
            border: 'none',
            maxWidth: '500px',
            minWidth: '500px',
            width: '100%',
            height: '400px',
            position: 'absolute',
            overflow: 'hidden',
            borderRadius: '25px'
        }
    },
    modalContainer: {
        boxShadow: 'none',
        padding: '35px 50px 50px 50px',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: COLORS_DARK_THEME.PRIMARY_BACKGROUND
    },
    textArea: {
        width: '350px',
        height: '100px',
        resize: 'none',
        backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND,
        fontSize: '15px',
        paddingLeft: '20px',
        borderRadius: '5px',
        border: 'none',
        color: "#fff",
        outline: "none",
        padding: '10px 0 0 15px',
    },
    addComment: {
        textDecoration: 'none',
        fontSize: '12px',
        float: 'left',
        width: '130px'
    },
    btnHolderBox: {
        display: 'flex',
        justifyContent: 'space-evenly',
        marginTop: '35px',
        width: '100%'
    },
    confirmationBtns: {
        width: '160px',
        height: '50px'
    }
} as const
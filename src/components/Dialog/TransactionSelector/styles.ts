import { COLORS_DARK_THEME } from "theme/colors";

export const styles = {
    btnHolder: {
        marginTop: '40px',
        width: '100%',
        height: '100%',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
    },
    dialogPaperProps: {
        sx: {
            background: 'transparent',
            width: '100%',
            height: 'min-content',
            boxShadow: 'none',
            position: 'absolute',
            top: '1%',
            overflow: 'hidden',
            borderRadius: '25px'
        }
    },
    menuListProps: {
        'aria-labelledby': 'basic-button',
    },
    menuProps: {
        sx: {
            borderRadius: '20px',
            marginTop: '-20px',
            marginLeft: '190px',
            backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND,
        }
    },
    TxBtns: {
        margin: '5px', 
        height: '50px', 
        width: '220px'
    }
} as const

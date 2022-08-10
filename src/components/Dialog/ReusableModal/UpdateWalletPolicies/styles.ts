import { COLORS_DARK_THEME } from "theme/colors";

export const styles = {
    selectionHolder: {
        margin: '10px 0', 
        justifyContent: 'space-evenly', 
        display: 'flex', 
        alignItems: 'center',
        width: '100%'
    },
    formControl: {
        backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND
    },
    select: () => ({
        width: '160px',
        height: '55px',
        padding: '10px'
    }),
    contentHolder: {
        width: '100%',
        display: "flex",
        flexDirection: 'column',
        alignItems: "flex-start"
    },
    thresholdInput: {
        width: '160px', 
        height: '55px', 
        backgroundColor: '#28314E', 
        fontSize: '90%', 
        paddingLeft: '20px',
        borderRadius: '5px'
    },
    addressInput: {
        width: '100%', 
        height: '50px', 
        backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND, 
        fontSize: '90%', 
        paddingLeft: '20px',
        borderRadius: '5px'
    },
    textArea: {
        height: '50px', 
        width: '100%', 
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
} as const
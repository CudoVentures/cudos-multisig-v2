import { COLORS_DARK_THEME } from "theme/colors";

export const styles = {
    fromToHolder: {
        marginTop: '10px', 
        display: 'flex', 
        justifyContent: 'space-between'
    },
    contentHolder: {
        padding: '0px 10px 0 10px',
        width: '350px',
        display: "flex",
        flexDirection: "column"
    },
    links: {
        color: COLORS_DARK_THEME.PRIMARY_BLUE,
        textDecoration: 'none',
        marginTop: '5px'
    }
} as const
import { COLORS_DARK_THEME } from "theme/colors";

/* eslint-disable import/prefer-default-export */
export const styles = {
    summaryHolder: {
      width: '200px', 
      display: "flex", 
      alignItems: "center", 
      flexDirection: "column",
      margin: '25% 0 0 0'
    },
    boxHolder: {
      backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND, 
      flexDirection: 'column', 
      display: 'flex', 
      padding: '10px', 
      width: '100%', 
      borderRadius: '20px', 
      height: '240px'
    }
  } as const
  
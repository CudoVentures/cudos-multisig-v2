import { COLORS_DARK_THEME } from "theme/colors";

/* eslint-disable import/prefer-default-export */
export const styles = {
    summaryHolder: {
      width: '200px', 
      display: "flex", 
      alignItems: "center", 
      flexDirection: "column",
      margin: '25% 0 0 0',
      position: 'relative'
    },
    textContainer: {
      display: "inline-block",
      width: "180px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    },
    linkIcon: {
      marginLeft: '10px', 
      marginTop:'3px', 
      cursor: 'pointer'
    },
    logoutBtn: {
      textDecoration: 'none',
      fontSize: '12px', 
      float: 'left'
    },
    switchBtn: {
      textDecoration: 'none', 
      fontSize: '12px', 
      float: 'right'
    },
    contentHolder: {
      height: '100%', 
      position:'relative', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'flex-end'
    },
    boxHolder: {
      backgroundColor: COLORS_DARK_THEME.LIGHT_BACKGROUND, 
      flexDirection: 'column', 
      display: 'flex', 
      padding: '10px', 
      width: '100%', 
      borderRadius: '20px', 
      height: '240px',
      alignItems: 'center',
      position: 'absolute',
    },
    slidingHolder: {
      position: 'relative', 
      zIndex: '0', 
      width: '100%'
    }
  } as const
  
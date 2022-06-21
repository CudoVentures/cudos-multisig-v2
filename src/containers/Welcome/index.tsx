// @ts-nocheck
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { store } from '../../store'
import { persistStore } from 'redux-persist'

const Welcome = () => {
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const renderStepOne = async () => {
    try {
      // REMOVING CONTENT FROM RIGHT CARD
      document.getElementById("content-dissapear").style.opacity = '0'

      // RESIZING RIGHT CARD
      document.getElementById("resizable-card-right").style.justifyContent = 'center'
      document.getElementById("resizable-card-right").style.flexDirection = 'column'
      document.getElementById("resizable-card-right").style.display = 'flex'
      document.getElementById("resizable-card-right").style.textAlign = 'center'
      document.getElementById("resizable-card-right").style.width = '1030px'
      document.getElementById("resizable-card-right").style.height = '600px'
      
      // RESIZING LEFT CARD
      document.getElementById("resizable-card-left").style.display = 'flex'
      document.getElementById("resizable-card-left").style.justifyContent = 'center'
      document.getElementById("resizable-card-left").style.width = '240px'
      document.getElementById("resizable-card-left").style.textAlign = 'center'
      document.getElementById("resizable-card-left").style.height = '600px'
      document.getElementById("resizable-card-left").style.pading = '0 40px'
      document.getElementById("resizable-card-left").style.marginRight = '40px'

      await new Promise(resolve => setTimeout(resolve, 1000))
      // navigate('/') TO DO

    } catch (error: any) {
      alert(error.message)
    }
  }

  return (
    <div></div>
      // <Box style={styles.holder}>
      //   <Card id='resizable-card-left' style={styles.leftSteps}></Card>
        
      //   <Card id='resizable-card-right' style={styles.Card}>
      //     <div id='content-dissapear' style={styles.contentDissapear}>
      //     <Box>
      //       <img src={WelcomeGroupLogo} alt="Welcome logo" />
      //     </Box>
      //     <Box>
      //         <h2>Welcome to CUDOS MultiSend!</h2>
      //     </Box>
      //     <Box>
      //         <Typography variant="subtitle1" color="text.secondary">
      //           MultiSend allows you to batch send tokens to multiple addresses in one transaction.
      //         </Typography>
      //     </Box>
      //     <Box>
      //       <Button style={styles.connectButton} onClick={() => renderStepOne()}>
      //           <img style={styles.plusIcon} src={PlusIcon} alt="Keplr Logo" />
      //           Multisend tokens
      //       </Button>
      //     </Box>
      //     </div>
      //   </Card>
      // </Box>
  )
}

export default Welcome

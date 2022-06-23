import React from 'react'
import { Paper } from '@mui/material'

const Card = ({
  children,
  style,
  id,
}: {
  children: React.ReactNode
  style: any
  id: any
}) => {
  return (
    <Paper
      sx={{
        borderRadius: '20px',
        padding: '20px',
        background: '#20273E'
      }}
      style={style}
      id={id}
    >
      {children}
    </Paper>
  )
}

export default Card

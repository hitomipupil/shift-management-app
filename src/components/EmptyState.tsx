import { Box, Typography } from '@mui/material'
import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  message: string
  icon?: ReactNode
}

export const EmptyState = ({ message, icon }: EmptyStateProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        py: 4,
        color: 'text.disabled',
      }}
    >
      {icon ?? <InboxOutlinedIcon fontSize="large" />}
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  )
}

import { Box, IconButton, Typography } from '@mui/material'

export const WeekNavigator = () => {
  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      <IconButton>{'<'}</IconButton>
      <Typography variant="h6">Jun 29 - Jul 5, 2026</Typography>
      <IconButton>{'>'}</IconButton>
    </Box>
  )
}

import { Box, IconButton, Typography } from '@mui/material'

type WeekNavigatorProps = {
  weekStartDate: string
  onPreviousWeek: () => void
  onNextWeek: () => void
}

export const WeekNavigator = ({
  weekStartDate,
  onPreviousWeek,
  onNextWeek,
}: WeekNavigatorProps) => {
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
      <IconButton onClick={onPreviousWeek}>{'<'}</IconButton>
      <Typography variant="h6">{weekStartDate}</Typography>
      <IconButton onClick={onNextWeek}>{'>'}</IconButton>
    </Box>
  )
}

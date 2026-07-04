import { Box, IconButton, Typography } from '@mui/material'

type WeekNavigatorProps = {
  weekRangeLabel: string
  onPreviousWeek: () => void
  onNextWeek: () => void
}

export const WeekNavigator = ({
  weekRangeLabel,
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
      <Typography variant="h6">{weekRangeLabel}</Typography>
      <IconButton onClick={onNextWeek}>{'>'}</IconButton>
    </Box>
  )
}

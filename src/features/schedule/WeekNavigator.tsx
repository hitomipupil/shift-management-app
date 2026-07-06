import { Box, IconButton, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

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
        justifyContent: 'space-between',
      }}
    >
      <IconButton onClick={onPreviousWeek} aria-label="Previous week">
        <ChevronLeftIcon />
      </IconButton>
      <Typography
        variant="subtitle1"
        sx={{ flex: 1, textAlign: 'center', fontWeight: 600 }}
      >
        {weekRangeLabel}
      </Typography>
      <IconButton onClick={onNextWeek} aria-label="Next week">
        <ChevronRightIcon />
      </IconButton>
    </Box>
  )
}

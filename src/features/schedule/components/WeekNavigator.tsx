import { Box, Button, IconButton, Typography } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'

type WeekNavigatorProps = {
  weekRangeLabel: string
  isCurrentWeek: boolean
  onPreviousWeek: () => void
  onNextWeek: () => void
  onToday: () => void
}

export const WeekNavigator = ({
  weekRangeLabel,
  isCurrentWeek,
  onPreviousWeek,
  onNextWeek,
  onToday,
}: WeekNavigatorProps) => {
  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2 },
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
      }}
    >
      <IconButton onClick={onPreviousWeek} aria-label="Previous week">
        <ChevronLeftIcon />
      </IconButton>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {weekRangeLabel}
        </Typography>
        <Button
          size="small"
          variant="text"
          onClick={onToday}
          disabled={isCurrentWeek}
        >
          Today
        </Button>
      </Box>
      <IconButton onClick={onNextWeek} aria-label="Next week">
        <ChevronRightIcon />
      </IconButton>
    </Box>
  )
}

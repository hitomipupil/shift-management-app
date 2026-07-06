import { Box, Typography } from '@mui/material'

type DetailRowProps = {
  label: string
  value: string
}

export const DetailRow = ({ label, value }: DetailRowProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 2,
        py: 0.75,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'right' }}>
        {value}
      </Typography>
    </Box>
  )
}

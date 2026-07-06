import { SvgIcon, type SvgIconProps } from '@mui/material'

export const AppLogo = (props: SvgIconProps) => (
  <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 28 }} {...props}>
    <path
      fill="#00008F"
      d="M12 22H5c-1.11 0-2-.9-2-2l.01-14c0-1.1.88-2 1.99-2h1V2h2v2h8V2h2v2h1c1.1 0 2 .9 2 2v6h-2v-2H5v10h7z"
    />
    <path
      fill="#FF1721"
      d="M22.13 16.99l.71-.71c.39-.39.39-1.02 0-1.41l-.71-.71a.996.996 0 0 0-1.41 0l-.71.71zM21.42 17.7l-5.3 5.3H14v-2.12l5.3-5.3z"
    />
  </SvgIcon>
)

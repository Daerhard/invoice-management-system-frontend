import { Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Variant } from '@mui/material/styles/createTypography'

interface CustomIconButtonProps {
    title: string;
    titleVariant: Variant;
    icon: any;
    iconSize: string;
    onClick?: () => void;
}

export default function CustomIconButton({ title, titleVariant, icon, iconSize, onClick }: CustomIconButtonProps) {
    return (
        <IconButton
            onClick={onClick}
            disableRipple
            sx={{
                ':hover': {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                },
            }}
        >
            <Typography sx={{ marginRight: '0.5rem' }} variant="body2">
                {title}
            </Typography>
            <FontAwesomeIcon icon={icon} size="xs" />
        </IconButton>
    );
}

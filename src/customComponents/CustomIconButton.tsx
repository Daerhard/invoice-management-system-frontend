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
    iconPosition?: 'left' | 'right';
}

export default function CustomIconButton({ title, titleVariant, icon, iconSize, onClick, iconPosition = 'right' }: CustomIconButtonProps) {
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
            {iconPosition === 'left' && (
                <FontAwesomeIcon icon={icon} size="xs" />
            )}
            <Typography sx={iconPosition === 'right' ? { marginRight: '0.5rem' } : { marginLeft: '0.5rem' }} variant="body2">
                {title}
            </Typography>
            {iconPosition === 'right' && (
                <FontAwesomeIcon icon={icon} size="xs" />
            )}
        </IconButton>
    );
}

import { IconButton, Typography } from '@mui/material'
import React from 'react'


export default function MenuItem({ title }: { title: string }) {

    return (
        <IconButton sx={{ margin: '0 10px' }}>
            <Typography variant="body1" color="black">{title}</Typography>
        </IconButton>
    )
}
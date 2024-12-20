import { CardmarketOrder } from '../../../api/generated/Schemas'
import { useState } from 'react'
import {
    Card, CardContent,
    CardHeader,
    Collapse,
    Stack,
    Typography,
} from '@mui/material'
import { faEnvelopeOpen, faFileInvoiceDollar, faFileLines } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CustomIconButton from '../../../customComponents/CustomIconButton'
import OrderItemContent from './OrderItemContent'

interface OrderItemProps {
    order: CardmarketOrder;
}

export default function OrderItem({ order }: OrderItemProps) {
    const [open, setOpen] = useState(false)

    const toggleDetails = () => setOpen(!open)

    return (
            <Card sx={{ width: '100%', marginBottom: '0.2rem' }}>
                <CardHeader
                    avatar={
                            <FontAwesomeIcon icon={faFileLines} size="2x"/>
                    }
                    action={
                    <Stack direction='row' sx={{justifyContent: 'left' }} >
                        <CustomIconButton
                            title={'Öffne Bestelldetails'}
                            titleVariant={'body2'}
                            icon={faEnvelopeOpen}
                            iconSize={'xs'}
                            onClick={toggleDetails}/>
                        <CustomIconButton
                            title={'Erstelle Rechnung (PDF)'}
                            titleVariant={'body2'}
                            icon={faFileInvoiceDollar}
                            iconSize={'xs'}/>
                        <CustomIconButton
                            title={'Erstelle Rechnung (E)'}
                            titleVariant={'body2'}
                            icon={faFileInvoiceDollar}
                            iconSize={'xs'}/>
                    </Stack>
                    }
                    title={
                        <Typography variant={'body2'}>{`Kunde: ${order.customer.user_name}`}</Typography>
                    }
                    subheader={
                        <Stack direction='row' spacing={6}>
                            <Typography variant={'body2'}>{`Bezahldatum: ${order.order_id}`}</Typography>
                            <Typography variant={'body2'}>{`Bestellnummer: ${order.order_id}`}</Typography>
                        </Stack>
                    }
                />
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <CardContent>
                    <OrderItemContent order={order}></OrderItemContent>
                    </CardContent>
                </Collapse>
            </Card>
    )
}
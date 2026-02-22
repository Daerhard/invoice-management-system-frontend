import { List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material';
import { CardmarketOrder } from '../../api/generated/Schemas';

interface StatisticProps {
  cardmarketOrders: CardmarketOrder[];
}

export default function Statistic({ cardmarketOrders }: StatisticProps) {
  function sumAndRound(values: number[]): number {
    const totalValue = values.reduce((sum, value) => sum + value, 0);
    return Math.round(totalValue * 100) / 100;
  }

  const ordersByMonthMap = new Map<string, CardmarketOrder[]>();

  cardmarketOrders.forEach((order) => {
    const date = new Date(order.payment_date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!ordersByMonthMap.has(key)) {
      ordersByMonthMap.set(key, []);
    }
    ordersByMonthMap.get(key)!.push(order);
  });

  const monthlyStats = Array.from(ordersByMonthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, orders]) => {
      return {
        month,
        totalValue: sumAndRound(orders.map(o => o.total_value)),
        shipmentCost: sumAndRound(orders.map(o => o.shipment_cost)),
        commission: sumAndRound(orders.map(o => o.commission)),
        merchandiseValue: sumAndRound(orders.map(o => o.merchandise_value)),
      };
    });

  // Summarize all monthly values
  const totalSummary = {
    totalValue: sumAndRound(monthlyStats.map(s => s.totalValue)),
    shipmentCost: sumAndRound(monthlyStats.map(s => s.shipmentCost)),
    commission: sumAndRound(monthlyStats.map(s => s.commission)),
    merchandiseValue: sumAndRound(monthlyStats.map(s => s.merchandiseValue)),
  };

  return (
    <div>
      <Tooltip
        title={
          <List>
            {/* Add summary item at the top */}
            <ListItem key="total" alignItems="flex-start">
              <ListItemText
                primary={<strong>Gesamtsumme aller Monate</strong>}
                secondary={
                  <>
                    <div>Gesamtwert: € {totalSummary.totalValue}</div>
                    <div>Versandkosten: € {totalSummary.shipmentCost}</div>
                    <div>Cardmarket Gebühren: € {totalSummary.commission}</div>
                    <div>Warenwert: € {totalSummary.merchandiseValue}</div>
                  </>
                }
              />
            </ListItem>

            {/* Monthly stats below */}
            {monthlyStats.map(stat => (
              <ListItem key={stat.month} alignItems="flex-start">
                <ListItemText
                  primary={`Monat: ${stat.month}`}
                  secondary={
                    <>
                      <div>Gesamtwert: € {stat.totalValue}</div>
                      <div>Versandkosten: € {stat.shipmentCost}</div>
                      <div>Cardmarket Gebühren: € {stat.commission}</div>
                      <div>Warenwert: € {stat.merchandiseValue}</div>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        }
        arrow
        placement="bottom"
      >
        <Typography variant="h6" style={{ cursor: 'pointer' }}>
          Statistik nach Monaten
        </Typography>
      </Tooltip>
    </div>
  );
}

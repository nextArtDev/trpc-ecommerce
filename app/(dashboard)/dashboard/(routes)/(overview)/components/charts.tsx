'use client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import { formatPrice } from '../../../lib/server-utils'

interface ChartData {
  month: string
  totalSales: number
}

interface ChartsProps {
  data: {
    salesData: ChartData[]
  }
}

const Charts = ({ data: { salesData } }: ChartsProps) => {
  // Debug: Log the data to see what we're getting
  // console.log('Chart data:', salesData)

  // Handle empty or invalid data
  if (!salesData || salesData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] text-muted-foreground">
        داده‌ای برای نمایش وجود ندارد
      </div>
    )
  }

  // Custom tick formatter for Persian currency
  const tickFormatter = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}م`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}ه`
    }
    return value.toString()
  }

  // Custom tooltip formatter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-lg p-2 shadow-md">
          <p className="text-sm font-medium">{`ماه: ${label}`}</p>
          <p className="text-sm text-primary">
            {`فروش: ${formatPrice(payload[0].value)}`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={salesData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="month"
            direction={'rtl'}
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#888888' }}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={tickFormatter}
            tick={{ fill: '#888888' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="totalSales"
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            name="فروش"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Charts

'use client'

import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface ChartDataPoint {
  product: string
  quantity: number
  count: number
}

interface DemandChartProps {
  data: ChartDataPoint[]
}

const BAR_COLORS = [
  '#4f46e5', // indigo-600
  '#6366f1', // indigo-500
  '#818cf8', // indigo-400
  '#3b82f6', // blue-500
  '#06b6d4', // cyan-500
  '#0d9488', // teal-600
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
]

export default function DemandChart({ data }: DemandChartProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="h-72 w-full flex items-center justify-center bg-slate-50/50 rounded-xl border border-slate-100">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
          <div className="h-48 w-full max-w-md bg-slate-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="h-72 w-full flex flex-col items-center justify-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200 text-slate-400">
        <p className="text-sm font-medium">No demand requests to display yet.</p>
        <p className="text-xs text-slate-400 mt-1">
          The chart will automatically populate as buyers submit requests.
        </p>
      </div>
    )
  }

  // Format data for chart display
  const chartData = data.slice(0, 10).map((item) => ({
    ...item,
    displayName:
      item.product.length > 22
        ? item.product.substring(0, 20) + '…'
        : item.product,
  }))

  return (
    <div className="w-full h-80 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 10, bottom: 45 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="displayName"
            tick={{ fill: '#64748b', fontSize: 12 }}
            interval={0}
            angle={-25}
            textAnchor="end"
            height={50}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val)}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as ChartDataPoint
                return (
                  <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700 min-w-[200px]">
                    <p className="font-semibold text-sm text-indigo-300 mb-1">
                      {item.product}
                    </p>
                    <div className="flex justify-between items-center py-1 border-t border-slate-800">
                      <span className="text-slate-400">Total Demand:</span>
                      <span className="font-bold text-white">
                        {item.quantity.toLocaleString()} units
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-0.5">
                      <span className="text-slate-400">Buyer Requests:</span>
                      <span className="font-medium text-slate-200">
                        {item.count} {item.count === 1 ? 'buyer' : 'buyers'}
                      </span>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey="quantity" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

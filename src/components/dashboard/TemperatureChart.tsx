import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card';
import { DrugHistory } from '@/types/drug';
import { format } from 'date-fns';
import { TEMPERATURE_THRESHOLDS } from '@/lib/constants';

interface TemperatureChartProps {
  history: DrugHistory[];
}

interface ChartDataPoint {
  timestamp: number;
  temperature: number;
  timeLabel: string;
  isViolation: boolean;
}

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ history }) => {
  const chartData = useMemo<ChartDataPoint[]>(() => {
    // Filter only temperature update events
    const tempEvents = history
      .filter(
        (event) => event.eventType === 'TEMPERATURE_UPDATED' && event.temperature !== undefined
      )
      .map((event) => ({
        timestamp: event.timestamp,
        temperature: event.temperature!,
        timeLabel: format(new Date(event.timestamp), 'HH:mm'),
        isViolation:
          event.temperature! < TEMPERATURE_THRESHOLDS.MIN ||
          event.temperature! > TEMPERATURE_THRESHOLDS.MAX,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);

    return tempEvents;
  }, [history]);

  const hasViolations = useMemo(() => {
    return chartData.some((point) => point.isViolation);
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <Card className="bg-white border border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-900">Temperature History</CardTitle>
          <CardDescription className="text-slate-600">Cold chain monitoring data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-slate-500">
            No temperature data available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white border border-slate-200">
      <CardHeader>
        <CardTitle className="text-slate-900">Temperature History</CardTitle>
        <CardDescription className="text-slate-600">
          Cold chain monitoring - Safe range: {TEMPERATURE_THRESHOLDS.MIN}°C to{' '}
          {TEMPERATURE_THRESHOLDS.MAX}°C
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="timeLabel" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis
              label={{
                value: 'Temperature (°C)',
                angle: -90,
                position: 'insideLeft',
                fill: '#64748b',
              }}
              domain={[0, 12]}
              tick={{ fill: '#64748b', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                color: '#0f172a',
              }}
              formatter={(value: number) => [`${value}°C`, 'Temperature']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Legend />
            {/* Reference lines for safe temperature range */}
            <ReferenceLine
              y={TEMPERATURE_THRESHOLDS.MAX}
              stroke="#10b981"
              strokeDasharray="5 5"
              label={{ value: 'Max Safe (8°C)', position: 'topRight' }}
            />
            <ReferenceLine
              y={TEMPERATURE_THRESHOLDS.MIN}
              stroke="#10b981"
              strokeDasharray="5 5"
              label={{ value: 'Min Safe (2°C)', position: 'bottomRight' }}
            />
            {/* Temperature line - red if violations, green otherwise */}
            <Line
              type="monotone"
              dataKey="temperature"
              stroke={hasViolations ? '#ef4444' : '#10b981'}
              strokeWidth={2}
              dot={{ fill: hasViolations ? '#ef4444' : '#10b981', r: 4 }}
              activeDot={{ r: 6 }}
              name="Temperature"
            />
          </LineChart>
        </ResponsiveContainer>
        {hasViolations && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-900">
              ⚠️ Temperature violations detected. Product may have been exposed to unsafe
              conditions.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

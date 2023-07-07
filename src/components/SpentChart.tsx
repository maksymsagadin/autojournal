import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, AreaChart, Area, ResponsiveContainer } from 'recharts'
import { JournalEntry } from '@/utils/types'
import { Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'

interface SpentChartProps {
    journalEntries: JournalEntry[]
}

const COLORS = ['#00befe', '#00C49F', '#FFBB28', '#192cff']

const SpentChart: React.FC<SpentChartProps> = ({ journalEntries }) => {
    const [chartType, setChartType] = useState('BarChart')

    const chartData = journalEntries.reduce((total, entry) => {
        const existingService = total.find(item => item.name === entry.service)
        if (existingService) {
            existingService.amount += Number(entry.spent)
        } else {
            total.push({ name: entry.service, amount: Number(entry.spent) })
        }
        return total
    }, [] as { name: string, amount: number }[])
    // Calculate the total spent across all services & add to chartData
    const totalSpent = chartData.reduce((total, item) => total + item.amount, 0)
    chartData.push({ name: 'Total', amount: totalSpent })

    const handleChange = (event: SelectChangeEvent<string>) => {
        setChartType(event.target.value as string)
    }

    return (
        <>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="chart-type-label">Chart Type</InputLabel>
                <Select
                    labelId="chart-type-label"
                    id="chart-type"
                    value={chartType}
                    onChange={handleChange}
                    label="Chart Type"
                    >
                    <MenuItem value={'BarChart'}>Bar Chart</MenuItem>
                    <MenuItem value={'PieChart'}>Pie Chart</MenuItem>
                    <MenuItem value={'AreaChart'}>Area Chart</MenuItem>
                </Select>
            </FormControl>
            <Box display='flex' justifyContent='center'>
                {chartType === 'BarChart' && (
                    <ResponsiveContainer width="95%" height={400}>
                        <BarChart width={500} height={300} data={chartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <CartesianGrid stroke="#f5f5f5" />
                            <Bar dataKey="amount">
                                {chartData.map((entry, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
                {chartType === 'PieChart' && (
                    <ResponsiveContainer width="95%" height={400}>
                        <PieChart width={400} height={400}>
                            <Pie dataKey="amount" isAnimationActive={false} data={chartData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                )}
                {chartType === 'AreaChart' && (
                    <ResponsiveContainer width="95%" height={400}>
                        <AreaChart width={500} height={400} data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="amount" stroke="#8884d8" fill="#8884d8" />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </Box>
        </>
    )
}

export default SpentChart
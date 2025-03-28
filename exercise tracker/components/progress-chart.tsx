"use client"

import { useEffect, useState } from "react"
import { useExerciseStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format, subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns"

export default function ProgressChart() {
  const exercises = useExerciseStore((state) => state.exercises)
  const [timeRange, setTimeRange] = useState("week")
  const [chartData, setChartData] = useState<{ date: string; duration: number }[]>([])

  useEffect(() => {
    if (exercises.length === 0) return

    const today = new Date()
    let startDate: Date

    switch (timeRange) {
      case "week":
        startDate = subDays(today, 7)
        break
      case "month":
        startDate = subDays(today, 30)
        break
      case "year":
        startDate = subDays(today, 365)
        break
      default:
        startDate = subDays(today, 7)
    }

    // Group exercises by date and sum durations
    const dateMap = new Map<string, number>()

    exercises.forEach((exercise) => {
      const exerciseDate = new Date(exercise.date)

      if (
        isWithinInterval(exerciseDate, {
          start: startOfDay(startDate),
          end: endOfDay(today),
        })
      ) {
        const dateKey = format(exerciseDate, "MMM d")
        const currentDuration = dateMap.get(dateKey) || 0
        dateMap.set(dateKey, currentDuration + exercise.duration)
      }
    })

    // Convert map to array for chart
    const data = Array.from(dateMap, ([date, duration]) => ({ date, duration }))
    setChartData(data.sort((a, b) => a.date.localeCompare(b.date)))
  }, [exercises, timeRange])

  // Calculate stats
  const totalDuration = exercises.reduce((sum, ex) => sum + ex.duration, 0)
  const totalWorkouts = exercises.length
  const averageDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0

  // Find max value for scaling the chart
  const maxDuration = Math.max(...chartData.map((d) => d.duration), 1)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your exercise activity over time</CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] mt-2 sm:mt-0">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last 365 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{totalWorkouts}</div>
              <p className="text-xs text-muted-foreground">Total Workouts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{totalDuration} min</div>
              <p className="text-xs text-muted-foreground">Total Duration</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{averageDuration} min</div>
              <p className="text-xs text-muted-foreground">Avg. Duration</p>
            </CardContent>
          </Card>
        </div>

        {chartData.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No exercise data available for the selected time period
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <div className="flex h-full items-end space-x-2">
              {chartData.map((item, index) => (
                <div key={index} className="relative flex h-full w-full flex-col justify-end">
                  <div
                    className="bg-primary rounded-md w-full animate-in"
                    style={{
                      height: `${(item.duration / maxDuration) * 100}%`,
                      minHeight: "4px",
                    }}
                  />
                  <span className="mt-2 text-xs text-center font-medium">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


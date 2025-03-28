"use client"

import { useEffect, useState } from "react"
import {
  Search,
  MapPin,
  Droplets,
  Wind,
  Thermometer,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  Sun,
  Moon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

interface WeatherData {
  location: string
  temperature: number
  description: string
  icon: string
  humidity: number
  windSpeed: number
  feelsLike: number
  hourlyForecast: HourlyForecast[]
  alerts: WeatherAlert[]
  historicalData: HistoricalData[]
}

interface HourlyForecast {
  time: string
  temperature: number
  icon: string
  precipitation: number
}

interface WeatherAlert {
  id: string
  type: string
  severity: "low" | "medium" | "high"
  title: string
  description: string
}

interface HistoricalData {
  date: string
  avgTemp: number
  minTemp: number
  maxTemp: number
  description: string
}

export default function WeatherApp() {
  const [location, setLocation] = useState("")
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [activeTab, setActiveTab] = useState("current")

  const fetchWeather = async () => {
    if (!location.trim()) return

    setLoading(true)
    setError(null)

    try {
      // In a real app, you would fetch from a weather API
      // For demo purposes, we're simulating a response
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generate hourly forecast data
      const hourlyForecast = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date()
        hour.setHours(hour.getHours() + i)
        return {
          time: hour.getHours() + ":00",
          temperature: Math.floor(Math.random() * 10) + 15, // 15-25°C
          icon: ["sun", "cloud", "cloud-rain", "cloud-sun"][Math.floor(Math.random() * 4)],
          precipitation: Math.floor(Math.random() * 30),
        }
      })

      // Generate alerts
      const hasAlerts = Math.random() > 0.5
      const alerts: WeatherAlert[] = hasAlerts
        ? [
            {
              id: "alert-1",
              type: "weather",
              severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
              title: ["Heavy Rain Warning", "Strong Wind Advisory", "Heat Wave Alert"][Math.floor(Math.random() * 3)],
              description: "This alert is active for your current location. Take necessary precautions.",
            },
          ]
        : []

      // Generate historical data
      const historicalData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (i + 1))
        const avgTemp = Math.floor(Math.random() * 10) + 15
        return {
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          avgTemp,
          minTemp: avgTemp - Math.floor(Math.random() * 5),
          maxTemp: avgTemp + Math.floor(Math.random() * 5),
          description: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
        }
      })

      // Mock weather data
      const mockWeather: WeatherData = {
        location: location,
        temperature: Math.floor(Math.random() * 30) + 5, // 5-35°C
        description: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
        icon: ["sun", "cloud", "cloud-rain", "cloud-sun"][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 60) + 30, // 30-90%
        windSpeed: Math.floor(Math.random() * 30) + 5, // 5-35 km/h
        feelsLike: Math.floor(Math.random() * 30) + 5, // 5-35°C
        hourlyForecast,
        alerts,
        historicalData,
      }

      setWeather(mockWeather)
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (iconName: string, size: "sm" | "md" | "lg" = "lg") => {
    const sizeMap = {
      sm: "w-6 h-6",
      md: "w-10 h-10",
      lg: "w-20 h-20",
    }

    switch (iconName) {
      case "sun":
        return (
          <div className={`${sizeMap[size]} text-amber-500`}>
            <Thermometer className="w-full h-full" />
          </div>
        )
      case "cloud":
        return (
          <div className={`${sizeMap[size]} text-sky-700`}>
            <Droplets className="w-full h-full" />
          </div>
        )
      case "cloud-rain":
        return (
          <div className={`${sizeMap[size]} text-blue-600`}>
            <Droplets className="w-full h-full" />
          </div>
        )
      case "cloud-sun":
        return (
          <div className={`${sizeMap[size]} text-orange-400`}>
            <Thermometer className="w-full h-full" />
          </div>
        )
      default:
        return (
          <div className={`${sizeMap[size]} text-amber-500`}>
            <Thermometer className="w-full h-full" />
          </div>
        )
    }
  }

  const getSeverityColor = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case "low":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Scroll controls for hourly forecast
  const scrollHourly = (direction: "left" | "right") => {
    const container = document.getElementById("hourly-forecast")
    if (container) {
      const scrollAmount = 200
      if (direction === "left") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  // Theme toggling
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const savedTheme = localStorage.getItem("weather-theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("weather-theme", newTheme)
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24 bg-gradient-to-b from-sky-100 to-blue-100 dark:from-slate-900 dark:to-blue-950 weather-pattern relative">
      <div className="floating-clouds">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
        <div className="cloud cloud-3"></div>
      </div>
      <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-500 dark:from-blue-400 dark:to-violet-300">
        Weather App
      </h1>
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="absolute top-4 right-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm"
      >
        {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>

      <div className="w-full max-w-3xl mb-8">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          />
          <Button onClick={fetchWeather}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>

      {loading ? (
        <Card className="w-full max-w-3xl backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border-0 shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-20 w-20 rounded-full" />
              <Skeleton className="h-16 w-24" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : weather ? (
        <div className="w-full max-w-3xl">
          <Tabs defaultValue="current" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="hourly">Hourly Forecast</TabsTrigger>
              <TabsTrigger value="historical">Historical Data</TabsTrigger>
            </TabsList>

            <TabsContent value="current">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-5 w-5" />
                    {weather.location}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <div className="flex justify-between items-center mb-6">
                    <div className="p-4 rounded-full bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900 dark:to-blue-800 shadow-inner">
                      {getWeatherIcon(weather.icon)}
                    </div>
                    <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">{weather.temperature}°C</div>
                  </div>

                  <p className="text-xl mb-4 font-medium text-slate-700 dark:text-slate-300">{weather.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-gradient-to-r from-white/60 to-blue-50/60 dark:from-slate-800/60 dark:to-blue-900/60 backdrop-blur-sm">
                    <div className="flex items-center">
                      <Thermometer className="mr-2 h-5 w-5 text-rose-500 dark:text-rose-400" />
                      <span>Feels like: {weather.feelsLike}°C</span>
                    </div>
                    <div className="flex items-center">
                      <Droplets className="mr-2 h-5 w-5 text-blue-500 dark:text-blue-400" />
                      <span>Humidity: {weather.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="mr-2 h-5 w-5 text-teal-500 dark:text-teal-400" />
                      <span>Wind: {weather.windSpeed} km/h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location-based Alerts */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">Weather Alerts</h2>
                  <div className="flex items-center">
                    <span className="mr-2 text-sm text-muted-foreground">
                      {alertsEnabled ? "Alerts enabled" : "Alerts disabled"}
                    </span>
                    <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} aria-label="Toggle alerts" />
                  </div>
                </div>

                {alertsEnabled && weather.alerts.length > 0 ? (
                  <div className="space-y-3">
                    {weather.alerts.map((alert) => (
                      <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle className="flex items-center">
                          {alert.title}
                          <Badge variant="outline" className="ml-2">
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </AlertTitle>
                        <AlertDescription>{alert.description}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                ) : alertsEnabled ? (
                  <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border-0 shadow-lg">
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">No active alerts for this location</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border-0 shadow-lg">
                    <CardContent className="pt-6">
                      <p className="text-center text-muted-foreground">Enable alerts to see weather warnings</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Hourly Forecast Tab */}
            <TabsContent value="hourly">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Hourly Forecast</CardTitle>
                  <CardDescription>24-hour weather prediction for {weather.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
                      onClick={() => scrollHourly("left")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    <div
                      id="hourly-forecast"
                      className="flex overflow-x-auto py-4 px-8 gap-4 scrollbar-hide rounded-lg bg-gradient-to-r from-blue-50/50 to-sky-50/50 dark:from-slate-800/50 dark:to-blue-900/50"
                      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                      {weather.hourlyForecast.map((hour, index) => (
                        <div key={index} className="flex-shrink-0 w-20 text-center">
                          <p className="text-sm font-medium">{hour.time}</p>
                          {getWeatherIcon(hour.icon, "md")}
                          <p className="text-lg font-bold">{hour.temperature}°</p>
                          <p className="text-xs text-muted-foreground">{hour.precipitation}% precip</p>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
                      onClick={() => scrollHourly("right")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Historical Data Tab */}
            <TabsContent value="historical">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-slate-800/90 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Historical Weather</CardTitle>
                  <CardDescription>Past 7 days weather data for {weather.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Temperature Chart */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-2">Temperature Trends</h3>
                    <div className="h-40 relative">
                      <div className="absolute inset-0 flex items-end">
                        {weather.historicalData.map((day, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center">
                            <div className="relative w-full flex justify-center">
                              <div
                                className="w-4/5 bg-gradient-to-t from-blue-200 to-sky-100 dark:from-blue-800 dark:to-sky-700 rounded-t-sm"
                                style={{
                                  height: `${(day.maxTemp - day.minTemp) * 4}px`,
                                  marginBottom: `${day.minTemp * 2}px`,
                                }}
                              >
                                <div
                                  className="absolute w-full h-1 bg-blue-500 dark:bg-blue-400"
                                  style={{ bottom: `${(day.avgTemp - day.minTemp) * 4}px` }}
                                />
                              </div>
                            </div>
                            <div className="text-xs mt-1">{day.date}</div>
                          </div>
                        ))}
                      </div>

                      {/* Y-axis labels */}
                      <div className="absolute left-0 inset-y-0 flex flex-col justify-between pointer-events-none">
                        <span className="text-xs text-muted-foreground">30°C</span>
                        <span className="text-xs text-muted-foreground">20°C</span>
                        <span className="text-xs text-muted-foreground">10°C</span>
                        <span className="text-xs text-muted-foreground">0°C</span>
                      </div>
                    </div>
                  </div>

                  {/* Historical Data Table */}
                  <div className="border rounded-md">
                    <div className="grid grid-cols-4 gap-4 p-3 border-b bg-muted/50 font-medium text-sm">
                      <div>Date</div>
                      <div>Avg Temp</div>
                      <div>Min/Max</div>
                      <div>Conditions</div>
                    </div>
                    {weather.historicalData.map((day, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 p-3 border-b last:border-0 text-sm">
                        <div>{day.date}</div>
                        <div>{day.avgTemp}°C</div>
                        <div>
                          {day.minTemp}° / {day.maxTemp}°
                        </div>
                        <div>{day.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="text-center text-muted-foreground">Enter a location to see the weather</div>
      )}
    </main>
  )
}


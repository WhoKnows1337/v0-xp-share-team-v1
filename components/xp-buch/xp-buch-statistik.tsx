"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts"

// Mock-Daten für die Statistiken
const mockMonthlyData = [
  { name: "Jan", einträge: 4, öffentlich: 2, privat: 2 },
  { name: "Feb", einträge: 6, öffentlich: 3, privat: 3 },
  { name: "Mär", einträge: 5, öffentlich: 2, privat: 3 },
  { name: "Apr", einträge: 8, öffentlich: 5, privat: 3 },
  { name: "Mai", einträge: 10, öffentlich: 6, privat: 4 },
  { name: "Jun", einträge: 7, öffentlich: 4, privat: 3 },
  { name: "Jul", einträge: 9, öffentlich: 5, privat: 4 },
  { name: "Aug", einträge: 12, öffentlich: 8, privat: 4 },
  { name: "Sep", einträge: 8, öffentlich: 5, privat: 3 },
  { name: "Okt", einträge: 6, öffentlich: 3, privat: 3 },
  { name: "Nov", einträge: 9, öffentlich: 6, privat: 3 },
  { name: "Dez", einträge: 11, öffentlich: 7, privat: 4 },
]

const mockCategoryData = [
  { name: "Natur", value: 25 },
  { name: "Persönliches Wachstum", value: 18 },
  { name: "Reisen", value: 15 },
  { name: "Spirituell", value: 12 },
  { name: "Beruflich", value: 10 },
  { name: "Kulinarisch", value: 8 },
  { name: "Sonstiges", value: 12 },
]

const mockMoodData = [
  { name: "Jan", glücklich: 3, neutral: 1, nachdenklich: 0, traurig: 0 },
  { name: "Feb", glücklich: 2, neutral: 2, nachdenklich: 1, traurig: 1 },
  { name: "Mär", glücklich: 1, neutral: 2, nachdenklich: 2, traurig: 0 },
  { name: "Apr", glücklich: 4, neutral: 2, nachdenklich: 1, traurig: 1 },
  { name: "Mai", glücklich: 5, neutral: 3, nachdenklich: 1, traurig: 1 },
  { name: "Jun", glücklich: 3, neutral: 2, nachdenklich: 2, traurig: 0 },
  { name: "Jul", glücklich: 4, neutral: 3, nachdenklich: 1, traurig: 1 },
  { name: "Aug", glücklich: 6, neutral: 4, nachdenklich: 1, traurig: 1 },
  { name: "Sep", glücklich: 4, neutral: 2, nachdenklich: 1, traurig: 1 },
  { name: "Okt", glücklich: 2, neutral: 2, nachdenklich: 1, traurig: 1 },
  { name: "Nov", glücklich: 5, neutral: 2, nachdenklich: 1, traurig: 1 },
  { name: "Dez", glücklich: 6, neutral: 3, nachdenklich: 1, traurig: 1 },
]

const mockTagData = [
  { name: "Natur", count: 25 },
  { name: "Meditation", count: 18 },
  { name: "Reisen", count: 15 },
  { name: "Wandern", count: 12 },
  { name: "Karriere", count: 10 },
  { name: "Kochen", count: 8 },
  { name: "Familie", count: 12 },
  { name: "Freunde", count: 14 },
  { name: "Musik", count: 7 },
  { name: "Sport", count: 9 },
]

const mockStreakData = [
  { name: "Mo", streak: 1 },
  { name: "Di", streak: 2 },
  { name: "Mi", streak: 3 },
  { name: "Do", streak: 4 },
  { name: "Fr", streak: 5 },
  { name: "Sa", streak: 6 },
  { name: "So", streak: 7 },
  { name: "Mo", streak: 8 },
  { name: "Di", streak: 9 },
  { name: "Mi", streak: 10 },
  { name: "Do", streak: 0 },
  { name: "Fr", streak: 1 },
  { name: "Sa", streak: 2 },
  { name: "So", streak: 3 },
  { name: "Mo", streak: 4 },
  { name: "Di", streak: 5 },
  { name: "Mi", streak: 6 },
  { name: "Do", streak: 7 },
  { name: "Fr", streak: 8 },
  { name: "Sa", streak: 9 },
  { name: "So", streak: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FCCDE5"]

export function XPBuchStatistik() {
  const [timeRange, setTimeRange] = useState("jahr")

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Einträge Übersicht</CardTitle>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Zeitraum wählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monat">Letzter Monat</SelectItem>
                <SelectItem value="quartal">Letztes Quartal</SelectItem>
                <SelectItem value="jahr">Letztes Jahr</SelectItem>
                <SelectItem value="gesamt">Gesamter Zeitraum</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardDescription>Anzahl der Einträge über Zeit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="öffentlich" stackId="a" fill="#8884d8" name="Öffentlich" />
                <Bar dataKey="privat" stackId="a" fill="#82ca9d" name="Privat" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kategorien</CardTitle>
          <CardDescription>Verteilung der Einträge nach Kategorien</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {mockCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Einträge`, "Anzahl"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stimmungsverlauf</CardTitle>
          <CardDescription>Entwicklung deiner Stimmung über Zeit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockMoodData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="glücklich" stroke="#8884d8" name="Glücklich" />
                <Line type="monotone" dataKey="neutral" stroke="#82ca9d" name="Neutral" />
                <Line type="monotone" dataKey="nachdenklich" stroke="#ffc658" name="Nachdenklich" />
                <Line type="monotone" dataKey="traurig" stroke="#ff8042" name="Traurig" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Streak-Verlauf</CardTitle>
          <CardDescription>Deine tägliche Eintrags-Streak der letzten 3 Wochen</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockStreakData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="streak"
                  stroke="#8884d8"
                  name="Streak"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Häufigste Tags</CardTitle>
          <CardDescription>Deine am häufigsten verwendeten Tags</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {mockTagData.map((tag) => (
              <Badge key={tag.name} variant="secondary" className="text-sm py-1 px-3">
                {tag.name} ({tag.count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronRight, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type AISearchAndDisplayProps = {
  onSearch: (query: string) => Promise<any>
}

export function AiSearchAndDisplay({ onSearch }: AISearchAndDisplayProps) {
  const [query, setQuery] = useState("")
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const handleSearch = async () => {
    if (query.trim()) {
      setLoading(true)
      setError(null)
      try {
        const result = await onSearch(query)
        setData(result)
      } catch (err) {
        setError("An error occurred while fetching data. Please try again.")
        setData(null)
      } finally {
        setLoading(false)
      }
    }
  }

  const toggleExpand = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const renderValue = (value: any, depth = 0): JSX.Element => {
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="pl-4">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="my-1">
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-auto font-normal"
                onClick={() => toggleExpand(key)}
              >
                {expanded[key] ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                <span className="font-semibold">{key}:</span>
              </Button>
              {expanded[key] && renderValue(val, depth + 1)}
            </div>
          ))}
        </div>
      )
    } else {
      return <span className="ml-2">{JSON.stringify(value)}</span>
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>AI Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your search query"
            className="flex-grow"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
          </Button>
        </div>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {data && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Search Results:</h3>
            {renderValue(data)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
"use client" // Error boundaries must be Client Components

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect } from "react"
import { AlertCircle } from "lucide-react"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <html>
            <body className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-center p-4">
                <div className="rounded-lg bg-white p-8 shadow-xl border border-gray-100 max-w-md w-full">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-red-600" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-900">Something went wrong!</h2>
                    <p className="text-gray-600 mb-6">
                        We apologize for the inconvenience. A critical error occurred.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Button onClick={() => reset()} variant="default">
                            Try again
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                </div>
            </body>
        </html>
    )
}

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 p-4">
            <div className="text-center max-w-md">
                <h1 className="text-9xl font-extrabold text-orange-600 tracking-widest">404</h1>
                <div className="bg-orange-100 px-2 text-sm rounded rotate-12 absolute">
                    Page Not Found
                </div>
                <div className="mt-8 mb-8">
                    <h3 className="text-2xl font-bold md:text-3xl text-gray-900">Oops!</h3>
                    <p className="text-gray-600 mt-2">
                        The page you are looking for might have been removed, had its name changed or is temporarily unavailable.
                    </p>
                </div>

                <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
                    <Link href="/">
                        Go to Homepage
                    </Link>
                </Button>
            </div>
        </div>
    )
}

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProfileForm } from '@/components/profile/profile-form'

export default function ProfilePage() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-24">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold font-headline">My Profile</h1>
                        <p className="text-muted-foreground mt-2">
                            Update your personal information.
                        </p>
                    </div>

                    <ProfileForm />
                </div>
            </main>
            <Footer />
        </div>
    )
}

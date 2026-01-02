"use client"

import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { updateUser } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { User } from '@/lib/types';

export function ProfileForm() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
    const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsLoading(true);
        try {
            await updateUser(user.id, {
                name,
                phone,
                avatarUrl
            });

            toast({
                title: "Profile updated",
                description: "Your changes have been saved successfully.",
            });
            // Ideally revalidate auth here, but for now simple update
        } catch (error) {
            console.error(error);
            toast({
                title: "Error",
                description: "Failed to update profile.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-muted/20">
            <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="flex flex-col items-center gap-4">
                        <Avatar className="h-24 w-24 border-4 border-muted/50">
                            <AvatarImage src={avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`} />
                            <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>

                        <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" className="w-full">
                                    Change Avatar
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Update Profile Picture</DialogTitle>
                                    <DialogDescription>
                                        Enter a URL for your new profile picture.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-center">
                                            <Avatar className="h-24 w-24 border-2 border-muted">
                                                <AvatarImage src={avatarUrl} />
                                                <AvatarFallback><ImageIcon className="h-8 w-8 text-muted-foreground" /></AvatarFallback>
                                            </Avatar>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="avatar-url">Image URL</Label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    id="avatar-url"
                                                    value={avatarUrl}
                                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                                    className="pl-9"
                                                    placeholder="https://example.com/my-photo.jpg"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => setIsAvatarDialogOpen(false)}>Done</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <form id="profile-form" onSubmit={handleSubmit} className="flex-1 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={user.email} disabled className="bg-muted/50" />
                            <p className="text-[0.8rem] text-muted-foreground">
                                Your email address is managed by your provider.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Account Type</Label>
                            <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted/50 text-sm text-muted-foreground capitalize">
                                {user.role} Account
                            </div>
                        </div>
                    </form>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t bg-muted/5 p-6">
                <Button type="submit" form="profile-form" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}

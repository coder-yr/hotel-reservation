"use client"

import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Smartphone, ShieldCheck, Loader2, CheckCircle2 } from "lucide-react"
import { formatINR } from "@/lib/utils"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    amount: number
    onSuccess: () => void
}

export function PaymentGateway({ open, onOpenChange, amount, onSuccess }: Props) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // Reset state on open
    useEffect(() => {
        if (open) {
            setLoading(false)
            setSuccess(false)
        }
    }, [open])

    const handlePay = async () => {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setLoading(false)
        setSuccess(true)
        // Wait a bit to show success message before closing/proceeding
        setTimeout(() => {
            onSuccess()
        }, 1500)
    }

    return (
        <Dialog open={open} onOpenChange={loading || success ? undefined : onOpenChange}>
            <DialogContent className="sm:max-w-[425px] p-0 gap-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2 bg-slate-50 border-b">
                    <DialogTitle className="flex items-center justify-between">
                        <span>Secure Payment</span>
                        <div className="flex items-center text-xs font-normal text-green-600 bg-green-100 px-2 py-1 rounded-full">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            256-bit SSL Encrypted
                        </div>
                    </DialogTitle>
                    <div className="mt-4">
                        <p className="text-sm text-slate-500">Total Amount</p>
                        <p className="text-3xl font-bold text-slate-900">{formatINR(amount)}</p>
                    </div>
                </DialogHeader>

                <div className="p-6">
                    {success ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center animate-in zoom-in-95">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Successful!</h3>
                            <p className="text-slate-500">Your transaction has been processed.</p>
                            <p className="text-xs text-slate-400 mt-4">Redirecting...</p>
                        </div>
                    ) : (
                        <Tabs defaultValue="card" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="card">Card</TabsTrigger>
                                <TabsTrigger value="upi">UPI / QR</TabsTrigger>
                            </TabsList>

                            <TabsContent value="card" className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Card Number</Label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input placeholder="0000 0000 0000 0000" className="pl-9 font-mono" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Expiry</Label>
                                        <Input placeholder="MM/YY" className="font-mono" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>CVV</Label>
                                        <Input placeholder="123" type="password" className="font-mono" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Cardholder Name</Label>
                                    <Input placeholder="John Doe" />
                                </div>
                            </TabsContent>

                            <TabsContent value="upi" className="space-y-6">
                                <div className="text-center py-4 border-2 border-dashed rounded-xl bg-slate-50">
                                    <div className="w-48 h-48 bg-white mx-auto mb-2 p-2 rounded-lg shadow-sm">
                                        {/* Placeholder QR */}
                                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=demo@upi&pn=LodgifyLite&am=${amount}`} alt="Payment QR" className="w-full h-full" />
                                    </div>
                                    <p className="text-xs text-slate-500">Scan with any UPI App</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-white px-2 text-slate-500">Or enter VPA</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Smartphone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input placeholder="username@upi" className="pl-9" />
                                    </div>
                                    <Button variant="outline">Verify</Button>
                                </div>
                            </TabsContent>

                            <div className="mt-8">
                                <Button className="w-full h-12 text-lg font-bold bg-slate-900 hover:bg-slate-800" onClick={handlePay} disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                                        </>
                                    ) : (
                                        `Pay ${formatINR(amount)}`
                                    )}
                                </Button>
                                <div className="flex justify-center gap-2 mt-4 opacity-50 grayscale">
                                    {/* Just some icons for visual trust */}
                                    <img src="https://img.icons8.com/color/48/visa.png" className="h-6" alt="Visa" />
                                    <img src="https://img.icons8.com/color/48/mastercard.png" className="h-6" alt="Mastercard" />
                                    <img src="https://img.icons8.com/color/48/google-pay.png" className="h-6" alt="GPay" />
                                </div>
                            </div>
                        </Tabs>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

import React, { useState } from 'react';
import { UploadCloud, FileCheck, X, ShieldCheck, FileText } from 'lucide-react';
import { HotelFormData } from '../types';

interface Step4Props {
    data: HotelFormData;
    updateData: (data: Partial<HotelFormData>) => void;
}

const DocUploader = ({ label, description, isUploaded, onUpload, onDelete }: any) => {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = () => {
        setIsUploading(true);
        setTimeout(() => {
            setIsUploading(false);
            onUpload();
        }, 1500);
    };

    return (
        <div className="p-6 border border-slate-200 rounded-2xl bg-white hover:border-emerald-200 transition-colors">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        {label}
                        {isUploaded && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">{description}</p>
                </div>
            </div>

            {!isUploaded ? (
                <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all group"
                >
                    {isUploading ? (
                        <>
                            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm font-medium text-emerald-600">Uploading...</span>
                        </>
                    ) : (
                        <>
                            <div className="p-3 bg-slate-50 rounded-full group-hover:bg-emerald-100 transition-colors">
                                <UploadCloud className="w-6 h-6" />
                            </div>
                            <div className="text-center">
                                <span className="text-sm font-medium">Click to upload</span>
                                <p className="text-xs text-slate-400 mt-1">PDF, JPG or PNG (max 5MB)</p>
                            </div>
                        </>
                    )}
                </button>
            ) : (
                <div className="w-full p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600">
                            <FileCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">document_scan.pdf</p>
                            <p className="text-xs text-emerald-600">Uploaded successfully</p>
                        </div>
                    </div>
                    <button
                        onClick={onDelete}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    );
};

export function Step4_Documents({ data, updateData }: Step4Props) {
    const [docs, setDocs] = useState<Record<string, boolean>>({
        license: false,
        tax: false,
        insurance: false
    });

    const toggleDoc = (key: string, status: boolean) => {
        setDocs(prev => ({ ...prev, [key]: status }));
        // In a real app, updateData would store actual file references
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
                <h3 className="text-xl font-bold text-slate-900">Verification Documents</h3>
                <p className="text-slate-500 mt-2">To verify your property, please provide the following legal documents</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DocUploader
                    label="Business License"
                    description="Valid operating license for your region"
                    isUploaded={docs.license}
                    onUpload={() => toggleDoc('license', true)}
                    onDelete={() => toggleDoc('license', false)}
                />

                <DocUploader
                    label="Tax Identification"
                    description="Government issued Tax ID or VAT certificate"
                    isUploaded={docs.tax}
                    onUpload={() => toggleDoc('tax', true)}
                    onDelete={() => toggleDoc('tax', false)}
                />

                <DocUploader
                    label="Insurance Policy"
                    description="Liability insurance coverage proof"
                    isUploaded={docs.insurance}
                    onUpload={() => toggleDoc('insurance', true)}
                    onDelete={() => toggleDoc('insurance', false)}
                />

                <div className="p-6 border border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4 text-slate-900 font-semibold">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <span>Why do we need this?</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed mb-4">
                        We require these documents to ensure all properties on our platform are legitimate and legally compliant.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium cursor-pointer hover:underline">
                        <FileText className="w-4 h-4" />
                        Read our verification policy
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm flex gap-3">
                <div className="shrink-0 mt-0.5">⚠️</div>
                <p>Please ensure all documents are clear and legible. Blurred or expired documents will delay your application process.</p>
            </div>
        </div>
    );
}

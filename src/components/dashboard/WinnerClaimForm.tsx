'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Button from '@/components/ui/Button';
import { Upload, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react';
import Badge from '@/components/ui/Badge';

export default function WinnerClaimForm({ winnerId }: { winnerId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClient();

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${winnerId}/${Math.random()}.${fileExt}`;
      const filePath = `proofs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('winner-proofs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('winner-proofs')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('winners')
        .update({ proof_image_url: publicUrl, verification_status: 'pending' })
        .eq('id', winnerId);

      if (updateError) throw updateError;

      setIsSuccess(true);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="glass p-8 text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
        <h4 className="text-xl font-bold uppercase italic">Verification Pending</h4>
        <p className="text-slate-500 text-sm">Your performance protocol has been uploaded and is currently being audited by the platform.</p>
      </div>
    );
  }

  return (
    <div className="glass p-8 space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h4 className="text-lg font-bold uppercase italic">Verification Protocol</h4>
          <p className="text-xs text-slate-500 uppercase tracking-widest">Required for Payout Authorization</p>
        </div>
      </div>

      <div className="border-2 border-dashed border-white/5 rounded-2xl p-10 text-center hover:border-primary/40 transition-colors group cursor-pointer relative overflow-hidden">
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        {file ? (
          <div className="space-y-2">
            <p className="text-primary font-bold">{file.name}</p>
            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-8 h-8 text-slate-500 mx-auto group-hover:text-primary group-hover:scale-110 transition-all" />
            <p className="text-sm text-slate-400 font-medium">Upload Scorecard Proof</p>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest">JPG, PNG up to 10MB</p>
          </div>
        )}
      </div>

      <Button 
        onClick={handleUpload} 
        disabled={!file || isUploading} 
        className="w-full h-14 uppercase font-black italic tracking-widest"
      >
        {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authorize Protocol'}
      </Button>
    </div>
  );
}

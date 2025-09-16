import { notFound } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function DownloadPage({ params }: { params: { token: string } }) {
    const supabase = createSupabaseServer();
    
    
    const { data: download, error } = await supabase
        .from("downloads")
        .select(`
            *,
            orders!inner(
                *,
                packs!inner(title, slug)
            )
        `)
        .eq("token", params.token)
        .maybeSingle();

    if (error) {
        return notFound();
    }

    if (!download) {
        return notFound();
    }

    
    const now = new Date();
    const expiresAt = new Date(download.expires_at);
    
    if (now > expiresAt) {
        return (
            <main className="mx-auto max-w-2xl px-4 py-10">
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-semibold text-red-600">Download Expired</h1>
                    <p className="text-neutral-600">
                        This download link has expired. Please contact support if you need assistance.
                    </p>
                </div>
            </main>
        );
    }

    
    if (download.remaining <= 0) {
        return (
            <main className="mx-auto max-w-2xl px-4 py-10">
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-semibold text-yellow-600">Download Limit Reached</h1>
                    <p className="text-neutral-600">
                        You have used all your download attempts. Please contact support if you need assistance.
                    </p>
                </div>
            </main>
        );
    }

    const pack = download.orders.packs;
    const order = download.orders;

    return (
        <>
            <main className="mx-auto max-w-2xl px-4 py-10">
                <div className="text-center space-y-6">
                    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    
                    <h1 className="text-3xl font-semibold">Download Ready</h1>
                    <p className="text-neutral-600">
                        Your <strong>{pack.title}</strong> pack is ready for download.
                    </p>

                    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                        <div className="text-sm text-gray-600 space-y-2">
                            <p><strong>Order:</strong> {order.id.slice(0, 8)}...</p>
                            <p><strong>Email:</strong> {order.email}</p>
                            <p><strong>Remaining downloads:</strong> {download.remaining}</p>
                            <p><strong>Expires:</strong> {expiresAt.toLocaleDateString()}</p>
                        </div>
                        
                        <form id="downloadForm" className="pt-4">
                            <input type="hidden" name="token" value={params.token} />
                            <button
                                type="submit"
                                className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                            >
                                Download {pack.title}
                            </button>
                        </form>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                        <p>• This download link expires in {Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} days</p>
                        <p>• You have {download.remaining} download attempts remaining</p>
                        <p>• Keep this page bookmarked for future downloads</p>
                    </div>
                </div>
            </main>
            
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        document.getElementById('downloadForm').addEventListener('submit', async function(e) {
                            e.preventDefault();
                            
                            const formData = new FormData(this);
                            const button = this.querySelector('button[type="submit"]');
                            const originalText = button.textContent;
                            
                            
                            button.textContent = 'Generating download...';
                            button.disabled = true;
                            
                            try {
                                const response = await fetch('/api/download', {
                                    method: 'POST',
                                    body: formData
                                });
                                
                                const data = await response.json();
                                
                                if (!response.ok) {
                                    throw new Error(data.error || 'Download failed');
                                }
                                
                                
                                const link = document.createElement('a');
                                link.href = data.downloadUrl;
                                link.download = '';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                
                                
                                button.textContent = 'Download Complete';
                                
                            } catch (error) {
                                button.textContent = 'Download Failed - Try Again';
                                button.disabled = false;
                                
                                
                                setTimeout(() => {
                                    button.textContent = originalText;
                                    button.disabled = false;
                                }, 3000);
                            }
                        });
                    `
                }}
            />
        </>
    );
}

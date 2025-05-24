'use client';

import { useState } from 'react';

export default function UploadPage() {
    const [urls, setUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setUploading(true);
        const uploadedUrls: string[] = [];

        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', "test123");

            const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await res.json();
            uploadedUrls.push(data.secure_url);
        }

        setUrls(uploadedUrls);
        setUploading(false);
    };

    const handleDownloadJson = () => {
        const json = JSON.stringify(
            urls.map((url) => ({ imageUrl: url })),
            null,
            2
        );
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'uploaded-images.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-4">Upload ảnh lên Cloudinary</h1>
            <input type="file" multiple onChange={handleUpload} className="mb-4" />
            {uploading && <p>⏳ Đang upload...</p>}
            {urls.length > 0 && (
                <div>
                    <h2 className="font-semibold mt-4 mb-2">Ảnh đã upload:</h2>
                    <ul className="mb-4">
                        {urls.map((url, i) => (
                            <li key={i}>
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                                    {url}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={handleDownloadJson}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Tải xuống JSON
                    </button>
                </div>
            )}
        </div>
    );
}

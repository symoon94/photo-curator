import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
    try {
        const { selectedImages, removedImage } = await request.json();
        
        // 파일 제거 요청인 경우
        if (removedImage) {
            const fileName = path.basename(removedImage);
            const filePath = path.join(process.cwd(), 'public', 'selected', fileName);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            return NextResponse.json({ success: true });
        }
        
        // 파일 추가 요청인 경우
        if (selectedImages && Array.isArray(selectedImages)) {
            for (const image of selectedImages) {
                const fileName = path.basename(image);
                const sourcePath = path.join(process.cwd(), 'public', 'images', fileName);
                const targetPath = path.join(process.cwd(), 'public', 'selected', fileName);

                if (!fs.existsSync(targetPath) && fs.existsSync(sourcePath)) {
                    fs.copyFileSync(sourcePath, targetPath);
                }
            }
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error handling selected images:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to process images' },
            { status: 500 }
        );
    }
} 
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
    try {
        const selectedDir = path.join(process.cwd(), 'public', 'selected');
        
        // 디렉토리가 존재하지 않으면 생성
        if (!fs.existsSync(selectedDir)) {
            fs.mkdirSync(selectedDir, { recursive: true });
            return NextResponse.json({ success: true, selectedImages: [] });
        }

        // 선택된 이미지 목록 가져오기
        const files = fs.readdirSync(selectedDir)
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
            })
            .map(file => `/selected/${file}`);

        return NextResponse.json({ success: true, selectedImages: files });
    } catch (error) {
        console.error('Error reading selected images:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to read selected images' },
            { status: 500 }
        );
    }
} 
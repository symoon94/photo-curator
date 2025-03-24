import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
    try {
        // public/images 디렉토리에서 이미지 파일들을 읽어옵니다
        const imagesDir = path.join(process.cwd(), 'public', 'images');
        const files = fs.readdirSync(imagesDir);
        
        // 이미지 파일만 필터링 (jpg, jpeg, png, gif 등)
        const imageFiles = files.filter(file => {
            const ext = path.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
        });

        // 이미지 경로 배열 생성 (/images/filename.jpg 형식)
        const imagePaths = imageFiles.map(file => `/images/${file}`);

        return NextResponse.json(imagePaths);
    } catch (error) {
        console.error('Error reading images directory:', error);
        return NextResponse.json([], { status: 500 });
    }
} 
import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

const ALLOWED_ROUNDS = new Set([16, 8, 4, 2, 1]);
const SAFE_FILENAME = /^[A-Za-z0-9._-]+$/;

export async function POST(request: Request) {
    try {
        const { round, images } = await request.json();

        if (
            typeof round !== 'number' ||
            !Number.isInteger(round) ||
            !ALLOWED_ROUNDS.has(round)
        ) {
            return NextResponse.json(
                { success: false, message: 'Invalid round' },
                { status: 400 }
            );
        }

        if (!Array.isArray(images) || images.length === 0) {
            return NextResponse.json(
                { success: false, message: 'Invalid images' },
                { status: 400 }
            );
        }

        const imagesRoot = path.join(process.cwd(), 'public', 'images');

        // public/images/<filename> 안의 안전한 파일명만 허용
        const resolvedSources: { source: string; filename: string }[] = [];
        for (const imagePath of images) {
            if (typeof imagePath !== 'string') {
                return NextResponse.json(
                    { success: false, message: 'Invalid image path' },
                    { status: 400 }
                );
            }
            if (!imagePath.startsWith('/images/')) {
                return NextResponse.json(
                    { success: false, message: 'Image path must start with /images/' },
                    { status: 400 }
                );
            }
            const filename = imagePath.slice('/images/'.length);
            if (!SAFE_FILENAME.test(filename)) {
                return NextResponse.json(
                    { success: false, message: 'Unsafe filename' },
                    { status: 400 }
                );
            }
            const sourcePath = path.join(imagesRoot, filename);
            // path.join 결과가 imagesRoot 밖으로 나가면 거부
            if (!sourcePath.startsWith(imagesRoot + path.sep)) {
                return NextResponse.json(
                    { success: false, message: 'Path traversal detected' },
                    { status: 400 }
                );
            }
            resolvedSources.push({ source: sourcePath, filename });
        }

        const folderName = round === 1 ? 'champion' : `round-${round}`;
        const targetDir = path.join(process.cwd(), 'public', folderName);

        if (fs.existsSync(targetDir)) {
            fs.rmSync(targetDir, { recursive: true, force: true });
        }
        fs.mkdirSync(targetDir, { recursive: true });

        const copied: string[] = [];
        for (const { source, filename } of resolvedSources) {
            if (fs.existsSync(source)) {
                fs.copyFileSync(source, path.join(targetDir, filename));
                copied.push(filename);
            }
        }

        return NextResponse.json({
            success: true,
            folder: folderName,
            count: copied.length,
        });
    } catch (error) {
        console.error('Error saving round:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to save round' },
            { status: 500 }
        );
    }
}

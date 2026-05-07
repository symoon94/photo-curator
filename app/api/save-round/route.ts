import fs from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
    try {
        const { round, images } = await request.json();

        if (typeof round !== 'number' || !Array.isArray(images)) {
            return NextResponse.json(
                { success: false, message: 'Invalid payload' },
                { status: 400 }
            );
        }

        const folderName = round === 1 ? 'champion' : `round-${round}`;
        const targetDir = path.join(process.cwd(), 'public', folderName);

        // Reset folder so each World Cup run is clean
        if (fs.existsSync(targetDir)) {
            fs.rmSync(targetDir, { recursive: true, force: true });
        }
        fs.mkdirSync(targetDir, { recursive: true });

        const copied: string[] = [];
        for (const imagePath of images) {
            // imagePath looks like "/images/IMG_3200.jpg"
            const filename = path.basename(imagePath);
            const sourcePath = path.join(process.cwd(), 'public', imagePath);
            const destPath = path.join(targetDir, filename);

            if (fs.existsSync(sourcePath)) {
                fs.copyFileSync(sourcePath, destPath);
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

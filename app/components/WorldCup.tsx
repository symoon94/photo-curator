'use client';

import { useMemo, useState } from 'react';

interface WorldCupProps {
    images: string[];
    onExit: () => void;
}

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function roundLabel(size: number): string {
    if (size <= 1) return 'Champion';
    if (size === 2) return 'Final';
    if (size === 4) return 'Semifinal';
    if (size === 8) return 'Quarterfinal';
    return `Round of ${size}`;
}

const SAVE_ROUNDS = new Set([16, 8, 4, 2, 1]);

export default function WorldCup({ images, onExit }: WorldCupProps) {
    const initialBracket = useMemo(() => shuffle(images), [images]);
    const [bracket, setBracket] = useState<string[]>(initialBracket);
    const [nextRound, setNextRound] = useState<string[]>([]);
    const [pairIndex, setPairIndex] = useState(0);
    const [champion, setChampion] = useState<string | null>(
        initialBracket.length === 1 ? initialBracket[0] : null
    );
    const [saveError, setSaveError] = useState<string | null>(null);

    const saveRound = async (round: number, advancedImages: string[]) => {
        if (!SAVE_ROUNDS.has(round)) return;
        try {
            const res = await fetch('/api/save-round', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ round, images: advancedImages }),
            });
            const data = await res.json();
            if (!data.success) {
                console.error('save-round failed:', data.message);
                setSaveError(`라운드 ${round} 저장 실패: ${data.message ?? 'unknown error'}`);
            } else {
                setSaveError(null);
            }
        } catch (err) {
            console.error('save-round error:', err);
            setSaveError(`라운드 ${round} 저장 실패: 네트워크 오류`);
        }
    };

    if (images.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200">
                <p className="mb-4">선택된 사진이 없습니다.</p>
                <button
                    onClick={onExit}
                    className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                    Back
                </button>
            </div>
        );
    }

    const handlePick = (winner: string) => {
        if (champion) return;
        const newNext = [...nextRound, winner];
        const nextPairStart = (pairIndex + 1) * 2;

        if (nextPairStart >= bracket.length - 1) {
            // Round done — last contestant byes if odd count (never played)
            const advanced = [...newNext];
            if (bracket.length % 2 === 1) {
                advanced.push(bracket[bracket.length - 1]);
            }
            saveRound(advanced.length, advanced);
            if (advanced.length === 1) {
                setChampion(advanced[0]);
                setBracket(advanced);
                setNextRound([]);
                setPairIndex(0);
                return;
            }
            setBracket(shuffle(advanced));
            setNextRound([]);
            setPairIndex(0);
        } else {
            setNextRound(newNext);
            setPairIndex(pairIndex + 1);
        }
    };

    const reset = () => {
        const fresh = shuffle(images);
        setBracket(fresh);
        setNextRound([]);
        setPairIndex(0);
        setChampion(fresh.length === 1 ? fresh[0] : null);
        setSaveError(null);
    };

    if (champion) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-300 to-pink-500 bg-clip-text text-transparent mb-2">
                        🏆 Champion
                    </h1>
                    <p className="text-gray-400">{images.length}장 중 우승작</p>
                </div>
                <div className="border-4 border-yellow-400 rounded-2xl overflow-hidden shadow-2xl mb-6 max-w-3xl max-h-[70vh]">
                    <img
                        src={champion}
                        alt="Champion"
                        className="w-full h-full object-contain bg-black"
                    />
                </div>
                <p className="text-gray-300 mb-4 text-sm">{champion.split('/').pop()}</p>
                {saveError && (
                    <p className="text-red-400 mb-4 text-sm">{saveError}</p>
                )}
                <div className="flex gap-3">
                    <button
                        onClick={reset}
                        className="px-5 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium"
                    >
                        Replay
                    </button>
                    <button
                        onClick={onExit}
                        className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-medium"
                    >
                        Exit
                    </button>
                </div>
            </div>
        );
    }

    const left = bracket[pairIndex * 2];
    const right = bracket[pairIndex * 2 + 1];
    const totalPairs = Math.floor(bracket.length / 2);

    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            <div className="p-6 flex justify-between items-center border-b border-gray-800">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Photo World Cup
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {roundLabel(bracket.length)} · Match {pairIndex + 1} / {totalPairs}
                    </p>
                    {SAVE_ROUNDS.has(bracket.length) && (
                        <p className="text-green-400 text-xs mt-1">
                            진출자 {bracket.length}명 → public/{bracket.length === 1 ? 'champion' : `round-${bracket.length}`}/ 저장됨
                        </p>
                    )}
                    {saveError && (
                        <p className="text-red-400 text-xs mt-1">⚠ {saveError}</p>
                    )}
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={reset}
                        className="px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 text-sm"
                    >
                        Restart
                    </button>
                    <button
                        onClick={onExit}
                        className="px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 text-sm"
                    >
                        Exit
                    </button>
                </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 p-6 items-center">
                {[left, right].map((image, i) => (
                    <button
                        key={image + i}
                        onClick={() => handlePick(image)}
                        className="group relative h-full w-full overflow-hidden rounded-xl border-2 border-gray-700 hover:border-blue-400 transition-all bg-black"
                        style={{ height: 'calc(100vh - 160px)' }}
                    >
                        <img
                            src={image}
                            alt={`Candidate ${i + 1}`}
                            className="w-full h-full object-contain transition-transform group-hover:scale-[1.02]"
                            loading="eager"
                        />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white font-medium text-center">Pick this</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

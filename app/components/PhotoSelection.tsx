'use client';

import { useEffect, useRef, useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

interface PhotoSelectionProps {
    images: string[];
    selectedImages: string[];
    onImageSelect: (imagePath: string, isSelected: boolean) => void;
}

export default function PhotoSelection({ images, selectedImages, onImageSelect }: PhotoSelectionProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [imagesPerPage, setImagesPerPage] = useState(4);
    const [globalScale, setGlobalScale] = useState(1);
    const transformRefs = useRef<any[]>([]);
    const initialLoadDone = useRef(false);  // 초기 로딩 상태 추적
    const totalPages = Math.ceil(images.length / imagesPerPage);

    useEffect(() => {
        if (initialLoadDone.current) return;  // 이미 로드했다면 실행하지 않음

        async function loadSelectedImages() {
            try {
                const response = await fetch('/api/get-selected');
                const data = await response.json();
                if (data.success && data.selectedImages) {
                    // 한 번에 모든 이미지 선택
                    const newImages = data.selectedImages.filter(
                        (image: string) => !selectedImages.includes(image)
                    );
                    if (newImages.length > 0) {
                        newImages.forEach((image: string) => {
                            onImageSelect(image, true);
                        });
                    }
                }
                initialLoadDone.current = true;  // 초기 로딩 완료 표시
            } catch (error) {
                console.error('Error loading selected images:', error);
            }
        }

        loadSelectedImages();
    }, [selectedImages, onImageSelect]);

    useEffect(() => {
        transformRefs.current = transformRefs.current.slice(0, images.length);
    }, [images]);

    const handleGlobalZoom = (type: 'in' | 'out' | 'reset') => {
        transformRefs.current.forEach(ref => {
            if (ref) {
                if (type === 'in') {
                    ref.zoomIn(1.2);
                } else if (type === 'out') {
                    ref.zoomOut(1.2);
                } else {
                    ref.resetTransform();
                }
            }
        });
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const startIndex = (currentPage - 1) * imagesPerPage;
    const displayedImages = images.slice(startIndex, startIndex + imagesPerPage);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let end = Math.min(totalPages, start + maxVisiblePages - 1);

        if (end - start + 1 < maxVisiblePages) {
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const handleImagesPerPageChange = (newValue: number) => {
        const currentFirstImageIndex = (currentPage - 1) * imagesPerPage;
        const newPage = Math.floor(currentFirstImageIndex / newValue) + 1;
        setImagesPerPage(newValue);
        setCurrentPage(newPage);
    };

    // 파일 경로에서 파일명만 추출하는 헬퍼 함수
    const getFileName = (path: string) => {
        return path.split('/').pop() || '';
    };

    // 이미지가 선택되었는지 확인하는 함수
    const isImageSelected = (imagePath: string) => {
        const fileName = getFileName(imagePath);
        return selectedImages.some(selectedPath => getFileName(selectedPath) === fileName);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-900">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Photo Curator
                    </h1>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 font-medium">Global Zoom</span>
                            <div className="flex gap-1 bg-gray-800/50 p-1 rounded-lg">
                                <button
                                    onClick={() => handleGlobalZoom('out')}
                                    className="text-gray-200 font-medium text-sm px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded transition-colors"
                                >
                                    -
                                </button>
                                <button
                                    onClick={() => handleGlobalZoom('reset')}
                                    className="text-gray-200 font-medium text-sm px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded transition-colors"
                                >
                                    Reset
                                </button>
                                <button
                                    onClick={() => handleGlobalZoom('in')}
                                    className="text-gray-200 font-medium text-sm px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 rounded transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg">
                            <span className="text-gray-400">Selected</span>
                            <span className="text-blue-400 font-semibold">{selectedImages.length}</span>
                            <span className="text-gray-400">photos</span>
                        </div>
                        {selectedImages.length > 0 && (
                            <button
                                onClick={async () => {
                                    try {
                                        const response = await fetch('/api/save-selected', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({ selectedImages }),
                                        });

                                        const data = await response.json();
                                        if (data.success) {
                                            alert('Selected photos have been saved.');
                                        } else {
                                            throw new Error(data.message);
                                        }
                                    } catch (error) {
                                        alert('Error saving photos.');
                                        console.error('Error saving images:', error);
                                    }
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 font-medium"
                            >
                                Save Selection
                            </button>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6 mb-6" style={{
                    minHeight: '0',
                    height: imagesPerPage === 2 ? 'calc(100vh - 220px)' : 'calc(100vh - 220px)'
                }}>
                    {displayedImages.map((image, index) => {
                        const isSelected = isImageSelected(image);
                        return (
                            <div
                                key={image}
                                className={`relative border-2 rounded-xl overflow-hidden transition-all bg-gray-800/30
                                    ${isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-700 hover:border-gray-600'}`}
                                style={{
                                    width: '100%',
                                    height: imagesPerPage === 2 ? '100%' : 'calc((100vh - 240px) / 2)',
                                }}
                            >
                                <TransformWrapper
                                    ref={(el: any) => {
                                        transformRefs.current[index] = el;
                                    }}
                                    initialScale={1}
                                    minScale={0.5}
                                    maxScale={32}
                                    centerOnInit
                                    limitToBounds={true}
                                    wheel={{
                                        step: 2.0
                                    }}
                                    pinch={{
                                        disabled: false,
                                        step: 10
                                    }}
                                >
                                    {({ zoomIn, zoomOut, resetTransform }) => (
                                        <>
                                            <button
                                                className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-lg text-sm transition-all ${isSelected
                                                    ? 'bg-blue-500/90 text-white hover:bg-blue-600/90'
                                                    : 'bg-gray-800/90 hover:bg-gray-700/90 text-gray-200'
                                                    }`}
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    if (isSelected) {
                                                        // 선택 해제 시 API 호출
                                                        try {
                                                            const response = await fetch('/api/save-selected', {
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify({ removedImage: image }),
                                                            });

                                                            const data = await response.json();
                                                            if (data.success) {
                                                                onImageSelect(image, false);
                                                            } else {
                                                                throw new Error(data.message);
                                                            }
                                                        } catch (error) {
                                                            console.error('Error removing image:', error);
                                                            alert('Error removing image from selection.');
                                                        }
                                                    } else {
                                                        // 선택 시에는 기존 로직 그대로 사용
                                                        onImageSelect(image, true);
                                                    }
                                                }}
                                            >
                                                {isSelected ? 'Selected' : 'Select'}
                                            </button>
                                            <div className="absolute top-3 right-3 z-10 flex gap-1 bg-gray-800/80 p-1 rounded-lg">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        zoomOut(1.2);
                                                    }}
                                                    className="text-gray-200 font-medium text-sm px-2 py-0.5 hover:bg-gray-700/80 rounded transition-colors"
                                                >
                                                    -
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        resetTransform();
                                                    }}
                                                    className="text-gray-200 font-medium text-sm px-2 py-0.5 hover:bg-gray-700/80 rounded transition-colors"
                                                >
                                                    Reset
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        zoomIn(1.2);
                                                    }}
                                                    className="text-gray-200 font-medium text-sm px-2 py-0.5 hover:bg-gray-700/80 rounded transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <TransformComponent
                                                wrapperClass="!w-full !h-full"
                                                contentClass="!w-full !h-full flex items-center justify-center"
                                            >
                                                <img
                                                    src={image}
                                                    alt={`Photo ${startIndex + index + 1}`}
                                                    className="max-w-full max-h-full w-auto h-auto object-contain"
                                                    loading="lazy"
                                                />
                                            </TransformComponent>
                                        </>
                                    )}
                                </TransformWrapper>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="h-[70px] flex items-center justify-center border-t border-gray-800 bg-gray-900/95 sticky bottom-0 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                    <div className="flex items-center gap-3 mr-6">
                        <label className="text-gray-400">Photos per page</label>
                        <select
                            value={imagesPerPage}
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value);
                                handleImagesPerPageChange(newValue);
                            }}
                            className="px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-200"
                        >
                            <option value={2}>2</option>
                            <option value={4}>4</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-200 font-medium transition-colors"
                        >
                            First
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-200 font-medium transition-colors"
                        >
                            Previous
                        </button>
                        {getPageNumbers().map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-1.5 rounded-lg transition-colors ${pageNum === currentPage
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-200 font-medium transition-colors"
                        >
                            Next
                        </button>
                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-gray-200 font-medium transition-colors"
                        >
                            Last
                        </button>
                    </div>
                    <div className="flex items-center gap-2 ml-6">
                        <input
                            type="number"
                            min={1}
                            max={totalPages}
                            value={currentPage}
                            onChange={(e) => {
                                const page = parseInt(e.target.value);
                                if (page >= 1 && page <= totalPages) {
                                    handlePageChange(page);
                                }
                            }}
                            className="w-16 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-center text-gray-200"
                        />
                        <span className="text-gray-400">/ {totalPages}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
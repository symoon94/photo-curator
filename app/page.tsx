'use client';

import { useEffect, useState } from 'react';
import PhotoSelection from './components/PhotoSelection';

export default function Home() {
  const [images, setImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/images')
      .then((res) => res.json())
      .then((data) => {
        // data가 배열인지 확인하고 설정
        if (Array.isArray(data)) {
          setImages(data);
        } else {
          console.error('Received invalid data format:', data);
          setImages([]);
        }
      })
      .catch((error) => {
        console.error('Error loading images:', error);
        setImages([]);
      });
  }, []);

  const handleImageSelect = (imagePath: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedImages((prev) => [...prev, imagePath]);
    } else {
      setSelectedImages((prev) => prev.filter((path) => path !== imagePath));
    }
  };

  return (
    <main>
      <PhotoSelection
        images={images}
        selectedImages={selectedImages}
        onImageSelect={handleImageSelect}
      />
    </main>
  );
}

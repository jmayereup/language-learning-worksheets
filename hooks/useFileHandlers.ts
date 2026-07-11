import { useState, useEffect } from 'react';
import { MediaState } from '../types/lessonEditor';
import { FILE_UPLOAD_CONSTRAINTS, VALIDATION_MESSAGES } from '../config/lessonEditor';

export const useFileHandlers = () => {
  const [media, setMedia] = useState<MediaState>({
    imageFile: null,
    audioFile: null,
    audioPreviewUrl: null,
    imagePreview: null
  });

  useEffect(() => {
    if (media.audioFile) {
      const url = URL.createObjectURL(media.audioFile);
      setMedia(prev => ({ ...prev, audioPreviewUrl: url }));
      return () => URL.revokeObjectURL(url);
    } else {
      setMedia(prev => ({ ...prev, audioPreviewUrl: null }));
    }
  }, [media.audioFile]);

  const handleImageFileChange = (file: File | null, onError?: (error: string) => void) => {
    if (!file) {
      setMedia(prev => ({ ...prev, imageFile: null, imagePreview: null }));
      return;
    }

    if (!FILE_UPLOAD_CONSTRAINTS.image.acceptedTypes.includes(file.type)) {
      onError?.('Invalid image type. Please upload JPEG, PNG, GIF, or WebP.');
      return;
    }

    if (file.size > FILE_UPLOAD_CONSTRAINTS.image.maxSize) {
      onError?.('Image file is too large. Maximum size is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setMedia(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleAudioFileChange = (file: File | null, onError?: (error: string) => void) => {
    if (!file) {
      setMedia(prev => ({ ...prev, audioFile: null }));
      return;
    }

    if (!FILE_UPLOAD_CONSTRAINTS.audio.acceptedTypes.includes(file.type)) {
      onError?.('Invalid audio type. Please upload MP3, WAV, or M4A.');
      return;
    }

    if (file.size > FILE_UPLOAD_CONSTRAINTS.audio.maxSize) {
      onError?.('Audio file is too large. Maximum size is 10MB.');
      return;
    }

    setMedia(prev => ({ ...prev, audioFile: file }));
  };

  const handlePasteImageFromClipboard = async (onError?: (error: string) => void) => {
    try {
      const items = await navigator.clipboard.read();
      let foundImage = false;
      
      for (const item of items) {
        const imageType = item.types.find(type => type.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File(
            [blob],
            `pasted-image-${Date.now()}.${imageType.split('/')[1]}`,
            { type: imageType }
          );
          handleImageFileChange(file, onError);
          foundImage = true;
          break;
        }
      }
      
      if (!foundImage) {
        onError?.(VALIDATION_MESSAGES.CLIPBOARD_NO_IMAGE);
      }
    } catch (err) {
      onError?.(VALIDATION_MESSAGES.CLIPBOARD_PERMISSION_DENIED);
    }
  };

  const resetMedia = () => {
    setMedia({
      imageFile: null,
      audioFile: null,
      audioPreviewUrl: null,
      imagePreview: null
    });
  };

  return {
    media,
    handleImageFileChange,
    handleAudioFileChange,
    handlePasteImageFromClipboard,
    resetMedia,
    setMedia
  };
};
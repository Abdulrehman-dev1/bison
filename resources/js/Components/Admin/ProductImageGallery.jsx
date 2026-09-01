import { GripVertical, ImagePlus, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

function buildItems(existingImages = [], newFiles = [], removedIds = []) {
    const keptExisting = existingImages
        .filter((image) => !removedIds.includes(image.id))
        .map((image) => ({
            key: `existing-${image.id}`,
            type: 'existing',
            id: image.id,
            path: image.path,
            preview: image.path,
        }));

    const pending = newFiles.map((entry) => ({
        key: entry.key,
        type: 'new',
        id: entry.key,
        preview: entry.preview,
    }));

    return [...keptExisting, ...pending];
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_FILES = 12;

function formatFileSize(bytes) {
    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export default function ProductImageGallery({ existingImages = [], onChange, errors = {} }) {
    const inputRef = useRef(null);
    const [removedIds, setRemovedIds] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [items, setItems] = useState(() => buildItems(existingImages, [], []));
    const [draggingKey, setDraggingKey] = useState(null);
    const [uploadError, setUploadError] = useState('');

    const emitChange = useCallback((nextItems, nextRemovedIds, nextNewFiles) => {
        const existingIds = nextItems.filter((item) => item.type === 'existing').map((item) => item.id);
        const files = nextItems
            .filter((item) => item.type === 'new')
            .map((item) => nextNewFiles.find((entry) => entry.key === item.id)?.file)
            .filter(Boolean);

        onChange({
            existing_image_ids: existingIds,
            removed_image_ids: nextRemovedIds,
            images: files,
        });
    }, [onChange]);

    useEffect(() => {
        return () => {
            newFiles.forEach((entry) => URL.revokeObjectURL(entry.preview));
        };
    }, [newFiles]);

    const addFiles = (fileList) => {
        const selected = Array.from(fileList ?? []);

        if (selected.length === 0) {
            return;
        }

        const remainingSlots = MAX_FILES - items.length;

        if (remainingSlots <= 0) {
            setUploadError(`You can upload up to ${MAX_FILES} images per product.`);
            return;
        }

        const accepted = selected.slice(0, remainingSlots);
        const rejected = accepted.filter((file) => file.size > MAX_FILE_SIZE);

        if (rejected.length > 0) {
            const names = rejected
                .map((file) => `"${file.name}" (${formatFileSize(file.size)})`)
                .join(', ');
            setUploadError(`Maximum file size is 5 MB. Too large: ${names}`);
        } else {
            setUploadError('');
        }

        const valid = accepted.filter((file) => file.size <= MAX_FILE_SIZE);

        if (valid.length === 0) {
            return;
        }

        const entries = valid.map((file) => ({
            key: `new-${crypto.randomUUID()}`,
            file,
            preview: URL.createObjectURL(file),
        }));

        const nextNewFiles = [...newFiles, ...entries];
        const nextItems = [
            ...items,
            ...entries.map((entry) => ({
                key: entry.key,
                type: 'new',
                id: entry.key,
                preview: entry.preview,
            })),
        ];

        setNewFiles(nextNewFiles);
        setItems(nextItems);
        emitChange(nextItems, removedIds, nextNewFiles);
    };

    const removeItem = (item) => {
        let nextRemovedIds = removedIds;
        let nextNewFiles = newFiles;

        if (item.type === 'existing') {
            nextRemovedIds = [...removedIds, item.id];
            setRemovedIds(nextRemovedIds);
        } else {
            nextNewFiles = newFiles.filter((entry) => {
                if (entry.key === item.id) {
                    URL.revokeObjectURL(entry.preview);
                }
                return entry.key !== item.id;
            });
            setNewFiles(nextNewFiles);
        }

        const nextItems = items.filter((entry) => entry.key !== item.key);
        setItems(nextItems);
        emitChange(nextItems, nextRemovedIds, nextNewFiles);
    };

    const handleDrop = (targetKey) => {
        if (!draggingKey || draggingKey === targetKey) {
            setDraggingKey(null);
            return;
        }

        const next = [...items];
        const fromIndex = next.findIndex((item) => item.key === draggingKey);
        const toIndex = next.findIndex((item) => item.key === targetKey);

        if (fromIndex === -1 || toIndex === -1) {
            setDraggingKey(null);
            return;
        }

        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);

        setItems(next);
        emitChange(next, removedIds, newFiles);
        setDraggingKey(null);
    };

    const totalCount = items.length;

    return (
        <div className="adm-image-gallery">
            <div className="adm-image-gallery-head">
                <div>
                    <label className="adm-label">Product images</label>
                    <p className="adm-image-gallery-hint">
                        Upload multiple images. They are optimized on save. Drag to reorder — first image is the cover.
                    </p>
                </div>
                <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={() => inputRef.current?.click()}>
                    <ImagePlus size={16} /> Add images
                </button>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                hidden
                onChange={(event) => {
                    addFiles(event.target.files);
                    event.target.value = '';
                }}
            />

            {totalCount === 0 ? (
                <button type="button" className="adm-image-dropzone" onClick={() => inputRef.current?.click()}>
                    <ImagePlus size={28} />
                    <span>Click to upload product images</span>
                    <small>JPG, PNG, or WebP · up to 5 MB each</small>
                </button>
            ) : (
                <div className="adm-image-grid">
                    {items.map((item, index) => (
                        <div
                            key={item.key}
                            className={`adm-image-card ${draggingKey === item.key ? 'is-dragging' : ''}`}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => {
                                event.preventDefault();
                                handleDrop(item.key);
                            }}
                        >
                            <img src={item.preview} alt="" draggable={false} />
                            <div className="adm-image-card-overlay">
                                <span className="adm-image-order">{index + 1}</span>
                                <button type="button" className="adm-image-remove" aria-label="Remove image" onClick={() => removeItem(item)}>
                                    <X size={16} />
                                </button>
                            </div>
                            <button
                                type="button"
                                className="adm-image-drag"
                                aria-label="Drag to reorder"
                                draggable
                                onDragStart={(event) => {
                                    setDraggingKey(item.key);
                                    event.dataTransfer.effectAllowed = 'move';
                                }}
                                onDragEnd={() => setDraggingKey(null)}
                            >
                                <GripVertical size={16} />
                            </button>
                            {index === 0 && <span className="adm-image-cover-badge">Cover</span>}
                        </div>
                    ))}

                    <button type="button" className="adm-image-add-card" onClick={() => inputRef.current?.click()}>
                        <ImagePlus size={22} />
                        <span>Add more</span>
                    </button>
                </div>
            )}

            {uploadError && <p className="adm-error-text">{uploadError}</p>}
            {errors.images && <p className="adm-error-text">{errors.images}</p>}
        </div>
    );
}

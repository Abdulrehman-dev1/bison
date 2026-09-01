<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class PublicImageService
{
    private const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp'];

    private const MAX_SIZE = 5120; // KB

    private const MAX_DIMENSION = 1600;

    /** Only run GD optimization below this size — larger files are stored as-is. */
    private const OPTIMIZE_MAX_DIMENSION = 2048;

    private const OPTIMIZE_MAX_PIXELS = 3_000_000;

    public function upload(UploadedFile $file, string $folder): string
    {
        return $this->uploadOptimized($file, $folder);
    }

    public function uploadOptimized(UploadedFile $file, string $folder): string
    {
        $this->validate($file);

        $directory = public_path('images/dynamic-images/'.$folder);

        if (! is_dir($directory)) {
            mkdir($directory, 0755, true);
        }

        $path = $file->getRealPath();
        $info = @getimagesize($path);

        if ($info === false || ! extension_loaded('gd')) {
            return $this->storeOriginal($file, $directory, $folder);
        }

        [$width, $height] = $info;

        if ($width > self::OPTIMIZE_MAX_DIMENSION
            || $height > self::OPTIMIZE_MAX_DIMENSION
            || ($width * $height) > self::OPTIMIZE_MAX_PIXELS) {
            return $this->storeOriginal($file, $directory, $folder);
        }

        return $this->optimizeAndSave($file, $directory, $folder, $info);
    }

    public function delete(?string $path): void
    {
        if (! $path) {
            return;
        }

        $fullPath = public_path(ltrim($path, '/'));

        if (is_file($fullPath)) {
            unlink($fullPath);
        }
    }

    private function validate(UploadedFile $file): void
    {
        if (! in_array($file->getMimeType(), self::ALLOWED_MIMES, true)) {
            throw new \InvalidArgumentException('Invalid image type.');
        }

        if ($file->getSize() > self::MAX_SIZE * 1024) {
            throw new \InvalidArgumentException('Image exceeds maximum size (5 MB).');
        }
    }

    private function optimizeAndSave(UploadedFile $file, string $directory, string $folder, array $info): string
    {
        [$width, $height, $type] = $info;
        $path = $file->getRealPath();

        $image = $this->createImageFromFile($path, $type);

        if ($image === false) {
            return $this->storeOriginal($file, $directory, $folder);
        }

        try {
            imagealphablending($image, true);
            imagesavealpha($image, true);

            $max = self::MAX_DIMENSION;

            if ($width > $max || $height > $max) {
                $ratio = min($max / $width, $max / $height);
                $newWidth = max(1, (int) round($width * $ratio));
                $newHeight = max(1, (int) round($height * $ratio));
                $resized = imagescale($image, $newWidth, $newHeight, IMG_BILINEAR_FIXED);

                imagedestroy($image);

                if ($resized === false) {
                    throw new \RuntimeException('Could not resize image.');
                }

                $image = $resized;
            }

            $baseName = Str::uuid()->toString();
            $relativeFolder = '/images/dynamic-images/'.$folder.'/';

            if (function_exists('imagewebp')) {
                $filename = $baseName.'.webp';
                imagewebp($image, $directory.DIRECTORY_SEPARATOR.$filename, 82);
            } else {
                $filename = $baseName.'.jpg';
                imagejpeg($image, $directory.DIRECTORY_SEPARATOR.$filename, 82);
            }

            return $relativeFolder.$filename;
        } finally {
            if (isset($image) && $image instanceof \GdImage) {
                imagedestroy($image);
            }
        }
    }

    private function createImageFromFile(string $path, int $type): \GdImage|false
    {
        return match ($type) {
            IMAGETYPE_JPEG => @imagecreatefromjpeg($path),
            IMAGETYPE_PNG => @imagecreatefrompng($path),
            IMAGETYPE_WEBP => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($path) : false,
            default => false,
        };
    }

    private function storeOriginal(UploadedFile $file, string $directory, string $folder): string
    {
        $extension = strtolower($file->getClientOriginalExtension() ?: 'jpg');
        $extension = in_array($extension, ['jpg', 'jpeg', 'png', 'webp'], true) ? $extension : 'jpg';
        $filename = Str::uuid()->toString().'.'.$extension;
        $file->move($directory, $filename);

        return '/images/dynamic-images/'.$folder.'/'.$filename;
    }
}

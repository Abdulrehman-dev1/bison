<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$srcPath = $root . '/public/images/static/bison-logo.png';

if (! extension_loaded('gd')) {
    fwrite(STDERR, "GD extension is required.\n");
    exit(1);
}

$source = imagecreatefrompng($srcPath);
if ($source === false) {
    fwrite(STDERR, "Unable to load source logo.\n");
    exit(1);
}

$width = imagesx($source);
$height = imagesy($source);

// Crop the circular emblem on the left (square crop).
$cropSize = (int) round($height * 0.92);
$cropX = (int) round(($width * 0.22) - ($cropSize / 2));
$cropY = (int) round(($height - $cropSize) / 2);
$cropX = max(0, min($cropX, $width - $cropSize));

$emblem = imagecrop($source, [
    'x' => $cropX,
    'y' => $cropY,
    'width' => $cropSize,
    'height' => $cropSize,
]);

if ($emblem === false) {
    fwrite(STDERR, "Unable to crop emblem from logo.\n");
    exit(1);
}

function resizeSquare(GdImage $source, int $size): GdImage
{
    $target = imagecreatetruecolor($size, $size);
    imagealphablending($target, false);
    imagesavealpha($target, true);

    $transparent = imagecolorallocatealpha($target, 0, 0, 0, 127);
    imagefilledrectangle($target, 0, 0, $size, $size, $transparent);

    $sourceWidth = imagesx($source);
    $sourceHeight = imagesy($source);

    imagecopyresampled(
        $target,
        $source,
        0,
        0,
        0,
        0,
        $size,
        $size,
        $sourceWidth,
        $sourceHeight
    );

    return $target;
}

function pngBytes(GdImage $image): string
{
    ob_start();
    imagepng($image);
    return (string) ob_get_clean();
}

function writeIco(string $path, array $pngSizes): void
{
    $count = count($pngSizes);
    $header = pack('vvv', 0, 1, $count);

    $directory = '';
    $images = '';
    $offset = 6 + ($count * 16);

    foreach ($pngSizes as [$size, $png]) {
        $directory .= pack('CCCCvvVV', $size, $size, 0, 0, 1, 32, strlen($png), $offset);
        $images .= $png;
        $offset += strlen($png);
    }

    file_put_contents($path, $header.$directory.$images);
}

$sizes = [
    16 => $root . '/public/favicon-16x16.png',
    32 => $root . '/public/favicon-32x32.png',
    180 => $root . '/public/apple-touch-icon.png',
];

$icoEntries = [];

foreach ($sizes as $size => $path) {
    $resized = resizeSquare($emblem, $size);
    imagepng($resized, $path, 9);
    $icoEntries[] = [$size, pngBytes($resized)];
    imagedestroy($resized);
    echo "Wrote {$path}\n";
}

writeIco($root . '/public/favicon.ico', $icoEntries);
echo "Wrote {$root}/public/favicon.ico\n";

imagedestroy($emblem);
imagedestroy($source);

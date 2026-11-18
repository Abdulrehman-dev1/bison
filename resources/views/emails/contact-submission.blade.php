<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New Contact Submission</title>
</head>
<body>
    <h1>New contact submission</h1>
    <p><strong>Intent:</strong> {{ $submission->intent }}</p>
    <p><strong>Name:</strong> {{ $submission->name }}</p>
    <p><strong>Email:</strong> {{ $submission->email }}</p>
    <p><strong>Company:</strong> {{ $submission->company ?: '—' }}</p>
    <p><strong>Message:</strong></p>
    <p>{{ $submission->detail !== '' ? $submission->detail : '—' }}</p>
    @if (! empty($submission->items))
        <p><strong>Items:</strong></p>
        <ul>
            @foreach ($submission->items as $item)
                <li>
                    {{ $item['name'] ?? '' }}
                    @if (! empty($item['variant'])) — {{ $item['variant'] }} @endif
                    @if (! empty($item['sku'])) ({{ $item['sku'] }}) @endif
                    @if (! empty($item['qty'])) · Qty {{ $item['qty'] }} @endif
                </li>
            @endforeach
        </ul>
    @endif
</body>
</html>

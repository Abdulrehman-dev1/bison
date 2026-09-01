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
    <p>{{ $submission->detail }}</p>
</body>
</html>

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, voice = 'default_en', format = 'mp3' } = body;

    const apiKey = process.env.MIMO_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'MIMO_API_KEY is not configured on the server.' }, { status: 500 });
    }

    if (!text) {
      return NextResponse.json({ error: 'Text query parameter is required.' }, { status: 400 });
    }

    const payload = {
      model: 'mimo-v2-tts',
      messages: [
        {
          role: 'assistant',
          content: text,
        },
      ],
      audio: {
        format: format,
        voice: voice,
      },
      stream: false, // Using non-streaming for easier base64 audio handling
    };

    const response = await fetch('https://api.xiaomimimo.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: `Xiaomi API error: ${response.status} ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    // Assuming OpenAI compatibility where audio base64 is in choices[0].message.audio.data
    // Forward the whole structure so frontend can parse it.
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}

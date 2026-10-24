"""Thin provider-agnostic wrapper: send prompt + images, get back parsed JSON."""
import os, re, json, base64
from dotenv import load_dotenv

load_dotenv()
PROVIDER = os.getenv("PROVIDER", "gemini").lower()


def _parse_json(text: str) -> dict:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text, flags=re.M).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        m = re.search(r"\{.*\}", text, re.S)
        if m:
            return json.loads(m.group(0))
        raise ValueError("Model did not return valid JSON")


def _gemini(prompt, images, system):
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
    parts = [types.Part.from_bytes(data=b, mime_type=m) for b, m in images]
    parts.append(prompt)
    resp = client.models.generate_content(
        model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        contents=parts,
        config=types.GenerateContentConfig(
            system_instruction=system,
            response_mime_type="application/json",
            temperature=0.3,
        ),
    )
    return resp.text


def _anthropic(prompt, images, system):
    import anthropic

    client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY
    content = [
        {"type": "image", "source": {"type": "base64", "media_type": m,
                                     "data": base64.b64encode(b).decode()}}
        for b, m in images
    ]
    content.append({"type": "text", "text": prompt})
    resp = client.messages.create(
        model=os.getenv("ANTHROPIC_MODEL", "claude-sonnet-5-5"),
        max_tokens=4000,
        system=system or "",
        messages=[{"role": "user", "content": content}],
    )
    return resp.content[0].text


def ask(prompt: str, images=None, system: str | None = None) -> dict:
    """images: list of (bytes, mime_type). Returns a dict parsed from model JSON."""
    images = images or []
    raw = _anthropic(prompt, images, system) if PROVIDER == "anthropic" else _gemini(prompt, images, system)
    return _parse_json(raw)

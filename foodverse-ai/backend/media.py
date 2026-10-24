"""Image / video helpers: normalise uploads into small JPEG frames for the vision model."""
import io, os, tempfile
import cv2
from PIL import Image, ImageOps


def prep_image(data: bytes):
    img = Image.open(io.BytesIO(data))
    img = ImageOps.exif_transpose(img).convert("RGB")
    img.thumbnail((1280, 1280))
    buf = io.BytesIO()
    img.save(buf, "JPEG", quality=85)
    return buf.getvalue(), "image/jpeg"


def video_frames(data: bytes, n: int = 6):
    with tempfile.NamedTemporaryFile(suffix=".mp4", delete=False) as f:
        f.write(data)
        path = f.name
    out = []
    try:
        cap = cv2.VideoCapture(path)
        total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total <= 0:
            raise ValueError("Unreadable video")
        for i in range(n):
            cap.set(cv2.CAP_PROP_POS_FRAMES, int(total * (i + 0.5) / n))
            ok, frame = cap.read()
            if not ok:
                continue
            h, w = frame.shape[:2]
            s = 1024 / max(h, w)
            if s < 1:
                frame = cv2.resize(frame, (int(w * s), int(h * s)))
            ok, buf = cv2.imencode(".jpg", frame)
            if ok:
                out.append((buf.tobytes(), "image/jpeg"))
        cap.release()
    finally:
        try:
            os.remove(path)
        except OSError:
            pass
    if not out:
        raise ValueError("No frames could be extracted")
    return out


def to_images(data: bytes, content_type: str):
    if content_type.startswith("video"):
        return video_frames(data)
    return [prep_image(data)]

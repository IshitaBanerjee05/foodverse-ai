import { useEffect, useState } from "react";

export default function FilePicker({ file, setFile, label = "Upload photo or video" }) {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!file) { setUrl(null); return; }
    const u = URL.createObjectURL(file);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  return (
    <div className="picker">
      <label className="drop">
        <input type="file" accept="image/*,video/*" hidden
               onChange={(e) => setFile(e.target.files[0] || null)} />
        {file ? `📎 ${file.name}` : `⬆ ${label}`}
      </label>
      {url && (file.type.startsWith("video")
        ? <video src={url} controls className="preview" />
        : <img src={url} alt="preview" className="preview" />)}
    </div>
  );
}

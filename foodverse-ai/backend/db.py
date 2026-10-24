"""SQLite storage for analysis history (the 'Data Storage' box in the architecture)."""
import os, json, sqlite3

PATH = os.getenv("DB_PATH", "foodverse.db")


def _conn():
    c = sqlite3.connect(PATH)
    c.row_factory = sqlite3.Row
    return c


def init():
    with _conn() as c:
        c.execute(
            """CREATE TABLE IF NOT EXISTS analyses(
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                module TEXT, title TEXT, result TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP)"""
        )


def save(module: str, title: str, result: dict) -> int:
    with _conn() as c:
        cur = c.execute(
            "INSERT INTO analyses(module,title,result) VALUES(?,?,?)",
            (module, title[:200], json.dumps(result)),
        )
        return cur.lastrowid


def history(limit: int = 50):
    with _conn() as c:
        rows = c.execute(
            "SELECT * FROM analyses ORDER BY id DESC LIMIT ?", (limit,)
        ).fetchall()
    return [
        {"id": r["id"], "module": r["module"], "title": r["title"],
         "created_at": r["created_at"], "result": json.loads(r["result"])}
        for r in rows
    ]


def clear():
    with _conn() as c:
        c.execute("DELETE FROM analyses")

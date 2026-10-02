import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import type { LetterMessage } from "../../types/content";
import { LanguageText } from "../ui/LanguageText";

const STORAGE_KEY = "hana-alice-letter-messages";

function readMessages(): LetterMessage[] {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is LetterMessage => {
        if (!item || typeof item !== "object") return false;
        return typeof item.id === "string" && typeof item.message === "string";
      })
      .slice(0, 16);
  } catch {
    return [];
  }
}

export function MessageWall() {
  const [messages, setMessages] = useState<LetterMessage[]>(readMessages);
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const trimmedMessage = message.trim();
  const canSubmit = trimmedMessage.length >= 1 && trimmedMessage.length <= 500;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;
    setMessages((current) => [
      {
        id: crypto.randomUUID(),
        message: trimmedMessage,
        nickname: nickname.trim() || "匿名"
      },
      ...current
    ].slice(0, 16));
    setMessage("");
    setNickname("");
  };

  return (
    <section className="message-wall">
      <div className="shell message-wall__inner">
        <div className="message-wall__intro">
          <p className="eyebrow"><LanguageText text="LETTER · 留言" /></p>
          <h2>如果有什么想留下的话</h2>
          <p>
            看完这些照片之后，可以把想说的话写在这里。当前没有登录和数据库，留言只保存在你自己的浏览器里。
          </p>
          <form className="message-wall__form" onSubmit={submit}>
            <label htmlFor="letter-nickname">昵称（可选）</label>
            <input
              id="letter-nickname"
              type="text"
              value={nickname}
              maxLength={30}
              placeholder="匿名"
              onChange={(event) => setNickname(event.target.value)}
            />
            <label htmlFor="letter-message">留言内容</label>
            <textarea
              id="letter-message"
              value={message}
              minLength={1}
              maxLength={500}
              rows={5}
              required
              placeholder="写一点什么……"
              onChange={(event) => setMessage(event.target.value.slice(0, 500))}
            />
            <div className="message-wall__form-meta">
              <span>1–500 字</span>
              <span><LanguageText text={`${message.length} / 500`} /></span>
            </div>
            <button className="button button--solid" type="submit" disabled={!canSubmit}>
              留 下 来 <span aria-hidden="true">→</span>
            </button>
          </form>
        </div>

        <div className="message-wall__notes" aria-live="polite">
          {messages.length > 0 ? messages.map((note, index) => (
            <article className="paper-note" key={note.id} style={{ "--note-index": index } as CSSProperties}>
              <p><LanguageText text={note.message} /></p>
              <strong className="paper-note__name"><LanguageText text={note.nickname || "匿名"} /></strong>
            </article>
          )) : (
            <div className="message-wall__empty">
              <span>还没有纸条。</span>
              <p>第一句话，就留给你。</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import type { LetterMessage } from "../../types/content";
import { supabase } from "../../lib/supabase";
import { LanguageText } from "../ui/LanguageText";

interface MessageRow {
  id: number;
  name: string | null;
  content: string;
  created_at: string;
}

const TABLE_NAME = "messages";

function mapMessage(row: MessageRow): LetterMessage {
  return {
    id: String(row.id),
    message: row.content,
    nickname: row.name?.trim() || "匿名"
  };
}

export function MessageWall() {
  const [messages, setMessages] = useState<LetterMessage[]>([]);
  const [message, setMessage] = useState("");
  const [nickname, setNickname] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("id,name,content,created_at")
        .order("created_at", { ascending: false })
        .limit(16);

      if (cancelled || error || !data) return;
      setMessages((data as MessageRow[]).map(mapMessage));
    };

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, []);

  const trimmedMessage = message.trim();
  const canSubmit = trimmedMessage.length >= 1 && trimmedMessage.length <= 500 && !submitting;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({
        name: nickname.trim() || "匿名",
        content: trimmedMessage
      })
      .select("id,name,content,created_at")
      .single();

    if (error || !data) {
      setSubmitting(false);
      return;
    }

    setMessages((current) => [mapMessage(data as MessageRow), ...current].slice(0, 16));
    setMessage("");
    setNickname("");
    setSubmitting(false);
  };

  return (
    <section className="message-wall">
      <div className="shell message-wall__inner">
        <div className="message-wall__intro">
          <p className="eyebrow"><LanguageText text="LETTER · 留言" /></p>
          <h2>如果有什么想留下的话</h2>
          <p>
            看完这些照片之后，可以把想说的话写在这里。留言会保存在公共留言墙中。
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
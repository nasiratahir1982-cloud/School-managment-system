import re

def update_queries_ui():
    path = 'frontend/src/pages/UnifiedDashboard.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. We need to define `replyMessages` state. Let's find where `replyMessage` is defined.
    # It's probably `const [replyMessage, setReplyMessage] = useState('');`
    # Let's replace it with `const [replyMessages, setReplyMessages] = useState<Record<string, string>>({});`
    content = content.replace(
        "const [replyMessage, setReplyMessage] = useState('');",
        "const [replyMessage, setReplyMessage] = useState('');\n  const [replyMessages, setReplyMessages] = useState<Record<string, string>>({});"
    )

    # 2. Update the textarea block
    old_textarea_block = """{q.status === 'open' ? (
                            <div className="space-y-2 pt-2 border-t border-border">
                              <textarea
                                value={activeQueryId === q.id ? replyMessage : ''}
                                onChange={e => {
                                  setActiveQueryId(q.id);
                                  setReplyMessage(e.target.value);
                                }}
                                placeholder="Type your reply to resolve this query..."
                                className="w-full p-2 bg-background border border-border rounded-lg text-sm modern-input"
                                rows={2}
                              />
                              <button
                                onClick={async () => {
                                  if (!replyMessage) return;
                                  await replyToQuery(q.id, replyMessage);
                                  setReplyMessage('');
                                  setActiveQueryId(null);
                                  alert('Query marked as resolved and replied!');
                                }}
                                className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all"
                              >
                                Send Reply & Resolve
                              </button>
                            </div>
                          ) : ("""

    new_textarea_block = """{q.status === 'open' ? (
                            <div className="space-y-2 pt-2 border-t border-border">
                              <div className="flex flex-wrap gap-1 mb-2">
                                <button type="button" onClick={() => setReplyMessages(p => ({...p, [q.id]: "Dear Parent, we have received your query and are processing it. We will get back to you shortly."}))} className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors">Acknowledge</button>
                                <button type="button" onClick={() => setReplyMessages(p => ({...p, [q.id]: "The requested information has been sent to your registered email address."}))} className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors">Emailed Details</button>
                                <button type="button" onClick={() => setReplyMessages(p => ({...p, [q.id]: "Please visit the school administration office between 9 AM and 2 PM for further assistance."}))} className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors">Office Visit</button>
                                <button type="button" onClick={() => setReplyMessages(p => ({...p, [q.id]: "Your request has been approved and processed."}))} className="text-[10px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded hover:bg-emerald-500/20 transition-colors">Approved</button>
                              </div>
                              <textarea
                                value={replyMessages[q.id] || ''}
                                onChange={e => setReplyMessages(p => ({...p, [q.id]: e.target.value}))}
                                placeholder="Type your reply or click a quick response above..."
                                className="w-full p-2 bg-background border border-border rounded-lg text-sm modern-input focus:ring-2 focus:ring-primary/50"
                                rows={2}
                              />
                              <button
                                onClick={async () => {
                                  const msg = replyMessages[q.id];
                                  if (!msg) return;
                                  await replyToQuery(q.id, msg);
                                  setReplyMessages(p => { const np = {...p}; delete np[q.id]; return np; });
                                }}
                                className="px-4 py-1.5 bg-primary hover:bg-primary/90 text-white font-bold text-xs rounded-lg transition-all shadow-md"
                              >
                                Send Reply & Resolve
                              </button>
                            </div>
                          ) : ("""

    content = content.replace(old_textarea_block, new_textarea_block)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("UI Patch Quick Replies Complete.")

if __name__ == '__main__':
    update_queries_ui()

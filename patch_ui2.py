import re

def update_ui():
    path = 'frontend/src/pages/UnifiedDashboard.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update supportTickets Table 
    old_ticket = """<td className="p-3 text-right">
                                  {ticket.status === 'Open' ? (
                                    <button
                                      onClick={() => setReplyTicketId(ticket.id)}
                                      className="px-3 py-1 bg-primary text-white font-bold text-[10px] rounded hover:bg-primary/90"
                                    >
                                      Reply Resolution
                                    </button>
                                  ) : (
                                    <span className="text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                                      Resolved
                                    </span>
                                  )}
                                </td>"""

    new_ticket = """<td className="p-3 text-right">
                                  {ticket.status === 'Open' ? (
                                    <button
                                      onClick={() => setReplyTicketId(ticket.id)}
                                      className="px-3 py-1 bg-primary text-white font-bold text-[10px] rounded hover:bg-primary/90"
                                    >
                                      Reply Resolution
                                    </button>
                                  ) : (
                                    <div className="flex items-center justify-end gap-2">
                                      <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider border border-emerald-500/20">
                                        Resolved
                                      </span>
                                      <button onClick={() => setSupportTickets(prev => prev.filter(t => t.id !== ticket.id))} className="px-2 py-0.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-full font-bold text-[10px] hover:bg-red-500/20 transition-all" title="Delete Ticket">
                                        Del
                                      </button>
                                    </div>
                                  )}
                                </td>"""
    
    content = content.replace(old_ticket, new_ticket)

    # Make the row green if resolved
    content = content.replace(
        '<tr key={ticket.id} className="hover:bg-muted/10">',
        '<tr key={ticket.id} className={`hover:bg-muted/10 transition-colors ${ticket.status === \'Resolved\' ? \'bg-emerald-500/5\' : \'\'}`}>'
    )

    # 2. Update Notices Map
    old_notice = """{notices.map((not) => (
                      <div key={not.id} className="p-3 bg-card border border-border rounded-xl space-y-1">
                        <div className="flex justify-between items-start">
                          <strong className="text-sm text-foreground block font-bold">{not.title}</strong>
                          <span className="text-[10px] text-slate-500 font-mono">{not.date}</span>
                        </div>
                        <p className="text-xs text-foreground/70 leading-relaxed font-medium">{not.content}</p>
                      </div>
                    ))}"""
                    
    new_notice = """{notices.map((not) => (
                      <div key={not.id} className="p-3 bg-card border border-border rounded-xl space-y-1 relative group">
                        <div className="flex justify-between items-start">
                          <strong className="text-sm text-foreground block font-bold">{not.title}</strong>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-mono">{not.date}</span>
                            <button onClick={() => setNotices(prev => prev.filter(n => n.id !== not.id))} className="text-[10px] text-red-500 hover:bg-red-500/10 px-1.5 py-0.5 rounded font-bold transition-colors opacity-0 group-hover:opacity-100">Del</button>
                          </div>
                        </div>
                        <p className="text-xs text-foreground/70 leading-relaxed font-medium">{not.content}</p>
                      </div>
                    ))}"""
                    
    content = content.replace(old_notice, new_notice)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("UI Patch Phase 2 Complete.")

if __name__ == '__main__':
    update_ui()

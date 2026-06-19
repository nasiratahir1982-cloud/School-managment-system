import re

def update_ui():
    path = 'frontend/src/pages/UnifiedDashboard.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Parent Messages / Queries Store Hook
    content = content.replace(
        "const { queries: portal_queries, initialize: initQueries, replyToQuery } = useQueryStore();",
        "const { queries: portal_queries, initialize: initQueries, replyToQuery, deleteQuery } = useQueryStore();"
    )

    # 2. Parent Messages Loop - Add green border & Delete button
    old_query_div = """<div key={q.id} className="p-4 bg-muted/30 border border-border rounded-xl space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-foreground">{q.subject}</h4>
                                <span className="text-[10px] text-foreground/60">{new Date(q.createdAt).toLocaleString()}</span>
                              </div>
                              <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${q.status === 'open' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                                {q.status}
                              </span>
                            </div>"""

    new_query_div = """<div key={q.id} className={`p-4 bg-muted/30 border rounded-xl space-y-3 ${q.status === 'open' ? 'border-border' : 'border-emerald-500/40 bg-emerald-500/5'}`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold text-foreground">{q.subject}</h4>
                                <span className="text-[10px] text-foreground/60">{new Date(q.createdAt).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${q.status === 'open' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                                  {q.status}
                                </span>
                                <button onClick={() => deleteQuery(q.id)} className="text-[10px] px-2 py-1 rounded-full font-bold uppercase bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all border border-red-500/20" title="Delete Notice">
                                  Delete
                                </button>
                              </div>
                            </div>"""
    
    content = content.replace(old_query_div, new_query_div)

    # 3. Support Tickets (Help Desk) Delete button & Green Border
    old_ticket_div = """<div key={ticket.id} className="p-4 bg-card border border-border rounded-lg space-y-3 shadow-sm">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-bold text-sm text-foreground">{ticket.subject}</h4>"""

    new_ticket_div = """<div key={ticket.id} className={`p-4 bg-card border rounded-lg space-y-3 shadow-sm ${ticket.status === 'Resolved' ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-border'}`}>
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-bold text-sm text-foreground">{ticket.subject}</h4>"""

    content = content.replace(old_ticket_div, new_ticket_div)

    old_ticket_header = """<span className="text-xs text-foreground/60">{ticket.id} • {ticket.sender}</span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ticket.status === 'Open' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                      {ticket.status}
                                    </span>
                                  </div>"""
    
    new_ticket_header = """<span className="text-xs text-foreground/60">{ticket.id} • {ticket.sender}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${ticket.status === 'Open' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                        {ticket.status}
                                      </span>
                                      <button onClick={() => setSupportTickets(prev => prev.filter(t => t.id !== ticket.id))} className="px-2 py-0.5 bg-red-500/10 text-red-500 rounded text-[10px] font-bold hover:bg-red-500/20">
                                        Delete
                                      </button>
                                    </div>
                                  </div>"""
    content = content.replace(old_ticket_header, new_ticket_header)


    # 4. School Notices Add Delete Button
    old_notice = """<div key={notice.id} className="p-3 bg-card border border-border rounded-lg space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="font-bold text-sm text-foreground">{notice.title}</h4>
                              <span className="text-xs text-foreground/60">{notice.date}</span>
                            </div>"""
    new_notice = """<div key={notice.id} className="p-3 bg-card border border-border rounded-lg space-y-2">
                            <div className="flex justify-between items-center">
                              <h4 className="font-bold text-sm text-foreground">{notice.title}</h4>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-foreground/60">{notice.date}</span>
                                <button onClick={() => setNotices(prev => prev.filter(n => n.id !== notice.id))} className="text-[10px] text-red-500 hover:bg-red-500/10 px-1.5 py-0.5 rounded font-bold transition-colors">Del</button>
                              </div>
                            </div>"""
    content = content.replace(old_notice, new_notice)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

    print("Updated UI with delete buttons and green statuses")

if __name__ == '__main__':
    update_ui()

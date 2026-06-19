import re

def patch_cell_classes():
    path = 'frontend/src/pages/AcademicCalendar.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    old_logic_start = "      // Determine cell style\n      let cellClasses = 'w-full aspect-square flex flex-col items-center justify-center rounded-md text-[10px] relative transition-all duration-150 ';"
    old_logic_end = "      if (isSelected && !blocked) {\n        cellClasses += 'ring-2 ring-primary/60 bg-primary/15 ';\n      }"

    old_block = re.search(r"      // Determine cell style.*?if \(isSelected && !blocked\) \{\n        cellClasses \+= 'ring-2 ring-primary/60 bg-primary/15 ';\n      \}", content, re.DOTALL)
    
    new_logic = """      // Determine cell style
      let cellClasses = 'w-full aspect-square flex flex-col items-center justify-center rounded-md text-[10px] relative transition-all duration-150 ';

      if (isToday) {
        cellClasses += 'ring-2 ring-primary ring-offset-1 ring-offset-background font-black text-primary bg-primary/20 ';
      } else if (holiday) {
        cellClasses += 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 shadow-[inset_0_0_8px_rgba(244,63,94,0.1)] ';
      } else if (inset) {
        cellClasses += 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 shadow-[inset_0_0_8px_rgba(245,158,11,0.1)] ';
      } else if (events.length > 0) {
        const c = events[0].color;
        if(c.includes('purple')) cellClasses += 'bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30 shadow-[inset_0_0_8px_rgba(168,85,247,0.1)] ';
        else if(c.includes('rose') || c.includes('red')) cellClasses += 'bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30 shadow-[inset_0_0_8px_rgba(244,63,94,0.1)] ';
        else if(c.includes('emerald') || c.includes('green')) cellClasses += 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30 shadow-[inset_0_0_8px_rgba(16,185,129,0.1)] ';
        else if(c.includes('amber') || c.includes('yellow')) cellClasses += 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30 shadow-[inset_0_0_8px_rgba(245,158,11,0.1)] ';
        else if(c.includes('cyan')) cellClasses += 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30 shadow-[inset_0_0_8px_rgba(6,182,212,0.1)] ';
        else cellClasses += 'bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30 shadow-[inset_0_0_8px_rgba(59,130,246,0.1)] ';
      } else if (blocked) {
        cellClasses += 'opacity-25 text-muted-foreground cursor-default ';
      } else if (term && term.status !== 'Holiday') {
        cellClasses += 'text-foreground/80 font-medium hover:bg-primary/10 cursor-pointer ';
      } else {
        cellClasses += 'text-foreground/70 hover:bg-muted/30 cursor-pointer ';
      }

      if (isSelected) {
        cellClasses += 'ring-2 ring-primary/60 bg-primary/20 scale-105 z-10 ';
      }"""

    if old_block:
        content = content.replace(old_block.group(0), new_logic)

    # We also need to remove `!blocked && ` from the dots logic because we might have a holiday with an event 
    # But since holidays and events now have full backgrounds, maybe the dots are redundant for the primary event, 
    # but still good for multiple events. We'll leave them as is, just remove `!blocked` check so dots show on holidays if there's an event.
    content = content.replace("{!blocked && (events.length > 0 || inset) && (", "{(events.length > 0 || inset) && (")

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Cell styling patched successfully.")

if __name__ == '__main__':
    patch_cell_classes()

import re

def main():
    with open('frontend/src/pages/Login.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to replace the grid with flex and add the width to the button.
    # The grid container
    content = content.replace(
        '<div className="grid grid-cols-3 gap-2.5">',
        '<div className="flex flex-wrap justify-center gap-2.5">'
    )

    # The button class
    old_btn_class = 'className="flex flex-col items-center justify-center p-2.5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:bg-muted/40 text-foreground transition-all group active:scale-95 shadow-sm"'
    new_btn_class = 'className="w-[calc(33.333%-0.45rem)] flex flex-col items-center justify-center p-2.5 rounded-2xl bg-card border border-border hover:border-primary/50 hover:bg-muted/40 text-foreground transition-all group active:scale-95 shadow-sm"'
    
    content = content.replace(old_btn_class, new_btn_class)

    with open('frontend/src/pages/Login.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

    print("Successfully updated country alignment!")

if __name__ == '__main__':
    main()

import re

def update_file():
    with open('frontend/src/pages/UnifiedDashboard.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # The block we want to replace:
    old_block = """                            onChange={e => {
                              if (e.target.value === 'CUSTOM_MANUAL') setNewNoticeTitle('CUSTOM_MANUAL');
                              else setNewNoticeTitle(e.target.value);
                            }}"""
                            
    new_block = """                            onChange={e => {
                              const val = e.target.value;
                              if (val === 'CUSTOM_MANUAL') {
                                setNewNoticeTitle('CUSTOM_MANUAL');
                                setNewNoticeContent('');
                              } else {
                                setNewNoticeTitle(val);
                                const templates: Record<string, string> = {
                                  'General Announcement': 'Dear Students and Parents, \\n\\nPlease be informed that [Detail].\\n\\nRegards,\\nAdministration',
                                  'Fee Submission Reminder': 'Dear Parents, \\n\\nThis is a gentle reminder that the deadline for fee submission for the upcoming term is approaching. Please ensure all dues are cleared by [Date].\\n\\nRegards,\\nAccounts Department',
                                  'Upcoming Exams': 'Dear Students, \\n\\nThe mid-term examinations will commence from [Date]. The detailed date sheet has been published on your portal. Please ensure you prepare well.\\n\\nBest of Luck,\\nExamination Department',
                                  'Result Declaration': 'Dear Parents, \\n\\nThe final results for the academic session have been compiled. The result cards are now available on the parent portal.\\n\\nRegards,\\nAdministration',
                                  'Parent-Teacher Meeting': 'Dear Parents, \\n\\nA Parent-Teacher Meeting (PTM) has been scheduled for [Date] from [Time]. We highly encourage you to attend and discuss your child\\'s progress.\\n\\nRegards,\\nAdministration',
                                  'Holidays / Vacations': 'Dear Students and Parents, \\n\\nThe school will remain closed from [Start Date] to [End Date] on account of [Reason/Vacation]. Classes will resume on [Resume Date].\\n\\nRegards,\\nAdministration',
                                  'Event / Activity Notification': 'Dear Students, \\n\\nWe are excited to announce an upcoming [Event Name] on [Date]. All interested students are requested to register their names with their respective class teachers by [Deadline Date].\\n\\nRegards,\\nEvent Coordinator'
                                };
                                if (templates[val]) {
                                  setNewNoticeContent(templates[val]);
                                }
                              }
                            }}"""

    content = content.replace(old_block, new_block)

    with open('frontend/src/pages/UnifiedDashboard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Notices select element updated successfully.")

if __name__ == '__main__':
    update_file()

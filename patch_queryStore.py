import re

def update_query_store():
    path = 'frontend/src/store/queryStore.ts'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Add interface method
    content = content.replace(
        "replyToQuery: (id: string, replyMessage: string) => Promise<boolean>;",
        "replyToQuery: (id: string, replyMessage: string) => Promise<boolean>;\n  deleteQuery: (id: string) => Promise<boolean>;"
    )
    
    # 2. Add implementation
    delete_impl = """
  deleteQuery: async (id) => {
    try {
      const currentQueries = get().queries;
      const updatedQueries = currentQueries.filter(q => q.id !== id);
      
      const queriesMap = updatedQueries.reduce((acc, q) => {
        acc[q.id] = q;
        return acc;
      }, {} as Record<string, PortalQuery>);
      
      await updateRealtimeData('portal_queries', queriesMap);
      return true;
    } catch (e) {
      console.error("Failed to delete query:", e);
      return false;
    }
  }
}));"""
    content = content.replace("  }\n}));", "  }," + delete_impl)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Updated queryStore.ts")

if __name__ == '__main__':
    update_query_store()

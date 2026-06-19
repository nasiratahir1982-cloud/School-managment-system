import re

def fix_inventory_crud():
    path = 'frontend/src/pages/UnifiedDashboard.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add Asset
    old_add = """setInventory((prev: any[]) => [{
                        id: Date.now().toString(),
                        name: form.itemName.value,
                        category: form.itemCategory.value,
                        location: form.itemLocation.value,
                        qty: form.itemQty.value,
                        value: form.itemValue.value
                      }, ...prev]);"""
    new_add = """const currentInventory = schoolDb.inventory || [];
                      setInventory([{
                        id: Date.now().toString(),
                        name: form.itemName.value,
                        category: form.itemCategory.value,
                        location: form.itemLocation.value,
                        qty: form.itemQty.value,
                        value: form.itemValue.value
                      }, ...currentInventory]);"""
                      
    content = content.replace(old_add, new_add)

    # 2. Edit Asset
    old_edit = "setInventory((prev: any[]) => prev.map(i => i.id === editingInventoryId ? { ...i, ...editInventoryForm } : i));"
    new_edit = """const currentInventory = schoolDb.inventory || [];
                          setInventory(currentInventory.map((i: any) => i.id === editingInventoryId ? { ...i, ...editInventoryForm } : i));"""
    
    content = content.replace(old_edit, new_edit)

    # 3. Delete Asset
    old_delete = "setInventory((prev: any[]) => prev.filter(i => i.id !== item.id));"
    new_delete = """const currentInventory = schoolDb.inventory || [];
                                  setInventory(currentInventory.filter((i: any) => i.id !== item.id));"""
    
    content = content.replace(old_delete, new_delete)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Inventory CRUD successfully patched.")

if __name__ == '__main__':
    fix_inventory_crud()

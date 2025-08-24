import { useState, useRef, useEffect, useMemo } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import EmptyState from '../ui/EmptyState';
import Header from '../ui/Header';

import LinkModal from './LinkModal';
import ModuleCard from './ModuleCard';
import ModuleModal from './ModuleModal';
import UploadModal from './UploadModal';
import ModuleItem from './ModuleItem';

const CourseBuilder = () => {
  const [modules, setModules] = useState([]);
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Current items for editing and adding
  const [currentModule, setCurrentModule] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);

  // Outline state
  const moduleRefs = useRef({});
  const [activeModuleId, setActiveModuleId] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveModuleId(entry.target.id);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -50% 0px', threshold: 0 }
    );

    Object.values(moduleRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      Object.values(moduleRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [modules]);

  const handleAddClick = (type) => {
    switch (type) {
      case 'module':
        setCurrentModule(null);
        setIsModuleModalOpen(true);
        break;
      case 'link':
        setCurrentModuleId(null);
        setIsLinkModalOpen(true);
        break;
      case 'upload':
        setCurrentModuleId(null);
        setIsUploadModalOpen(true);
        break;
      default:
        break;
    }
  };

  const handleCloseModuleModal = () => {
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleCloseLinkModal = () => {
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleSaveModule = (module) => {
    if (currentModule) {
      setModules(modules.map((m) => (m.id === module.id ? module : m)));
    } else {
      setModules([...modules, module]);
    }
    setIsModuleModalOpen(false);
    setCurrentModule(null);
  };

  const handleEditModule = (module) => {
    setCurrentModule(module);
    setIsModuleModalOpen(true);
  };

  const handleDeleteModule = (moduleId) => {
    setModules(modules.filter((module) => module.id !== moduleId));
    setItems(items.filter((item) => item.moduleId !== moduleId));
  };

  const handleAddItem = (moduleId, type) => {
    setCurrentModuleId(moduleId);
    if (type === 'link') setIsLinkModalOpen(true);
    else if (type === 'file') setIsUploadModalOpen(true);
  };

  const handleSaveLink = (linkItem) => {
    setItems([...items, linkItem]);
    setIsLinkModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleSaveUpload = (fileItem) => {
    setItems([...items, fileItem]);
    setIsUploadModalOpen(false);
    setCurrentModuleId(null);
  };

  const handleDeleteItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const filteredModules = useMemo(() => {
    if (!searchQuery) return modules;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return modules.filter((module) => {
      if (module.name.toLowerCase().includes(lowerCaseQuery)) return true;
      return items.some(
        (item) =>
          item.moduleId === module.id && item.title.toLowerCase().includes(lowerCaseQuery)
      );
    });
  }, [modules, items, searchQuery]);

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    // Case 1: Reordering Modules
    if (active.id.startsWith('module-') && over.id.startsWith('module-')) {
      const activeId = active.id.replace('module-', '');
      const overId = over.id.replace('module-', '');

      const oldIndex = modules.findIndex(m => m.id === activeId);
      const newIndex = modules.findIndex(m => m.id === overId);

      setModules((items) => arrayMove(items, oldIndex, newIndex));
      return;
    }

    // Case 2: Moving or Reordering Items
    if (active.data.current?.type === 'item' && over.id.startsWith('module-')) {
        const itemId = active.id;
        const targetModuleId = over.id.replace('module-', '');
        
        // Find the item being dragged
        const draggedItem = items.find(item => item.id === itemId);

        // Update its moduleId
        setItems(prevItems => prevItems.map(item => 
          item.id === itemId ? { ...item, moduleId: targetModuleId } : item
        ));
        return;
    }

    // Case 3: Reordering items within a module
    if (active.id !== over.id && active.data.current?.type === 'item' && over.data.current?.type === 'item') {
      const activeItemModuleId = items.find(item => item.id === active.id)?.moduleId;
      const overItemModuleId = items.find(item => item.id === over.id)?.moduleId;

      // Moving to a different module
      if (activeItemModuleId !== overItemModuleId) {
        const updatedItems = items.map(item => 
          item.id === active.id ? { ...item, moduleId: overItemModuleId } : item
        );
        setItems(updatedItems);
      } else {
        // Reordering within the same module
        const activeIndex = items.findIndex(item => item.id === active.id);
        const overIndex = items.findIndex(item => item.id === over.id);

        setItems(prevItems => arrayMove(prevItems, activeIndex, overIndex));
      }
    }
  }

  return (
    <div className="app">
      <Header onAddClick={handleAddClick} onSearchChange={setSearchQuery} />

      <div style={{ display: 'flex' }}>
        {/* Main Content */}
        <div className="module-list" style={{ flex: 1 }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={handleDragEnd}
          >
            {items.some(item => !item.moduleId) && (
              <SortableContext
                items={items.filter(item => !item.moduleId).map(i => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="module-items-list">
                  {items.filter(item => !item.moduleId).map(item => (
                    <ModuleItem key={item.id} item={item} onDelete={handleDeleteItem} />
                  ))}
                </div>
              </SortableContext>
            )}
            {filteredModules.length === 0 && modules.length > 0 ? (
              <div className="empty-state">No matching modules or items found.</div>
            ) : filteredModules.length === 0 ? (
              <EmptyState />
            ) : (
              <SortableContext items={filteredModules.map(m => `module-${m.id}`)} strategy={verticalListSortingStrategy}>
                {filteredModules.map((module) => (
                  <div
                    key={module.id}
                    id={`module-${module.id}`}
                    ref={(el) => (moduleRefs.current[module.id] = el)}
                  >
                    <ModuleCard
                      module={module}
                      items={items}
                      onEdit={handleEditModule}
                      onDelete={handleDeleteModule}
                      onAddItem={handleAddItem}
                      onDeleteItem={handleDeleteItem}
                      active={activeModuleId === module.id}
                      highlight={
                        searchQuery &&
                        module.name.toLowerCase().includes(searchQuery.toLowerCase())
                      }
                    />
                  </div>
                ))}
              </SortableContext>
            )}
          </DndContext>
        </div>

        {/* Course Outline Sidebar */}
        {modules.length > 0 && (
          <div className="module-list" style={{ width: '280px', marginLeft: '24px' }}>
            <h3 className="module-title">Course Outline</h3>
            <ul>
              {modules.map((module) => (
                <li
                  key={module.id}
                  className={`module-subtitle ${
                    activeModuleId === module.id ? 'bg-blue-100 font-medium' : ''
                  }`}
                  onClick={() =>
                    moduleRefs.current[module.id]?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    })
                  }
                >
                  {module.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Modals */}
      <ModuleModal
        isOpen={isModuleModalOpen}
        onClose={handleCloseModuleModal}
        onSave={handleSaveModule}
        module={currentModule}
      />
      <LinkModal
        isOpen={isLinkModalOpen}
        onClose={handleCloseLinkModal}
        onSave={handleSaveLink}
        moduleId={currentModuleId}
      />
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={handleCloseUploadModal}
        onSave={handleSaveUpload}
        moduleId={currentModuleId}
      />
    </div>
  );
};

export default CourseBuilder;
import { useState } from 'react';
import ModuleItem from './ModuleItem';
import DeleteIcon from '../../assets/DeleteOutlined.svg';
import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ModuleCard = ({ module, onEdit, onDelete, items = [], onAddItem, onDeleteItem, active, highlight }) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddMenuOpen, setIsAddMenu] = useState(false);

  const moduleItems = items.filter(item => item.moduleId === module.id);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: `module-${module.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const toggleOptions = e => {
    e.stopPropagation();
    setIsOptionsOpen(!isOptionsOpen);
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEdit = () => {
    onEdit(module);
    setIsOptionsOpen(false);
  };

  const handleDelete = () => {
    onDelete(module.id);
    setIsOptionsOpen(false);
  };

  const toggleAddMenu = e => {
    e.stopPropagation();
    setIsAddMenu(!isAddMenuOpen);
  };

  const handleAddClick = type => {
    onAddItem(module.id, type);
    setIsAddMenu(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`module-card-container ${active ? 'module-content-expanded' : ''}`}
    >
      <div className="module-card" onClick={toggleExpanded}>
        <div className="module-content" {...listeners} {...attributes}>
          <div className={`icon ${isExpanded ? 'expanded' : ''}`}>▶</div>
          <div className="module-info">
            <h3 className={`module-title ${highlight ? 'bg-yellow-200' : ''}`}>{module.name}</h3>
            <p className="module-subtitle">
              {moduleItems.length === 0
                ? 'Add items to this module'
                : `${moduleItems.length} item${moduleItems.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
        <div className="module-actions">
          <button className="btn-options" onClick={toggleOptions}>
            ⋮
          </button>
          {isOptionsOpen && (
            <div className="options-menu">
              <button className="option-item" onClick={handleEdit}>
                <span>✏️</span> Edit module name
              </button>
              <button className="option-item delete" onClick={handleDelete}>
                <img src={DeleteIcon} alt="Delete" />
                      Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="module-content-expanded">
          {moduleItems.length === 0 ? (
            <div className="empty-module-content">
              <p>No content added to this module yet.</p>
              <div className="add-item-container">
                <button className="add-item-button" onClick={toggleAddMenu}>
                  <span>+</span> Add item
                </button>
                {isAddMenuOpen && (
                  <div className="add-item-menu">
                    <button className="add-item-option" onClick={() => handleAddClick('link')}>
                      <span>🔗</span> Add a link
                    </button>
                    <button className="add-item-option" onClick={() => handleAddClick('file')}>
                      <span>⬆️</span> Upload file
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <SortableContext
                items={moduleItems.map(item => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="module-items-list">
                  {moduleItems.map(item => (
                    <ModuleItem key={item.id} item={item} onDelete={onDeleteItem} />
                  ))}
                </div>
              </SortableContext>
              <div className="add-item-container">
                <button className="add-item-button" onClick={toggleAddMenu}>
                  <span>+</span> Add item
                </button>
                {isAddMenuOpen && (
                  <div className="add-item-menu">
                    <button className="add-item-option" onClick={() => handleAddClick('link')}>
                      <span>🔗</span> Add a link
                    </button>
                    <button className="add-item-option" onClick={() => handleAddClick('file')}>
                      <span>⬆️</span> Upload file
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
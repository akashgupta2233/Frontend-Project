import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import LinkColoredIcon from '../../assets/LinkColored.svg';
import PDFColoredIcon from '../../assets/PDFColored.svg';
import DeleteIcon from '../../assets/DeleteOutlined.svg';
import DragHandleOutlined from '../../assets/DragHandleOutlined.svg'; // Import the SVG

const ModuleItem = ({ item, onDelete }) => {
 const [isOptionsOpen, setIsOptionsOpen] = useState(false);

 const handleDelete = e => {
 e.stopPropagation();
 onDelete(item.id);
 };

 const toggleOptions = e => {
 e.stopPropagation();
 setIsOptionsOpen(!isOptionsOpen);
 };

 const getIcon = (type, fileName = '') => {
 if (type === 'link') {
 return (
 <div className="icon-wrapper link-icon">
 <img src={LinkColoredIcon} alt="Link" />
 </div>
 );
 }
 if (type === 'file') {
 const extension = fileName.split('.').pop().toLowerCase();
 if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
 return <span>🖼️</span>;
 }
 if (extension === 'pdf') {
 return (
 <div className="icon-wrapper pdf-icon">
 <img src={PDFColoredIcon} alt="PDF" />
 </div>
 );
 }
 if (['doc', 'docx'].includes(extension)) {
 return <span>📝</span>;
 }
 if (['xls', 'xlsx'].includes(extension)) {
 return <span>📊</span>;
 }
 if (['mp4', 'mov', 'webm'].includes(extension)) {
 return <span>🎬</span>;
 }
 if (['mp3', 'wav', 'ogg'].includes(extension)) {
 return <span>🎵</span>;
 }
 return <span>📁</span>;
 }
 return <span>❓</span>;
 };

 const {
 attributes,
 listeners,
 setNodeRef,
 transform,
 transition,
 isDragging,
 } = useSortable({
 id: item.id,
 data: {
 type: 'item',
 },
 });

 const style = {
 transform: CSS.Transform.toString(transform),
 transition,
 opacity: isDragging ? 0.5 : 1,
 };

 return (
 <div
 ref={setNodeRef}
 style={style}
 className="module-item"
 >
 {/* New drag handle outside the item-content */}
 <div className="drag-handle" {...attributes} {...listeners}>
 <img src={DragHandleOutlined} alt="Drag" className="drag-icon" />
 </div>
 <div className="item-content">
 <div className="item-icon">{getIcon(item.type, item.fileName)}</div>
 <div className="item-info">
 <h4 className="item-title">{item.title}</h4>
 {item.type === 'link' && (
 <a
 href={item.url}
 className="item-url"
 target="_blank"
 rel="noopener noreferrer"
 >
 {item.url}
 </a>
 )}
 {item.type === 'file' && (
 <p className="item-details">
 {item.fileName} ({Math.round(item.fileSize / 1024)} KB)
 </p>
 )}
 </div>
 </div>
 <div className="item-actions">
 <button className="btn-options" onClick={toggleOptions}>
 ⋮
 </button>
 {isOptionsOpen && (
 <div className="options-menu">
 <button className="option-item delete" onClick={handleDelete}>
 <img src={DeleteIcon} alt="Delete" />
 Delete
 </button>
 </div>
 )}
 </div>
 </div>
 );
};

export default ModuleItem;
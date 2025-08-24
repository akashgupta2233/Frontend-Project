import DeleteIcon from '../../assets/DeleteOutlined.svg';
import LinkColoredIcon from '../../assets/LinkColored.svg';
import PDFColoredIcon from '../../assets/PDFColored.svg';

const ModuleItem = ({ item, onDelete }) => {
  const handleDelete = e => {
    e.stopPropagation();
    onDelete(item.id);
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

  return (
    <div className="module-item">
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
      <button className="item-delete" onClick={handleDelete}>
        <img src={DeleteIcon} alt="Delete" />
      </button>
    </div>
  );
};

export default ModuleItem;

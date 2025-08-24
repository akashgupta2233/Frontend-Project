import { useState, useRef, useEffect } from 'react';
import SinglePointRubricSVG from '../../assets/SinglePointRubric.svg';
import UploadOutlinedSVG from '../../assets/UploadOutlined.svg';
import LinkOutlinedSVG from '../../assets/LinkOutlined.svg';
import SearchOutlinedSVG from '../../assets/SearchOutlined.svg';

const Header = ({ onAddClick, onSearchChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const handleAddClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleCreateModule = () => {
    onAddClick('module');
    setIsDropdownOpen(false);
  };

  const handleAddLink = () => {
    onAddClick('link');
    setIsDropdownOpen(false);
  };

  const handleUpload = () => {
    onAddClick('upload');
    setIsDropdownOpen(false);
  };

  return (
    <div className="header">
      <h1 className="header-title">Course builder</h1>
      <div className="header-right">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
            onChange={e => onSearchChange(e.target.value)}
          />
          <img src={SearchOutlinedSVG} alt="Search" className="search-icon" />
        </div>
        <div className="dropdown-container" ref={dropdownRef}>
          <button className="add-button" onClick={handleAddClick}>
            <span className="add-icon">+</span> Add
            <span className="dropdown-arrow">▾</span>
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={handleCreateModule}>
                <span className="item-icon">
                    <img src={SinglePointRubricSVG} alt="Single Point Rubric" className="w-5 h-5" />
                </span>

                <span>Create module</span>
              </button>
              <button className="dropdown-item" onClick={handleAddLink}>
                <span className="item-icon">
                      <img src={LinkOutlinedSVG} alt="Link" className="w-5 h-5" />
                </span>

                <span>Add a link</span>
              </button>
              <button className="dropdown-item" onClick={handleUpload}>
                <span className="item-icon">
                      <img src={UploadOutlinedSVG} alt="Upload" className="w-5 h-5" />
                </span>

                <span>Upload file</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;

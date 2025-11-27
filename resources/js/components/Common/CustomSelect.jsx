import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.css';

const CustomSelect = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = 'Pilih...', 
  disabled = false,
  required = false,
  className = '',
  error = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setTimeout(() => inputRef.current?.focus(), 0);
      }
    }
  };

  const displayValue = value || placeholder;
  const isPlaceholder = !value;

  return (
    <div 
      className={`${styles.customSelect} ${className} ${disabled ? styles.disabled : ''} ${error ? styles.error : ''}`}
      ref={dropdownRef}
    >
      <div 
        className={`${styles.selectTrigger} ${isOpen ? styles.open : ''}`}
        onClick={toggleDropdown}
      >
        <span className={`${styles.selectedValue} ${isPlaceholder ? styles.placeholder : ''}`}>
          {displayValue}
        </span>
        <svg 
          className={`${styles.arrowIcon} ${isOpen ? styles.rotate : ''}`}
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.length > 8 && (
            <div className={styles.searchBox}>
              <svg 
                className={styles.searchIcon}
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari..."
                className={styles.searchInput}
              />
            </div>
          )}
          
          <div className={styles.optionsList}>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  className={`${styles.option} ${option === value ? styles.selected : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  <span>{option}</span>
                  {option === value && (
                    <svg 
                      className={styles.checkIcon}
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
              ))
            ) : (
              <div className={styles.noResults}>Tidak ada hasil</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;

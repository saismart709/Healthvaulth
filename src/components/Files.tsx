import React, { useState } from 'react';
import { HealthFile } from '../types';
import { formatDate } from '../utils';

interface FilesProps {
  onOpenModal: (id: string) => void;
  files: HealthFile[];
  onDeleteFile: (id: string) => void;
}

export const Files: React.FC<FilesProps> = ({ onOpenModal, files, onDeleteFile }) => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFiles = files.filter(f => {
    const matchesFilter = filter === 'All' || f.category === filter;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         f.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filters = ['All', 'Lab Report', 'Prescription', 'Imaging', 'Insurance', 'Other'];

  return (
    <>
      <div className="page-head flex items-start justify-between mb-6">
        <div>
          <div className="page-title text-[22px] font-extrabold tracking-tight">File Manager</div>
          <div className="page-subtitle text-[13px] text-text-2 mt-0.5">{files.length} files stored securely</div>
        </div>
        <div className="page-actions flex gap-2">
          <button className="btn btn-primary bg-primary text-white px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(0,102,255,0.3)] hover:bg-primary-dark hover:shadow-[0_4px_14px_rgba(0,102,255,0.4)] transition-all" onClick={() => onOpenModal('modal-upload')}>📤 Upload File</button>
        </div>
      </div>
      
      <div className="upload-zone border-2 border-dashed border-border-custom rounded-xl p-9 text-center cursor-pointer transition-all bg-white mb-4 hover:border-primary hover:bg-primary-bg group" onClick={() => onOpenModal('modal-upload')}>
        <div className="upload-icon text-4xl mb-3 group-hover:scale-110 transition-transform">📁</div>
        <div className="upload-title text-[15px] font-bold mb-1.5">Drop files here or <span className="text-primary hover:underline">browse</span></div>
        <div className="upload-sub text-xs text-text-3">Supports PDF, JPG, PNG, DOC · Max 50MB · Encrypted storage</div>
      </div>
      
      <div className="file-toolbar flex flex-col sm:flex-row items-center gap-2.5 mb-4">
        <div className="file-search flex-1 max-w-full sm:max-w-[300px] flex items-center gap-2 bg-white border border-border-custom rounded-lg px-3.5 py-2">
          <span>🔍</span>
          <input 
            type="text" 
            placeholder="Search files..." 
            className="border-none bg-transparent text-[13px] text-text-custom outline-none w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="file-filters flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {filters.map(f => (
            <button
              key={f}
              className={`filter-btn whitespace-nowrap px-3.5 py-1.5 rounded-lg border-1.5 border-border-custom text-xs font-semibold transition-all ${filter === f ? 'active border-primary text-primary bg-primary-bg' : 'bg-white text-text-2 hover:border-primary hover:text-primary'}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      
      <div className="files-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
        {filteredFiles.map(f => {
          const icons = { pdf: '📄', img: '🖼️' };
          const typeClass = { pdf: 'bg-red-50', img: 'bg-teal-50', doc: 'bg-blue-50' }[f.type] || 'bg-gray-50';
          return (
            <div key={f.id} className="file-card bg-white rounded-xl border-1.5 border-border-custom p-4 cursor-pointer transition-all hover:border-primary hover:shadow-lg">
              <div className={`file-icon-wrap w-11 h-11 rounded-lg flex items-center justify-center text-2xl mb-3 ${typeClass}`}>
                {icons[f.type as keyof typeof icons] || '📁'}
              </div>
              <div className="file-name text-[13px] font-bold truncate mb-1" title={f.name}>{f.name}</div>
              <div className="file-meta text-[11px] text-text-3">{f.category} · {f.size}</div>
              <div className="file-meta text-[11px] text-text-3 mt-1">{formatDate(f.uploaded)}</div>
              <div className="file-actions flex gap-1 mt-3">
                <button className="file-action-btn flex-1 py-1.5 rounded-md border border-border-custom bg-bg-custom text-[11px] font-semibold text-text-2 hover:border-primary hover:text-primary hover:bg-primary-bg transition-all">👁 View</button>
                <button className="file-action-btn flex-1 py-1.5 rounded-md border border-border-custom bg-bg-custom text-[11px] font-semibold text-text-2 hover:border-primary hover:text-primary hover:bg-primary-bg transition-all">⬇</button>
                <button 
                  className="file-action-btn py-1.5 px-2 rounded-md border border-border-custom bg-bg-custom text-[11px] font-semibold text-text-2 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all"
                  onClick={(e) => { e.stopPropagation(); onDeleteFile(f.id); }}
                >
                  🗑
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

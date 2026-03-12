'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, Upload, Plus, Loader2, BookOpen, Edit2, Trash2, XCircle, RotateCcw } from 'lucide-react';
import styles from './page.module.css';
import { toast } from '@/stores/toastStore';

interface RagDocument {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function RagManagementPage() {
  const [documents, setDocuments] = useState<RagDocument[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch documents on load
  const fetchDocuments = async () => {
    try {
      setFetching(true);
      const res = await fetch('/api/agent/rag');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    try {
      setLoading(true);
      const url = editingId ? `/api/agent/rag/${editingId}` : '/api/agent/rag';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
      });

      if (res.ok) {
        handleCancel(); // Reset form
        toast.success(editingId ? '문서가 성공적으로 수정되었습니다.' : '문서가 성공적으로 저장되었습니다.');
        fetchDocuments();
      } else {
        toast.error('저장 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doc: RagDocument) => {
    setEditingId(doc.id);
    setTitle(doc.title);
    setContent(doc.content);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 문서를 삭제하시겠습니까? 삭제된 정보는 AI가 더 이상 참조할 수 없습니다.')) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/agent/rag/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('문서가 삭제되었습니다.');
        fetchDocuments();
        if (editingId === id) handleCancel();
      } else {
        toast.error('삭제 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  const processFile = (file: File) => {
    if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
      toast.warning('순수 텍스트(.txt) 파일만 업로드할 수 있습니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setContent(text);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>RAG 문서 관리</h1>

      <div className={styles.layout}>
        {/* List Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            <BookOpen size={20} />
            저장된 지식 문서
          </h2>
          
          <div className={styles.list}>
            {fetching ? (
              <div className={styles.emptyState}>
                <Loader2 className="animate-spin" size={24} />
                <p>로딩 중...</p>
              </div>
            ) : documents.length === 0 ? (
              <div className={styles.emptyState}>
                <p>저장된 문서가 없습니다.</p>
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className={`${styles.listItem} ${editingId === doc.id ? styles.active : ''}`}>
                  <div className={styles.itemHeader}>
                    <div className={styles.itemTitle}>{doc.title}</div>
                    <div className={styles.itemActions}>
                      <button 
                        className={`${styles.actionBtn} ${styles.editBtn}`}
                        onClick={() => handleEdit(doc)}
                        title="수정"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => handleDelete(doc.id)}
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className={styles.itemMeta}>
                    {new Date(doc.created_at).toLocaleString()}
                  </div>
                  <div className={styles.itemPreview}>{doc.content}</div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Form Section */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
            {editingId ? '지식 문서 수정' : '새 지식 등록'}
          </h2>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div 
              className={`${styles.fileDropZone} ${isDragging ? styles.dragging : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload size={32} />
              <p>텍스트 파일을 드래그하거나 클릭하여 업로드</p>
              <span className={styles.itemMeta}>.txt 파일 지원</span>
              <input 
                type="file" 
                hidden 
                accept=".txt" 
                ref={fileInputRef} 
                onChange={handleFileUpload}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>문서 제목</label>
              <input 
                className={styles.input}
                type="text" 
                placeholder="문서의 제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>지식 본문 (순수 텍스트)</label>
              <textarea 
                className={`${styles.input} ${styles.textarea}`}
                placeholder="지식으로 활용될 텍스트를 입력하거나 파일을 업로드하세요."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>

            <div className={styles.buttonGroup}>
              {editingId && (
                <button 
                  className={styles.cancelBtn} 
                  type="button"
                  onClick={handleCancel}
                >
                  <RotateCcw size={20} />
                  취소
                </button>
              )}
              <button 
                className={styles.submitBtn} 
                type="submit"
                disabled={loading || !title || !content}
                style={editingId ? { gridColumn: 'span 1' } : { gridColumn: 'span 2' } as any}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
                {editingId ? '변경사항 저장' : '저장 및 임베딩 실행'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

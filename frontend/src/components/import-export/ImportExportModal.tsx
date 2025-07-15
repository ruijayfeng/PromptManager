import React, { useState, useRef } from 'react'
import { Download, Upload, FileText, Code, X, AlertCircle, CheckCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { exportApi } from '../../services/api'
import { useToastStore } from '../../stores/toast'
import { Prompt } from '../../types/api'

interface ImportExportModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPrompts?: Prompt[]
  onImportSuccess?: () => void
}

export const ImportExportModal: React.FC<ImportExportModalProps> = ({
  isOpen,
  onClose,
  selectedPrompts = [],
  onImportSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export')
  const [exportFormat, setExportFormat] = useState<'json' | 'markdown'>('json')
  const [importFormat, setImportFormat] = useState<'json' | 'markdown'>('json')
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { success, error } = useToastStore()

  if (!isOpen) return null

  const handleExport = async () => {
    try {
      const promptIds = selectedPrompts.length > 0 
        ? selectedPrompts.map(p => p.id) 
        : undefined
      
      await exportApi.exportPrompts(exportFormat, promptIds)
      
      const count = selectedPrompts.length || '全部'
      success(`成功导出 ${count} 个提示词 (${exportFormat.toUpperCase()} 格式)`)
      onClose()
    } catch (err) {
      error('导出失败，请稍后重试')
    }
  }

  const handleFileSelect = (file: File) => {
    handleImport(file)
  }

  const handleImport = async (file: File) => {
    if (!file) return

    // 验证文件类型
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (importFormat === 'json' && fileExtension !== 'json') {
      error('请选择 JSON 格式的文件')
      return
    }
    if (importFormat === 'markdown' && !['md', 'markdown'].includes(fileExtension || '')) {
      error('请选择 Markdown 格式的文件')
      return
    }

    try {
      setUploading(true)
      const response = await exportApi.importPrompts(file, importFormat)
      success(`导入成功！共导入 ${response.data.imported_count} 个提示词`)
      onImportSuccess?.()
      onClose()
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || '导入失败，请检查文件格式'
      error(errorMessage)
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75" />
        </div>

        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                导入/导出提示词
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* 标签页 */}
            <div className="mt-4 flex space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('export')}
                className={clsx(
                  'flex-1 flex items-center justify-center py-2 px-3 text-sm font-medium rounded-md transition-colors',
                  activeTab === 'export'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                )}
              >
                <Download className="h-4 w-4 mr-2" />
                导出
              </button>
              <button
                onClick={() => setActiveTab('import')}
                className={clsx(
                  'flex-1 flex items-center justify-center py-2 px-3 text-sm font-medium rounded-md transition-colors',
                  activeTab === 'import'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                )}
              >
                <Upload className="h-4 w-4 mr-2" />
                导入
              </button>
            </div>
          </div>

          <div className="px-6 py-4">
            {activeTab === 'export' ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    导出范围
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedPrompts.length > 0 
                      ? `已选择 ${selectedPrompts.length} 个提示词` 
                      : '将导出所有提示词'
                    }
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                    选择导出格式
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setExportFormat('json')}
                      className={clsx(
                        'p-4 border-2 rounded-lg transition-colors',
                        exportFormat === 'json'
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      )}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Code className="h-8 w-8 text-orange-500" />
                        <div className="text-center">
                          <div className="font-medium text-gray-900 dark:text-gray-100">JSON</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            结构化数据，保留完整信息
                          </div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setExportFormat('markdown')}
                      className={clsx(
                        'p-4 border-2 rounded-lg transition-colors',
                        exportFormat === 'markdown'
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      )}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <FileText className="h-8 w-8 text-orange-500" />
                        <div className="text-center">
                          <div className="font-medium text-gray-900 dark:text-gray-100">Markdown</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            人类可读格式，便于分享
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <div className="font-medium mb-1">格式说明：</div>
                      <ul className="space-y-1 text-xs">
                        <li>• JSON: 包含完整的元数据，支持完美还原导入</li>
                        <li>• Markdown: 适合阅读和分享，部分元数据可能丢失</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                    选择导入格式
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setImportFormat('json')}
                      className={clsx(
                        'p-3 border-2 rounded-lg transition-colors',
                        importFormat === 'json'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <Code className="h-5 w-5 text-blue-500" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">JSON</span>
                      </div>
                    </button>

                    <button
                      onClick={() => setImportFormat('markdown')}
                      className={clsx(
                        'p-3 border-2 rounded-lg transition-colors',
                        importFormat === 'markdown'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      )}
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">Markdown</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 文件上传区域 */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={openFileDialog}
                  className={clsx(
                    'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                    dragActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  )}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-600 dark:text-gray-400">
                    <p className="font-medium">点击选择文件或拖拽到此处</p>
                    <p className="text-sm mt-1">
                      支持 {importFormat === 'json' ? '.json' : '.md, .markdown'} 格式
                    </p>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept={importFormat === 'json' ? '.json' : '.md,.markdown'}
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-700 dark:text-green-300">
                      <div className="font-medium mb-1">导入说明：</div>
                      <ul className="space-y-1 text-xs">
                        <li>• 导入会自动创建不存在的分类和标签</li>
                        <li>• 重复的提示词不会被覆盖</li>
                        <li>• 导入过程中如有错误会显示详细信息</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
            >
              取消
            </button>
            
            {activeTab === 'export' && (
              <button
                onClick={handleExport}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <Download className="h-4 w-4 mr-1 inline" />
                导出 {exportFormat.toUpperCase()}
              </button>
            )}
          </div>

          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-900 dark:text-gray-100">正在导入...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
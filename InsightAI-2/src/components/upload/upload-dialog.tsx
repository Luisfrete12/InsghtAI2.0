import { useState, useCallback } from 'react'; // Importa hooks de estado e callback do React
import { useDropzone } from 'react-dropzone'; // Importa hook para área de drop de arquivos
import { useTranslation } from 'react-i18next'; // Importa hook para internacionalização
import { Upload, FileText, X, AlertCircle } from 'lucide-react'; // Importa ícones SVG
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'; // Importa componentes de diálogo
import { Button } from '../ui/button'; // Importa componente de botão
import { Progress } from '../ui/progress'; // Importa componente de barra de progresso
import { useUploadDataset } from '../../api/hooks'; // Importa hook para upload de datasets
import { useUIStore } from '../../store/ui'; // Importa hook para manipulação do estado global da UI
import { formatBytes } from '../../lib/utils'; // Importa função utilitária para formatar bytes
import Papa from 'papaparse'; // Importa biblioteca para parse de CSV

// Define as propriedades aceitas pelo componente UploadDialog
interface UploadDialogProps {
  open: boolean; // Indica se o diálogo está aberto
  onOpenChange: (open: boolean) => void; // Função chamada ao abrir/fechar o diálogo
  onSuccess: () => void; // Função chamada após upload bem-sucedido
}

// Interface para arquivos com preview gerado
interface FileWithPreview extends File {
  preview?: {
    columns: string[]; // Colunas do arquivo (para preview)
    rows: string[][];  // Linhas do arquivo (para preview)
    totalRows: number; // Total de linhas no arquivo
  };
}

// Componente funcional UploadDialog
export function UploadDialog({ open, onOpenChange, onSuccess }: UploadDialogProps) {
  const { t } = useTranslation(); // Hook para traduções
  const { addNotification } = useUIStore(); // Função para adicionar notificações
  const uploadMutation = useUploadDataset(); // Hook para upload de datasets
  
  const [files, setFiles] = useState<FileWithPreview[]>([]); // Estado para arquivos selecionados
  const [uploadProgress, setUploadProgress] = useState(0); // Estado para progresso do upload
  const [isUploading, setIsUploading] = useState(false); // Estado para indicar se está enviando arquivos
  const [uploadController, setUploadController] = useState<AbortController | null>(null); // Estado para controlar cancelamento do upload

  // Define o tamanho máximo do arquivo (em bytes), padrão 50MB
  const maxSize = parseInt(import.meta.env.VITE_UPLOAD_MAX_MB || '50') * 1024 * 1024;

  // Função chamada ao soltar arquivos na área de drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const processedFiles: FileWithPreview[] = [];

    for (const file of acceptedFiles) {
      // Verifica se o arquivo excede o tamanho máximo
      if (file.size > maxSize) {
        addNotification({
          type: 'error',
          title: t('dataset.fileTooLarge'),
          message: `File ${file.name} is larger than ${formatBytes(maxSize)}`,
        });
        continue;
      }

      let fileWithPreview: FileWithPreview = file;

      // Gera preview para arquivos CSV
      if (file.type === 'text/csv') {
        try {
          const text = await file.text();
          const result = Papa.parse(text, {
            header: false,
            preview: 100, // Faz preview das 100 primeiras linhas
          });

          if (result.data && result.data.length > 0) {
            const rows = result.data as string[][];
            const columns = rows[0] || [];
            
            fileWithPreview.preview = {
              columns,
              rows: rows.slice(0, 10), // Mostra as 10 primeiras linhas no preview
              totalRows: result.data.length,
            };
          }
        } catch (error) {
          console.error('CSV preview error:', error);
        }
      }

      // Gera preview para arquivos JSON
      if (file.type === 'application/json') {
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          
          if (Array.isArray(data) && data.length > 0) {
            const firstItem = data[0];
            const columns = Object.keys(firstItem);
            const rows = data.slice(0, 10).map(item => 
              columns.map(col => String(item[col] || ''))
            );
            
            fileWithPreview.preview = {
              columns,
              rows,
              totalRows: data.length,
            };
          }
        } catch (error) {
          console.error('JSON preview error:', error);
        }
      }

      processedFiles.push(fileWithPreview);
    }

    setFiles(processedFiles); // Atualiza o estado com os arquivos processados
  }, [maxSize, addNotification, t]);

  // Configurações do hook useDropzone para área de drop de arquivos
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
    },
    multiple: true,
    maxSize,
  });

  // Remove um arquivo da lista pelo índice
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Função para iniciar o upload dos arquivos
  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const controller = new AbortController();
    setUploadController(controller);

    try {
      // Faz upload de cada arquivo individualmente
      for (const file of files) {
        await uploadMutation.mutateAsync({
          file,
          onProgress: (progress) => {
            setUploadProgress(progress.percentage); // Atualiza progresso
          },
          signal: controller.signal, // Permite cancelar upload
        });
      }

      // Notifica sucesso
      addNotification({
        type: 'success',
        title: t('dataset.uploadSuccess'),
        message: `Successfully uploaded ${files.length} file${files.length > 1 ? 's' : ''}`,
      });

      onSuccess(); // Chama callback de sucesso
      handleClose(); // Fecha o diálogo
    } catch (error) {
      // Notifica erro, exceto se for cancelamento
      if (error instanceof Error && error.message !== 'Upload cancelled') {
        addNotification({
          type: 'error',
          title: t('dataset.uploadError'),
          message: error.message,
        });
      }
    } finally {
      setIsUploading(false);
      setUploadController(null);
      setUploadProgress(0);
    }
  };

  // Função para cancelar upload e fechar diálogo
  const handleCancel = () => {
    if (uploadController) {
      uploadController.abort();
    }
    handleClose();
  };

  // Função para fechar o diálogo e resetar estados
  const handleClose = () => {
    if (!isUploading) {
      setFiles([]);
      setUploadProgress(0);
      onOpenChange(false);
    }
  };

  return (
    // Componente Dialog que controla a abertura/fechamento do modal
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>{t('dataset.upload')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Exibe área de drop e lista de arquivos se não estiver enviando */}
          {!isUploading && (
            <>
              {/* Área de drop para arquivos */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragActive
                    ? 'border-primary bg-primary/10'
                    : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    {isDragActive
                      ? 'Drop files here'
                      : t('dataset.dragDropText')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t('dataset.supportedFormats')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('dataset.maxFileSize', { size: formatBytes(maxSize).split(' ')[0] })}
                  </p>
                </div>
              </div>

              {/* Lista de arquivos selecionados */}
              {files.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Selected Files</h3>
                  {files.map((file, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatBytes(file.size)} • {file.type}
                            </p>
                          </div>
                        </div>
                        {/* Botão para remover arquivo */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Preview do arquivo, se disponível */}
                      {file.preview && (
                        <div className="mt-3 p-3 bg-muted rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium">Preview</span>
                            <span className="text-xs text-muted-foreground">
                              ({file.preview.totalRows} rows, {file.preview.columns.length} columns)
                            </span>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="text-xs w-full">
                              <thead>
                                <tr className="border-b">
                                  {/* Exibe até 6 colunas no preview */}
                                  {file.preview.columns.slice(0, 6).map((col, i) => (
                                    <th key={i} className="text-left p-1 font-medium">
                                      {col}
                                    </th>
                                  ))}
                                  {/* Indica se há mais colunas */}
                                  {file.preview.columns.length > 6 && (
                                    <th className="text-left p-1 text-muted-foreground">
                                      +{file.preview.columns.length - 6} more...
                                    </th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {/* Exibe até 3 linhas no preview */}
                                {file.preview.rows.slice(0, 3).map((row, i) => (
                                  <tr key={i} className="border-b">
                                    {row.slice(0, 6).map((cell, j) => (
                                      <td key={j} className="p-1 truncate max-w-[100px]">
                                        {cell}
                                      </td>
                                    ))}
                                    {/* Indica se há mais colunas na linha */}
                                    {row.length > 6 && <td className="p-1">...</td>}
                                  </tr>
                                ))}
                                {/* Indica se há mais linhas no arquivo */}
                                {file.preview.rows.length > 3 && (
                                  <tr>
                                    <td colSpan={Math.min(7, file.preview.columns.length)} className="p-1 text-center text-muted-foreground">
                                      ... and {file.preview.totalRows - 3} more rows
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Barra de progresso durante upload */}
          {isUploading && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="font-medium">Uploading files...</p>
                <p className="text-sm text-muted-foreground">
                  Please don't close this dialog
                </p>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-center">{uploadProgress}% complete</p>
            </div>
          )}

          {/* Botões de ação */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleCancel}>
              {isUploading ? 'Cancel' : 'Close'}
            </Button>
            {/* Botão de upload só aparece se houver arquivos e não estiver enviando */}
            {!isUploading && files.length > 0 && (
              <Button onClick={handleUpload} disabled={uploadMutation.isPending}>
                Upload {files.length} file{files.length > 1 ? 's' : ''}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
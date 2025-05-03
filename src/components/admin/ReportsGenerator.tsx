
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  FileText, 
  Download, 
  FilePieChart, 
  File, 
  FileSpreadsheet, 
  Loader2,
  CheckCircle2
} from "lucide-react";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  formats: string[];
  periodRequired?: boolean;
  parameters?: Array<{
    id: string;
    name: string;
    type: 'text' | 'number' | 'select' | 'checkbox' | 'date';
    options?: Array<{ value: string; label: string }>;
    default?: any;
  }>;
}

interface ReportsGeneratorProps {
  onGenerateReport?: (reportData: any) => Promise<void>;
}

export default function ReportsGenerator({ onGenerateReport }: ReportsGeneratorProps) {
  // Состояние для отслеживания выбранного типа отчета
  const [selectedReportType, setSelectedReportType] = useState<string>("");
  const [reportFormat, setReportFormat] = useState<string>("pdf");
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: format(new Date(new Date().setDate(1)), 'yyyy-MM-dd'),
    to: format(new Date(), 'yyyy-MM-dd')
  });
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isGenerated, setIsGenerated] = useState<boolean>(false);

  // Доступные типы отчетов
  const reportTypes: ReportType[] = [
    {
      id: "sales",
      name: "Отчет по продажам",
      description: "Статистика продаж за выбранный период с фильтрацией по категориям и товарам",
      icon: <FilePieChart className="h-5 w-5" />,
      formats: ["pdf", "xlsx", "csv"],
      periodRequired: true,
      parameters: [
        {
          id: "productCategory",
          name: "Категория товаров",
          type: "select",
          options: [
            { value: "all", label: "Все категории" },
            { value: "chocolate", label: "Шоколадные" },
            { value: "fruit", label: "Фруктовые" },
            { value: "classic", label: "Классические" },
            { value: "wedding", label: "Свадебные" },
            { value: "children", label: "Детские" }
          ],
          default: "all"
        },
        {
          id: "includeDiscounts",
          name: "Учитывать скидки",
          type: "checkbox",
          default: true
        },
        {
          id: "groupBy",
          name: "Группировать по",
          type: "select",
          options: [
            { value: "day", label: "Дням" },
            { value: "week", label: "Неделям" },
            { value: "month", label: "Месяцам" }
          ],
          default: "day"
        }
      ]
    },
    {
      id: "inventory",
      name: "Отчет по складу",
      description: "Текущие остатки товаров на складе с уровнем запасов",
      icon: <FileText className="h-5 w-5" />,
      formats: ["pdf", "xlsx"],
      parameters: [
        {
          id: "showLowStock",
          name: "Показывать только товары с низким запасом",
          type: "checkbox",
          default: false
        },
        {
          id: "includeCost",
          name: "Включать себестоимость",
          type: "checkbox",
          default: false
        }
      ]
    },
    {
      id: "customers",
      name: "Анализ клиентов",
      description: "Статистика по клиентам, частоте заказов и среднему чеку",
      icon: <FileSpreadsheet className="h-5 w-5" />,
      formats: ["pdf", "xlsx", "csv"],
      periodRequired: true,
      parameters: [
        {
          id: "customerSegment",
          name: "Сегмент клиентов",
          type: "select",
          options: [
            { value: "all", label: "Все клиенты" },
            { value: "regular", label: "Постоянные" },
            { value: "new", label: "Новые" },
            { value: "inactive", label: "Неактивные" }
          ],
          default: "all"
        },
        {
          id: "includePersonalData",
          name: "Включать персональные данные",
          type: "checkbox",
          default: false
        }
      ]
    },
    {
      id: "finance",
      name: "Финансовый отчет",
      description: "Доходы, расходы и прибыль за выбранный период",
      icon: <File className="h-5 w-5" />,
      formats: ["pdf", "xlsx"],
      periodRequired: true,
      parameters: [
        {
          id: "includeVAT",
          name: "Учитывать НДС",
          type: "checkbox",
          default: true
        },
        {
          id: "detailLevel",
          name: "Уровень детализации",
          type: "select",
          options: [
            { value: "summary", label: "Сводный" },
            { value: "detailed", label: "Детальный" },
            { value: "transactions", label: "По транзакциям" }
          ],
          default: "summary"
        }
      ]
    }
  ];

  // Текущий выбранный тип отчета
  const currentReport = reportTypes.find(report => report.id === selectedReportType);

  // Инициализация параметров при выборе отчета
  const initializeParameters = (report: ReportType) => {
    const initialParams: Record<string, any> = {};
    report.parameters?.forEach(param => {
      initialParams[param.id] = param.default;
    });
    setParameters(initialParams);
  };

  // Обработчик изменения типа отчета
  const handleReportTypeChange = (reportId: string) => {
    setSelectedReportType(reportId);
    const report = reportTypes.find(r => r.id === reportId);
    if (report) {
      initializeParameters(report);
      
      // Установить формат по умолчанию на первый доступный
      if (report.formats.length > 0) {
        setReportFormat(report.formats[0]);
      }
    }
    setIsGenerated(false);
  };

  // Обработчик изменения параметра
  const handleParameterChange = (paramId: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [paramId]: value
    }));
  };

  // Форматирование даты для отображения
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: ru });
    } catch (e) {
      return dateString;
    }
  };

  // Генерация отчета
  const handleGenerateReport = async () => {
    if (!currentReport) return;
    
    setIsGenerating(true);
    
    try {
      // Подготовка данных отчета
      const reportData = {
        type: selectedReportType,
        format: reportFormat,
        dateRange: currentReport.periodRequired ? dateRange : undefined,
        parameters
      };
      
      // Вызов обработчика генерации отчета
      if (onGenerateReport) {
        await onGenerateReport(reportData);
      } else {
        // Имитация генерации отчета
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      setIsGenerated(true);
    } catch (error) {
      console.error('Ошибка при генерации отчета:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Скачивание сгенерированного отчета
  const handleDownloadReport = () => {
    console.log('Скачивание отчета:', {
      type: selectedReportType,
      format: reportFormat,
      fileName: `${selectedReportType}_${format(new Date(), 'yyyy-MM-dd')}.${reportFormat}`
    });
    
    // Здесь должен быть код для фактического скачивания файла
    // В этом примере просто выводим сообщение в консоль
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Генератор отчетов</CardTitle>
          <CardDescription>Создавайте различные отчеты для анализа работы магазина</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {/* Выбор типа отчета */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Выберите тип отчета</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((report) => (
                  <button
                    key={report.id}
                    className={`flex items-start space-x-4 rounded-lg border p-4 text-left hover:bg-accent hover:text-accent-foreground ${
                      selectedReportType === report.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                    }`}
                    onClick={() => handleReportTypeChange(report.id)}
                  >
                    <div className={`mt-0.5 rounded-full p-2 ${
                      selectedReportType === report.id 
                        ? 'bg-primary/20 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {report.icon}
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {report.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Настройки отчета - отображаются только если выбран тип отчета */}
            {selectedReportType && currentReport && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Настройки отчета</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Выбор формата */}
                  <div className="space-y-2">
                    <Label htmlFor="report-format">Формат отчета</Label>
                    <Select value={reportFormat} onValueChange={setReportFormat}>
                      <SelectTrigger id="report-format">
                        <SelectValue placeholder="Выберите формат" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentReport.formats.map((format) => (
                          <SelectItem key={format} value={format}>
                            {format.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Выбор периода - только если требуется для отчета */}
                  {currentReport.periodRequired && (
                    <div className="space-y-2 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date-from">Дата начала</Label>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="date-from"
                            type="date"
                            value={dateRange.from}
                            onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="date-to">Дата окончания</Label>
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="date-to"
                            type="date"
                            value={dateRange.to}
                            onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Дополнительные параметры отчета */}
                  {currentReport.parameters?.map((param) => (
                    <div key={param.id} className={`space-y-2 ${
                      param.type === 'checkbox' ? 'flex items-center space-y-0 space-x-2' : ''
                    }`}>
                      {param.type === 'checkbox' ? (
                        <>
                          <Checkbox
                            id={param.id}
                            checked={parameters[param.id] || false}
                            onCheckedChange={(checked) => handleParameterChange(param.id, checked)}
                          />
                          <Label htmlFor={param.id}>{param.name}</Label>
                        </>
                      ) : (
                        <>
                          <Label htmlFor={param.id}>{param.name}</Label>
                          {param.type === 'select' && (
                            <Select
                              value={parameters[param.id] || ''}
                              onValueChange={(value) => handleParameterChange(param.id, value)}
                            >
                              <SelectTrigger id={param.id}>
                                <SelectValue placeholder="Выберите..." />
                              </SelectTrigger>
                              <SelectContent>
                                {param.options?.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                          {param.type === 'text' && (
                            <Input
                              id={param.id}
                              value={parameters[param.id] || ''}
                              onChange={(e) => handleParameterChange(param.id, e.target.value)}
                            />
                          )}
                          {param.type === 'number' && (
                            <Input
                              id={param.id}
                              type="number"
                              value={parameters[param.id] || ''}
                              onChange={(e) => handleParameterChange(param.id, Number(e.target.value))}
                            />
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Предпросмотр и генерация отчета */}
      {selectedReportType && currentReport && (
        <Card>
          <CardHeader>
            <CardTitle>Сводка отчета</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Тип отчета</p>
                  <p className="text-sm text-muted-foreground">{currentReport.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Формат</p>
                  <p className="text-sm text-muted-foreground">{reportFormat.toUpperCase()}</p>
                </div>
                {currentReport.periodRequired && (
                  <div className="space-y-1 md:col-span-2">
                    <p className="text-sm font-medium">Период</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(dateRange.from)} — {formatDate(dateRange.to)}
                    </p>
                  </div>
                )}
                {Object.keys(parameters).length > 0 && (
                  <div className="space-y-2 md:col-span-2">
                    <p className="text-sm font-medium">Параметры</p>
                    <div className="space-y-1">
                      {currentReport.parameters?.map((param) => {
                        let displayValue: string | boolean = '';
                        
                        if (param.type === 'checkbox') {
                          return (
                            <p key={param.id} className="text-sm text-muted-foreground">
                              {param.name}: {parameters[param.id] ? 'Да' : 'Нет'}
                            </p>
                          );
                        }
                        
                        if (param.type === 'select') {
                          const option = param.options?.find(opt => opt.value === parameters[param.id]);
                          displayValue = option?.label || parameters[param.id];
                        } else {
                          displayValue = parameters[param.id];
                        }
                        
                        return (
                          <p key={param.id} className="text-sm text-muted-foreground">
                            {param.name}: {displayValue}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end gap-4 mt-4">
                {isGenerated ? (
                  <>
                    <div className="flex items-center text-green-600 dark:text-green-500 mr-auto">
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      <span>Отчет готов!</span>
                    </div>
                    <Button variant="outline" onClick={handleGenerateReport}>
                      Сгенерировать снова
                    </Button>
                    <Button onClick={handleDownloadReport}>
                      <Download className="mr-2 h-4 w-4" />
                      Скачать отчет
                    </Button>
                  </>
                ) : (
                  <Button 
                    onClick={handleGenerateReport} 
                    disabled={isGenerating}
                    className="ml-auto"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Генерация...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Сгенерировать отчет
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

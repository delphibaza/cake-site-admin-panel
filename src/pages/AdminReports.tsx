
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import PageHeader from "@/components/admin/PageHeader";
import ReportsGenerator from "@/components/admin/ReportsGenerator";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  FileBarChart,
  FileText,
  Download,
  Calendar,
  Clock,
  Star,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface SavedReport {
  id: string;
  name: string;
  type: string;
  format: string;
  createdAt: string;
  size: string;
  downloads: number;
  starred?: boolean;
}

const AdminReports = () => {
  const [activeTab, setActiveTab] = useState("generator");
  
  // Имитация данных о сохраненных отчетах
  const [savedReports, setSavedReports] = useState<SavedReport[]>([
    {
      id: "report-1",
      name: "Продажи за апрель 2025",
      type: "sales",
      format: "pdf",
      createdAt: "2025-05-01T12:30:00",
      size: "2.4 МБ",
      downloads: 5,
      starred: true
    },
    {
      id: "report-2",
      name: "Анализ клиентов Q1 2025",
      type: "customers",
      format: "xlsx",
      createdAt: "2025-04-15T09:45:00",
      size: "3.8 МБ",
      downloads: 12
    },
    {
      id: "report-3",
      name: "Складской остаток на 01.05.2025",
      type: "inventory",
      format: "pdf",
      createdAt: "2025-05-01T08:15:00",
      size: "1.7 МБ",
      downloads: 3
    },
    {
      id: "report-4",
      name: "Финансовый отчет за апрель 2025",
      type: "finance",
      format: "xlsx",
      createdAt: "2025-05-02T14:20:00",
      size: "4.2 МБ",
      downloads: 8,
      starred: true
    },
    {
      id: "report-5",
      name: "Продажи по категориям Q1 2025",
      type: "sales",
      format: "csv",
      createdAt: "2025-04-10T11:05:00",
      size: "1.2 МБ",
      downloads: 2
    }
  ]);

  // Обработчик генерации отчета
  const handleGenerateReport = async (reportData: any) => {
    console.log('Генерация отчета с параметрами:', reportData);
    
    // Имитация задержки генерации отчета
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Добавляем новый отчет в список сохраненных
    const newReport: SavedReport = {
      id: `report-${Date.now()}`,
      name: `${getReportTypeName(reportData.type)} ${format(new Date(), 'dd.MM.yyyy')}`,
      type: reportData.type,
      format: reportData.format,
      createdAt: new Date().toISOString(),
      size: `${(Math.random() * 5).toFixed(1)} МБ`,
      downloads: 0
    };
    
    setSavedReports(prev => [newReport, ...prev]);
    
    // Переключаемся на вкладку со списком отчетов
    setActiveTab('saved');
  };

  // Функция для получения названия типа отчета
  const getReportTypeName = (type: string): string => {
    switch (type) {
      case 'sales':
        return 'Отчет по продажам';
      case 'inventory':
        return 'Отчет по складу';
      case 'customers':
        return 'Анализ клиентов';
      case 'finance':
        return 'Финансовый отчет';
      default:
        return 'Отчет';
    }
  };

  // Функция для получения иконки отчета
  const getReportIcon = (type: string) => {
    switch (type) {
      case 'sales':
        return <FileBarChart className="h-5 w-5" />;
      case 'inventory':
        return <FileText className="h-5 w-5" />;
      case 'customers':
        return <FileSpreadsheet className="h-5 w-5" />;
      case 'finance':
        return <FileText className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  // Формат значка для формата файла
  const getFormatBadge = (format: string) => {
    let color = "";
    switch (format.toLowerCase()) {
      case 'pdf':
        color = "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
        break;
      case 'xlsx':
        color = "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
        break;
      case 'csv':
        color = "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
        break;
      default:
        color = "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
    
    return (
      <Badge variant="outline" className={color}>
        {format.toUpperCase()}
      </Badge>
    );
  };

  // Отметить отчет как избранный/не избранный
  const toggleStarReport = (reportId: string) => {
    setSavedReports(prev => prev.map(report => {
      if (report.id === reportId) {
        return { ...report, starred: !report.starred };
      }
      return report;
    }));
  };

  // Форматирование даты создания
  const formatCreatedDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'dd.MM.yyyy HH:mm');
  };

  return (
    <AdminLayout>
      <PageHeader 
        title="Отчеты"
        description="Создание и управление отчетами"
        breadcrumbs={[
          { label: 'Дашборд', href: '/admin' },
          { label: 'Отчеты' }
        ]}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="generator">Генератор отчетов</TabsTrigger>
          <TabsTrigger value="saved">
            Сохраненные отчеты
            <Badge className="ml-2 h-5 px-1.5">
              {savedReports.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="scheduled">Запланированные отчеты</TabsTrigger>
        </TabsList>

        <TabsContent value="generator">
          <ReportsGenerator onGenerateReport={handleGenerateReport} />
        </TabsContent>

        <TabsContent value="saved">
          <Card>
            <CardHeader>
              <CardTitle>Сохраненные отчеты</CardTitle>
              <CardDescription>
                Список ранее сгенерированных отчетов, доступных для просмотра и загрузки
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedReports.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 mb-3 opacity-20" />
                    <p>У вас пока нет сохраненных отчетов</p>
                    <Button 
                      variant="link" 
                      onClick={() => setActiveTab('generator')}
                      className="mt-2"
                    >
                      Создать первый отчет
                    </Button>
                  </div>
                ) : (
                  <div className="border rounded-md divide-y">
                    {savedReports.map((report) => (
                      <div 
                        key={report.id} 
                        className="p-4 hover:bg-muted/50 flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="rounded-full p-2 bg-primary/10 text-primary">
                            {getReportIcon(report.type)}
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">{report.name}</h3>
                              {report.starred && (
                                <Star className="h-4 w-4 ml-2 text-amber-500 fill-amber-500" />
                              )}
                            </div>
                            <div className="flex items-center mt-1 space-x-3 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                {getFormatBadge(report.format)}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-3.5 w-3.5 mr-1" />
                                {formatCreatedDate(report.createdAt)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3.5 w-3.5 mr-1" />
                                {report.size}
                              </div>
                              <div>
                                {report.downloads} {report.downloads === 1 ? 'загрузка' : 
                                report.downloads >= 2 && report.downloads <= 4 ? 'загрузки' : 'загрузок'}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => toggleStarReport(report.id)}
                            className="h-8 w-8"
                          >
                            <Star 
                              className={`h-4 w-4 ${
                                report.starred ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'
                              }`} 
                            />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Скачать
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Запланированные отчеты</CardTitle>
              <CardDescription>
                Настройте автоматическую генерацию отчетов по расписанию
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>Функция запланированных отчетов находится в разработке</p>
                <p className="text-sm mt-2">Скоро вы сможете настраивать автоматическую генерацию и отправку отчетов</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminReports;

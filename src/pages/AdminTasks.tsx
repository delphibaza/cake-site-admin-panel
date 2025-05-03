
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import PageHeader from "@/components/admin/PageHeader";
import KanbanBoard from "@/components/admin/KanbanBoard";
import DashboardFilters from "@/components/admin/DashboardFilters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListFilter, Plus, KanbanSquare, List } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Демо-данные для Kanban Board
const initialTasks = [
  {
    id: 'task-1',
    title: 'Обновить описания товаров',
    description: 'Добавить более подробные описания для шоколадных тортов',
    priority: 'high',
    dueDate: '2025-05-10',
    tags: ['контент', 'маркетинг'],
    assignee: {
      id: 'user-1',
      name: 'Иван Петров',
      avatar: 'https://i.pravatar.cc/150?img=1'
    }
  },
  {
    id: 'task-2',
    title: 'Подготовить акционные предложения на май',
    description: 'Разработать специальные предложения на майские праздники',
    priority: 'medium',
    dueDate: '2025-05-15',
    tags: ['акции', 'продажи'],
    assignee: {
      id: 'user-2',
      name: 'Мария Иванова',
      avatar: 'https://i.pravatar.cc/150?img=5'
    }
  },
  {
    id: 'task-3',
    title: 'Загрузить новые фотографии тортов',
    description: 'Обновить фотографии для фруктовых тортов',
    priority: 'low',
    dueDate: '2025-05-20',
    tags: ['фото', 'контент'],
    assignee: {
      id: 'user-3',
      name: 'Алексей Смирнов'
    }
  },
  {
    id: 'task-4',
    title: 'Расширить ассортимент детских тортов',
    description: 'Добавить новые варианты тортов для детских праздников',
    priority: 'medium',
    dueDate: '2025-05-25',
    tags: ['ассортимент', 'развитие']
  },
  {
    id: 'task-5',
    title: 'Ответить на отзывы клиентов',
    description: 'Обработать последние отзывы клиентов на сайте',
    priority: 'high',
    dueDate: '2025-05-05',
    tags: ['клиенты', 'обратная связь'],
    assignee: {
      id: 'user-1',
      name: 'Иван Петров',
      avatar: 'https://i.pravatar.cc/150?img=1'
    }
  }
];

// Инициализация колонок с задачами
const initialColumns = [
  {
    id: 'todo',
    title: 'К выполнению',
    tasks: [initialTasks[0], initialTasks[1]],
    color: 'bg-blue-100 dark:bg-blue-950'
  },
  {
    id: 'inprogress',
    title: 'В процессе',
    tasks: [initialTasks[2], initialTasks[3]],
    color: 'bg-yellow-100 dark:bg-yellow-950'
  },
  {
    id: 'done',
    title: 'Выполнено',
    tasks: [initialTasks[4]],
    color: 'bg-green-100 dark:bg-green-950'
  }
];

const AdminTasks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  // Фильтры для задач
  const [filters, setFilters] = useState({
    priority: '',
    assignee: '',
    tag: ''
  });

  // Данные для фильтров
  const priorityOptions = [
    { value: 'low', label: 'Низкий' },
    { value: 'medium', label: 'Средний' },
    { value: 'high', label: 'Высокий' }
  ];

  const assigneeOptions = [
    { value: 'user-1', label: 'Иван Петров' },
    { value: 'user-2', label: 'Мария Иванова' },
    { value: 'user-3', label: 'Алексей Смирнов' }
  ];

  const tagOptions = [
    { value: 'контент', label: 'Контент' },
    { value: 'маркетинг', label: 'Маркетинг' },
    { value: 'акции', label: 'Акции' },
    { value: 'продажи', label: 'Продажи' },
    { value: 'фото', label: 'Фото' },
    { value: 'ассортимент', label: 'Ассортимент' },
    { value: 'клиенты', label: 'Клиенты' }
  ];

  // Переключение между режимами отображения
  const handleViewModeChange = (mode: 'kanban' | 'list') => {
    setViewMode(mode);
  };

  // Обработчик изменения фильтра
  const handleFilterChange = (filter: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  };

  // Обработчик перемещения задачи
  const handleTaskMove = (taskId: string, sourceColumn: string, destinationColumn: string) => {
    console.log(`Задача ${taskId} перемещена из ${sourceColumn} в ${destinationColumn}`);
  };

  // Обработчик создания задачи
  const handleTaskCreate = (task: any, columnId: string) => {
    console.log(`Создана новая задача в колонке ${columnId}:`, task);
  };

  // Обработчик удаления задачи
  const handleTaskDelete = (taskId: string, columnId: string) => {
    console.log(`Задача ${taskId} удалена из колонки ${columnId}`);
  };

  // Обработчик редактирования задачи
  const handleTaskEdit = (taskId: string, columnId: string, updatedTask: any) => {
    console.log(`Задача ${taskId} в колонке ${columnId} обновлена:`, updatedTask);
  };

  return (
    <AdminLayout>
      <PageHeader 
        title="Управление задачами"
        description="Планирование и отслеживание задач команды"
        breadcrumbs={[
          { label: 'Дашборд', href: '/admin' },
          { label: 'Задачи' }
        ]}
        actionLabel="Создать задачу"
        actionIcon={<Plus className="mr-2 h-4 w-4" />}
        onAction={() => console.log('Создание новой задачи')}
      />

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Input
            placeholder="Поиск задач..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('kanban')}
          >
            <KanbanSquare className="h-4 w-4 mr-2" />
            Канбан
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('list')}
          >
            <List className="h-4 w-4 mr-2" />
            Список
          </Button>
        </div>
      </div>

      <DashboardFilters
        filters={[
          { name: 'Приоритет', options: priorityOptions },
          { name: 'Исполнитель', options: assigneeOptions },
          { name: 'Метка', options: tagOptions }
        ]}
        activeFilters={filters}
        onFilterChange={handleFilterChange}
        onPeriodChange={(period) => console.log('Период изменен:', period)}
      >
        <Button variant="outline" size="sm" className="gap-1 h-9">
          <ListFilter className="h-4 w-4" />
          Фильтры
          <Badge className="ml-1 h-5 px-1.5">
            {Object.values(filters).filter(Boolean).length}
          </Badge>
        </Button>
      </DashboardFilters>

      <div className="flex-1">
        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">Все задачи</TabsTrigger>
            <TabsTrigger value="my">Мои задачи</TabsTrigger>
            <TabsTrigger value="urgent">Срочные</TabsTrigger>
            <TabsTrigger value="upcoming">Предстоящие</TabsTrigger>
          </TabsList>
        </Tabs>

        {viewMode === 'kanban' ? (
          <KanbanBoard 
            initialColumns={initialColumns}
            onTaskUpdate={handleTaskMove}
            onTaskCreate={handleTaskCreate}
            onTaskDelete={handleTaskDelete}
            onTaskEdit={handleTaskEdit}
          />
        ) : (
          <div className="bg-card border rounded-md p-6 text-center">
            <p className="text-muted-foreground">
              Просмотр списком находится в разработке
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTasks;

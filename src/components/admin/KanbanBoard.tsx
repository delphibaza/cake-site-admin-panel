
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MoreVertical, Plus, Trash2, Edit2, Tag, Calendar, 
  ClipboardList, User, Clock, AlertCircle
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Типы данных для Канбан-доски
interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  tags?: string[];
}

interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
  color?: string;
}

interface KanbanBoardProps {
  onTaskUpdate?: (taskId: string, columnId: string, newColumnId: string) => void;
  onTaskCreate?: (task: Omit<KanbanTask, 'id'>, columnId: string) => void;
  onTaskDelete?: (taskId: string, columnId: string) => void;
  onTaskEdit?: (taskId: string, columnId: string, updatedTask: Partial<KanbanTask>) => void;
  initialColumns?: KanbanColumn[];
}

export default function KanbanBoard({
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
  onTaskEdit,
  initialColumns = [
    {
      id: 'todo',
      title: 'К выполнению',
      tasks: [],
      color: 'bg-blue-100 dark:bg-blue-950'
    },
    {
      id: 'inprogress',
      title: 'В процессе',
      tasks: [],
      color: 'bg-yellow-100 dark:bg-yellow-950'
    },
    {
      id: 'done',
      title: 'Выполнено',
      tasks: [],
      color: 'bg-green-100 dark:bg-green-950'
    }
  ]
}: KanbanBoardProps) {
  // Состояние колонок
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);
  
  // Состояние для модальных окон
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false);
  const [isEditTaskDialogOpen, setIsEditTaskDialogOpen] = useState(false);
  const [newTaskColumn, setNewTaskColumn] = useState<string | null>(null);
  const [currentEditTask, setCurrentEditTask] = useState<{ task: KanbanTask; columnId: string } | null>(null);
  const [newTaskForm, setNewTaskForm] = useState<Omit<KanbanTask, 'id'>>({
    title: '',
    description: '',
    priority: 'medium',
    tags: []
  });

  // Обработчик перетаскивания
  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // Если нет места назначения или место назначения то же, что и источник
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Найдем колонку и задачу источника
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    if (!sourceColumn) return;
    
    const task = sourceColumn.tasks.find(t => t.id === draggableId);
    if (!task) return;

    // Создаем новые колонки
    const newColumns = [...columns];
    
    // Удаляем задачу из исходной колонки
    const sourceColumnIndex = newColumns.findIndex(col => col.id === source.droppableId);
    newColumns[sourceColumnIndex] = {
      ...sourceColumn,
      tasks: sourceColumn.tasks.filter(t => t.id !== draggableId)
    };
    
    // Добавляем задачу в колонку назначения
    const destinationColumn = newColumns.find(col => col.id === destination.droppableId);
    if (!destinationColumn) return;
    
    const destinationColumnIndex = newColumns.findIndex(col => col.id === destination.droppableId);
    const newDestinationTasks = [...destinationColumn.tasks];
    newDestinationTasks.splice(destination.index, 0, task);
    
    newColumns[destinationColumnIndex] = {
      ...destinationColumn,
      tasks: newDestinationTasks
    };
    
    setColumns(newColumns);
    
    // Вызываем обработчик обновления если он передан
    if (onTaskUpdate) {
      onTaskUpdate(draggableId, source.droppableId, destination.droppableId);
    }
  };

  // Открыть диалог создания новой задачи
  const openNewTaskDialog = (columnId: string) => {
    setNewTaskColumn(columnId);
    setNewTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      tags: []
    });
    setIsNewTaskDialogOpen(true);
  };

  // Открыть диалог редактирования задачи
  const openEditTaskDialog = (task: KanbanTask, columnId: string) => {
    setCurrentEditTask({ task, columnId });
    setNewTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate,
      assignee: task.assignee,
      tags: task.tags || []
    });
    setIsEditTaskDialogOpen(true);
  };

  // Обработчик создания новой задачи
  const handleCreateTask = () => {
    if (!newTaskColumn || !newTaskForm.title.trim()) return;
    
    // Генерируем уникальный ID
    const newTaskId = `task-${Date.now()}`;
    
    // Создаем новую задачу
    const newTask: KanbanTask = {
      id: newTaskId,
      ...newTaskForm
    };
    
    // Обновляем состояние колонок
    const updatedColumns = columns.map(column => {
      if (column.id === newTaskColumn) {
        return {
          ...column,
          tasks: [...column.tasks, newTask]
        };
      }
      return column;
    });
    
    setColumns(updatedColumns);
    setIsNewTaskDialogOpen(false);
    
    // Вызываем обработчик создания если он передан
    if (onTaskCreate) {
      onTaskCreate(newTaskForm, newTaskColumn);
    }
  };

  // Обработчик редактирования задачи
  const handleEditTask = () => {
    if (!currentEditTask || !newTaskForm.title.trim()) return;
    
    // Обновляем задачу
    const updatedColumns = columns.map(column => {
      if (column.id === currentEditTask.columnId) {
        const updatedTasks = column.tasks.map(task => {
          if (task.id === currentEditTask.task.id) {
            return {
              ...task,
              ...newTaskForm
            };
          }
          return task;
        });
        
        return {
          ...column,
          tasks: updatedTasks
        };
      }
      return column;
    });
    
    setColumns(updatedColumns);
    setIsEditTaskDialogOpen(false);
    
    // Вызываем обработчик редактирования если он передан
    if (onTaskEdit && currentEditTask) {
      onTaskEdit(currentEditTask.task.id, currentEditTask.columnId, newTaskForm);
    }
  };

  // Обработчик удаления задачи
  const handleDeleteTask = (taskId: string, columnId: string) => {
    // Подтверждение удаления
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return;
    
    // Обновляем состояние колонок
    const updatedColumns = columns.map(column => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.filter(task => task.id !== taskId)
        };
      }
      return column;
    });
    
    setColumns(updatedColumns);
    
    // Вызываем обработчик удаления если он передан
    if (onTaskDelete) {
      onTaskDelete(taskId, columnId);
    }
  };

  // Получение цвета приоритета
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  // Отображение приоритета
  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Высокий';
      case 'medium':
        return 'Средний';
      case 'low':
        return 'Низкий';
      default:
        return 'Не указан';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-full">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {columns.map(column => (
            <div key={column.id} className="flex flex-col h-auto md:h-[calc(100vh-280px)]">
              <div className={`p-4 rounded-t-lg flex items-center justify-between ${column.color}`}>
                <h3 className="font-semibold flex items-center">
                  {column.title}
                  <Badge variant="outline" className="ml-2">
                    {column.tasks.length}
                  </Badge>
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => openNewTaskDialog(column.id)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`p-2 flex-1 overflow-y-auto rounded-b-lg bg-card border ${
                      snapshot.isDraggingOver ? 'border-primary/50 bg-primary/5' : 'border-border/50'
                    }`}
                    style={{ minHeight: '100px' }}
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-3 ${
                              snapshot.isDragging ? 'ring-2 ring-primary shadow-lg' : ''
                            }`}
                          >
                            <CardHeader className="p-3 pb-0 flex flex-row items-start justify-between space-y-0">
                              <CardTitle className="text-sm font-medium line-clamp-2">
                                {task.title}
                              </CardTitle>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditTaskDialog(task, column.id)}>
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    Редактировать
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteTask(task.id, column.id)}
                                    className="text-red-600 dark:text-red-400"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Удалить
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </CardHeader>
                            <CardContent className="p-3 pt-2">
                              {task.description && (
                                <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                                  {task.description}
                                </p>
                              )}
                              
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  {getPriorityText(task.priority)}
                                </Badge>
                                
                                {task.tags?.map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              
                              <div className="flex justify-between items-center text-xs text-muted-foreground">
                                {task.dueDate && (
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {task.dueDate}
                                  </div>
                                )}
                                
                                {task.assignee && (
                                  <div className="ml-auto">
                                    <Avatar className="h-6 w-6">
                                      {task.assignee.avatar ? (
                                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                      ) : null}
                                      <AvatarFallback className="text-[10px]">
                                        {getInitials(task.assignee.name)}
                                      </AvatarFallback>
                                    </Avatar>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {column.tasks.length === 0 && (
                      <div className="flex items-center justify-center h-24 text-sm text-muted-foreground italic">
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Нет задач
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Диалог создания новой задачи */}
      <Dialog open={isNewTaskDialogOpen} onOpenChange={setIsNewTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Создать новую задачу</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название задачи</Label>
              <Input
                id="title"
                value={newTaskForm.title}
                onChange={(e) => setNewTaskForm({...newTaskForm, title: e.target.value})}
                placeholder="Введите название задачи"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={newTaskForm.description}
                onChange={(e) => setNewTaskForm({...newTaskForm, description: e.target.value})}
                placeholder="Описание задачи"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Приоритет</Label>
              <select
                id="priority"
                value={newTaskForm.priority}
                onChange={(e) => setNewTaskForm({
                  ...newTaskForm, 
                  priority: e.target.value as 'low' | 'medium' | 'high'
                })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Срок выполнения</Label>
              <Input
                id="dueDate"
                type="date"
                value={newTaskForm.dueDate}
                onChange={(e) => setNewTaskForm({...newTaskForm, dueDate: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Метки (через запятую)</Label>
              <Input
                id="tags"
                value={newTaskForm.tags?.join(', ') || ''}
                onChange={(e) => setNewTaskForm({
                  ...newTaskForm, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                placeholder="Например: срочно, веб, дизайн"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewTaskDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button onClick={handleCreateTask}>Создать задачу</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования задачи */}
      <Dialog open={isEditTaskDialogOpen} onOpenChange={setIsEditTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Редактировать задачу</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Название задачи</Label>
              <Input
                id="edit-title"
                value={newTaskForm.title}
                onChange={(e) => setNewTaskForm({...newTaskForm, title: e.target.value})}
                placeholder="Введите название задачи"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Описание</Label>
              <Textarea
                id="edit-description"
                value={newTaskForm.description}
                onChange={(e) => setNewTaskForm({...newTaskForm, description: e.target.value})}
                placeholder="Описание задачи"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-priority">Приоритет</Label>
              <select
                id="edit-priority"
                value={newTaskForm.priority}
                onChange={(e) => setNewTaskForm({
                  ...newTaskForm, 
                  priority: e.target.value as 'low' | 'medium' | 'high'
                })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="low">Низкий</option>
                <option value="medium">Средний</option>
                <option value="high">Высокий</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-dueDate">Срок выполнения</Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={newTaskForm.dueDate}
                onChange={(e) => setNewTaskForm({...newTaskForm, dueDate: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Метки (через запятую)</Label>
              <Input
                id="edit-tags"
                value={newTaskForm.tags?.join(', ') || ''}
                onChange={(e) => setNewTaskForm({
                  ...newTaskForm, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                })}
                placeholder="Например: срочно, веб, дизайн"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditTaskDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button onClick={handleEditTask}>Сохранить изменения</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

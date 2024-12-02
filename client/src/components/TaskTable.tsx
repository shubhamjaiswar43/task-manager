import React, { useState } from 'react';
import { toast } from 'react-toastify';
import TaskModal from './TaskModal';

interface Task {
  id: number;
  title: string;
  priority: number;
  status: 'Pending' | 'Finished';
  startDate: string;
  endDate: string;
}

interface TaskTableProps {
  tasks: Task[];
  getData: () => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, getData }) => {
  const [isDeleted, setIsDeleted] = useState<{ [key: number]: boolean }>({});
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [eTask, setEtask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<{ status: string; priority: number | null }>({
    status: '',
    priority: null,
  });
  const diffBetween = (a: string, b: (string | number)) => {
    // returns a - b in hrs;
    const ams = new Date(a).getTime();
    const bms = new Date(b).getTime();
    if (ams < bms) return 0;
    return (ams - bms) / (1000 * 60 * 60);
  };
  const applyFiltersAndSort = () => {
    let updatedTasks = tasks;
    // Apply filters
    if (filters.status) {
      updatedTasks = updatedTasks.filter((task) => task.status === filters.status);
    }
    if (filters.priority !== null) {
      updatedTasks = updatedTasks.filter((task) => task.priority === filters.priority);
    }

    // Apply sorting
    if (sortConfig) {
      const { key, direction } = sortConfig;
      updatedTasks = updatedTasks.sort((a, b) => {
        let v1 = 0;
        let v2 = 0;
        if (key === "id" || key === "priority") {
          v1 = a[key];
          v2 = b[key];
        } else if (key === "startDate" || key === "endDate") {
          v1 = new Date(a[key]).getTime();
          v2 = new Date(b[key]).getTime();
        } else {
          v1 = diffBetween(a['endDate'], a['startDate']);
          v2 = diffBetween(b['endDate'], b['startDate']);
        }
        if (v1 < v2) return direction === 'asc' ? 1 : -1;
        if (v1 > v2) return direction === 'asc' ? -1 : 1;
        return 0;
      });
    }
    setFilteredTasks(updatedTasks);
  };

  // Handle sorting
  const handleSort = (key: string) => {
    const direction = sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  // Handle filtering
  const handleFilter = (filterKey: keyof typeof filters, value: string | number | null) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }));
  };

  const formatHours = (val: number) => {
    if (Number.isInteger(val)) return String(val);
    return val.toFixed(2);
  };
  const handleDelete = (taskId: number) => {
    const confirmDelete: boolean = confirm(`Confirm Deleting Task ${taskId}`);
    if (confirmDelete) {
      const hostname = import.meta.env.VITE_APP_SERVER_HOST;
      const authToken: (string | null) = localStorage.getItem('authToken');
      const method = "DELETE";
      const headers = {
        'Content-Type': 'application/json',
        ...(authToken ? { authToken } : {})
      }
      fetch(`${hostname}/task/${taskId}`, {
        method,
        headers
      }).then((res) => res.json()).then((res) => {
        if (res.success) {
          toast("Task Deleted Successfully");
          setIsDeleted({ [taskId]: true, ...isDeleted });
        }
      });
    }
  }
  const handleEdit = (task: Task) => {
    setEtask(task);
  }
  React.useEffect(() => {
    applyFiltersAndSort();
  }, [tasks, filters, sortConfig]);

  return (
    <div className="p-6 bg-gray-50 shadow-md rounded-lg">
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-1/4">
          <label className="block text-sm font-semibold text-gray-600">Filter by Status:</label>
          <select
            className="mt-2 w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            value={filters.status}
            onChange={(e) => handleFilter('status', e.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Finished">Finished</option>
          </select>
        </div>
        <div className="w-1/4">
          <label className="block text-sm font-semibold text-gray-600">Filter by Priority:</label>
          <select
            className="mt-2 w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            value={filters.priority || ''}
            onChange={(e) => handleFilter('priority', e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">All</option>
            {[1, 2, 3, 4, 5].map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/4">
          <label className="block text-sm font-semibold text-gray-600">Sort By:</label>
          <select
            className="mt-2 w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
            value={sortConfig?.key}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="id">Task Id</option>
            <option value="startDate">Start Date</option>
            <option value="endDate">End Date</option>
            <option value="priority">Priority</option>
            <option value="totalTime">Total Time</option>
          </select>

        </div>
      </div>

      {/* Task Table */}
      <table className="w-full border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-4 text-left font-semibold text-gray-700 border cursor-pointer"
              onClick={() => handleSort('id')}
            >
              Task ID
              {sortConfig?.key === 'id' && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
            </th>
            <th className="p-4 text-left font-semibold text-gray-700 border cursor-pointer">
              Title
            </th>
            <th
              className="p-4 text-left font-semibold text-gray-700 border cursor-pointer"
              onClick={() => handleSort('priority')}
            >
              Priority
              {sortConfig?.key === 'priority' && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
            </th>
            <th
              className="p-4 text-left font-semibold text-gray-700 border cursor-pointer"
            >
              Status
            </th>
            <th
              className="p-4 text-left font-semibold text-gray-700 border cursor-pointer"
              onClick={() => handleSort('startDate')}
            >
              Start Time
              {sortConfig?.key === 'startDate' && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
            </th>
            <th
              className="p-4 text-left font-semibold text-gray-700 border cursor-pointer"
              onClick={() => handleSort('endDate')}
            >
              End Time
              {sortConfig?.key === 'endDate' && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
            </th>
            <th className="p-4 text-left font-semibold text-gray-700 border" onClick={() => handleSort('totalTime')}>Total Time (hrs)
              {sortConfig?.key === 'totalTime' && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
            </th>
            <th className='p-4 text-left font-semibold text-gray-700 border'>Options</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              isDeleted[task.id] ? "" :
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="border p-4">{task.id}</td>
                  <td className="border p-4">{task.title}</td>
                  <td className="border p-4">{task.priority}</td>
                  <td className="border p-4">{task.status}</td>
                  <td className="border p-4">{(new Date(task.startDate).toLocaleString())}</td>
                  <td className="border p-4">{(new Date(task.endDate).toLocaleString())}</td>
                  <td className="border p-4">{`${formatHours(diffBetween(task.endDate, task.startDate))} hrs`}</td>
                  <td className='border p-4'>
                    <button onClick={() => handleEdit(task)} className='text-sm mx-2 border p-2 rounded bg-purple-100 hover:bg-purple-600'>Edit</button>
                    <button onClick={() => handleDelete(task.id)} className='text-sm mx-2 border p-2 rounded bg-red-100 hover:bg-red-600'>Delete</button>
                  </td>
                </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="border p-4 text-center text-gray-500">
                No tasks match the selected filters or sort criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {
        eTask && <TaskModal
          modalTitle="Edit Task"
          task={eTask}
          onClose={() => setEtask(null)}
          onSave={async (newTask: any) => {
            const hostname = import.meta.env.VITE_APP_SERVER_HOST;
            const authToken: (string | null) = localStorage.getItem('authToken');
            const method = "PATCH";
            const body = JSON.stringify(newTask);
            const headers = {
              'Content-Type': 'application/json',
              ...(authToken ? { authToken } : {})
            }
            const r1 = await fetch(`${hostname}/task/${eTask.id}`, {
              method,
              headers,
              body
            })
            const res = await r1.json();
            console.log(res);
            if (res.success) {
              getData();
              toast("Task Edited Successfully");
            } else {
              toast("Error In Editing Task");
            }
            setEtask(null);
          }}
        />
      }
    </div>
  );
};

export default TaskTable;

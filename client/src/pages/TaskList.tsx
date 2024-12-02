import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import TaskTable from '../components/TaskTable';
import TaskModal from '../components/TaskModal';
import CheckLogin from '../components/CheckLogin';
import { toast } from 'react-toastify';
interface Task {
  id: number;
  title: string;
  priority: number;
  status: 'Pending' | 'Finished';
  startDate: string;
  endDate: string;
}
const TaskList: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const getData = () => {
    const hostname = import.meta.env.VITE_APP_SERVER_HOST;
    const authToken: (string | null) = localStorage.getItem('authToken');
    const method = "GET";
    const headers = {
      'Content-Type': 'application/json',
      ...(authToken ? { authToken } : {})
    }
    fetch(`${hostname}/task`, {
      method,
      headers
    }).then((res) => res.json()).then((res) => {
      if (res.success) {
        const ctasks: Task[] = [];
        for (const task of res.tasks) {
          const ctask: Task = {
            id: task.taskId,
            title: task.title,
            priority: task.priority,
            status: task.status,
            startDate: task.startDate,
            endDate: task.endDate,
          };
          ctasks.push(ctask);
        }
        setTasks(ctasks);
      }
    });
  };
  useEffect(() => { getData(); }, []);
  return (
    <div className="bg-gray-50 min-h-screen">
      <CheckLogin />
      <Header />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-700">Task List</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
          >
            + Add Task
          </button>
        </div>

        <div className="mt-4">
          <TaskTable tasks={tasks} getData={getData} />
        </div>
      </div>

      {showAddModal && (
        <TaskModal
          task={null}
          modalTitle="Add Task"
          onClose={() => setShowAddModal(false)}
          onSave={(newTask: any) => {
            const hostname = import.meta.env.VITE_APP_SERVER_HOST;
            const authToken: (string | null) = localStorage.getItem('authToken');
            const method = "POST";
            const body = JSON.stringify(newTask);
            const headers = {
              'Content-Type': 'application/json',
              ...(authToken ? { authToken } : {})
            }
            fetch(`${hostname}/task`, {
              method,
              headers,
              body
            }).then((res) => res.json()).then((res) => {
              if (res.success) {
                toast("Task Added Successfully");
                getData();
              }
            });
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

export default TaskList;

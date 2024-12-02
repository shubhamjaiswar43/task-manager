import React, { useState } from 'react';
import { toast } from 'react-toastify';
interface Task {
  id: number;
  title: string;
  priority: number;
  status: 'Pending' | 'Finished';
  startDate: string;
  endDate: string;
}
interface TaskModalProps {
  modalTitle: string,
  onClose: () => void;
  onSave: (task: any) => void;
  task: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ modalTitle, onClose, onSave, task }) => {
  const formatTo2 = (val: number): string => {
    if (val < 10) return '0' + String(val);
    return String(val);
  }
  const formatDate = (cdate: Date): string => {
    const year = cdate.getFullYear();
    const month = cdate.getMonth();
    const date = cdate.getDate();
    const hours = cdate.getHours();
    const minutes = cdate.getMinutes();
    const res = `${year}-${formatTo2(month)}-${formatTo2(date)}T${formatTo2(hours)}:${formatTo2(minutes)}`;
    return res;
  };
  const [title, setTitle] = useState(task ? task.title : '');
  const [priority, setPriority] = useState<number>(task ? task.priority : 1);
  const [status, setStatus] = useState<'Pending' | 'Finished'>(task ? task.status : 'Pending');
  const [startDate, setStartDate] = useState<string | number | readonly string[] | undefined>(task ? formatDate(new Date(task.startDate)) : '');
  const [endDate, setEndDate] = useState<string | number | readonly string[] | undefined>(task ? formatDate(new Date(task.endDate)) : '');
  const handleSave = () => {
    if (!title || !startDate || !endDate) {
      toast("Please Complete The Form!!");
    } else if (priority <= 0 || priority > 5) {
      toast("Valid Priority Range is 1 to 5");
    } else {
      onSave({ title, priority, status, startDate, endDate });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md w-1/3">
        <h2 className="text-lg font-bold mb-4">{modalTitle}</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Priority</label>
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="w-full border p-2 rounded-md"
            min={1}
            max={5}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as 'Pending' | 'Finished')}
            className="w-full border p-2 rounded-md"
          >
            <option value="Pending">Pending</option>
            <option value="Finished">Finished</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Start Date</label>
          <input value={startDate} onChange={(e) => { setStartDate(e.target.value) }} type="datetime-local" required />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">End Date</label>
          <input value={endDate} onChange={(e) => { setEndDate(e.target.value) }} type="datetime-local" required />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;

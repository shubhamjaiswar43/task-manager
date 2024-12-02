import React from "react";
interface Data {
  totalTasks: number,
  tasksCompleted: string,
  tasksPending: string,
  avgTimeToComplete: string
};
interface SummaryProps {
  data: Data
};
const Summary: React.FC<SummaryProps> = ({ data }) => {
  const { totalTasks, tasksCompleted, tasksPending, avgTimeToComplete } = data;
  const formatText = (val: number | string) => {
    if (typeof val === 'string') return val;
    if (Number.isInteger(val)) return String(val);
    return val.toFixed(2);
  };
  return (
    <section className="grid grid-cols-4 gap-4 mb-8">
      {[
        { label: "Total tasks", value: totalTasks },
        { label: "Tasks completed", value: tasksCompleted },
        { label: "Tasks pending", value: tasksPending },
        { label: "Average time per completed task", value: avgTimeToComplete },
      ].map((item, idx) => (
        <div
          key={idx}
          className="p-4 text-center bg-white border rounded-lg shadow-sm"
        >
          <p className="text-lg font-bold text-purple-600">{formatText(item.value)}</p>
          <p className="text-sm text-gray-600">{item.label}</p>
        </div>
      ))}
    </section>
  );
};

export default Summary;

import React from "react";
interface Data {
  pendingTasks: number,
  lapsedTime: number,
  finishTime: number
};
interface PTSProps {
  data: Data
};
const PendingTaskSummary: React.FC<PTSProps> = ({ data }) => {
  const { pendingTasks, lapsedTime, finishTime } = data;
  const formatText = (val: number | string) => {
    if (typeof val === 'string') return val;
    if (Number.isInteger(val)) return String(val);
    return val.toFixed(2);
  };
  return (
    <section className="mb-8">
      <h3 className="mb-4 text-xl font-semibold text-gray-700">
        Pending task summary
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending tasks", value: pendingTasks },
          { label: "Total time lapsed", value: lapsedTime },
          { label: "Total time to finish", value: finishTime },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-4 text-center bg-white border rounded-lg shadow-sm"
          >
            <p className="text-lg font-bold text-purple-600">{formatText(item.value)}</p>
            <p className="text-sm text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PendingTaskSummary;

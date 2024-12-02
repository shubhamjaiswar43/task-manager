import React from "react";
interface taskSummary {
  priority: Number,
  pendingTasks: Number,
  lapsedTime: Number,
  finishTime: Number
};
interface pttProps {
  data: taskSummary[]
}
/*
sample
// [
//   [1, 3, "12 hrs", "8 hrs"],
//   [2, 5, "6 hrs", "3 hrs"],
//   [3, 1, "8 hrs", "7 hrs"],
//   [4, 0, "-", "-"],
//   [5, 6, "30 hrs", "6 hrs"],
// ]
*/
const PendingTaskTable: React.FC<pttProps> = ({ data }) => {
  const formatText = (val: number | string) => {
    if (typeof val === 'string') return val;
    if (Number.isInteger(val)) return String(val);
    return val.toFixed(2);
  };
  return (
    <section>
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-gray-700 bg-gray-100">
          <tr>
            {["Task priority", "Pending tasks", "Time lapsed", "Time to finish"].map((heading, idx) => (
              <th key={idx} className="px-4 py-2 font-semibold">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="border-t hover:bg-gray-50">
              {Object.values(row).map((cell, i) => (
                <td key={i} className="px-4 py-2">
                  {formatText(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default PendingTaskTable;

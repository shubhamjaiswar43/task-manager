import React, { useEffect, useState } from "react";
import Summary from "../components/Summary";
import PendingTaskSummary from "../components/PendingTaskSummary";
import PendingTaskTable from "../components/PendingTaskTable";
import Header from "../components/Header";
import CheckLogin from "../components/CheckLogin";

const Dashboard: React.FC = () => {
    interface PTTDatatype {
        priority: Number,
        pendingTasks: Number,
        lapsedTime: Number,
        finishTime: Number
    };
    const [ptsData, setPTSData] = useState({
        pendingTasks: 0,
        lapsedTime: 0,
        finishTime: 0
    });
    const [sData, setSData] = useState({
        totalTasks: 0,
        tasksCompleted: "",
        tasksPending: "",
        avgTimeToComplete: ""
    });
    const [pttData, setPTTData] = useState<PTTDatatype[]>([]);
    const diffBetween = (a: string, b: (string | number)) => {
        // returns a - b in hrs;
        const ams = new Date(a).getTime();
        const bms = new Date(b).getTime();
        if (ams < bms) return 0;
        return (ams - bms) / (1000 * 60 * 60);
    };
    const formatNumber = (val: number) => {
        if (Number.isInteger(val)) return String(val);
        return val.toFixed(2);
    };
    const getData = async () => {
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
                const cptsData = {
                    pendingTasks: 0,
                    lapsedTime: 0,
                    finishTime: 0
                };
                const csData = {
                    totalTasks: res.tasks.length,
                    tasksCompleted: "",
                    tasksPending: "",
                    avgTimeToComplete: ""
                };
                const forPTT = [{ pendingTasks: 0, lapsedTime: 0, finishTime: 0 },
                { pendingTasks: 0, lapsedTime: 0, finishTime: 0 },
                { pendingTasks: 0, lapsedTime: 0, finishTime: 0 },
                { pendingTasks: 0, lapsedTime: 0, finishTime: 0 },
                { pendingTasks: 0, lapsedTime: 0, finishTime: 0 },
                { pendingTasks: 0, lapsedTime: 0, finishTime: 0 }
                ]
                let totalTimeToFinish = 0;
                for (const task of res.tasks) {
                    if (task.status === "Pending") {
                        forPTT[task.priority].pendingTasks++;
                        forPTT[task.priority].lapsedTime += diffBetween(task.endDate, task.startDate);
                        forPTT[task.priority].finishTime += diffBetween(task.endDate, Date.now());
                    } else {
                        totalTimeToFinish += diffBetween(task.endDate, task.startDate);
                    }
                }
                const cpptData = [];
                for (let p = 1; p <= 5; p++) {
                    cptsData.pendingTasks += forPTT[p].pendingTasks;
                    cptsData.lapsedTime += forPTT[p].lapsedTime;
                    cptsData.finishTime += forPTT[p].finishTime;
                    cpptData.push({ priority: p, ...forPTT[p] });
                }
                let pendingTaskPercent = csData.totalTasks === 0 ? 0 : (cptsData.pendingTasks / csData.totalTasks) * 100;
                csData.tasksPending = `${formatNumber(pendingTaskPercent)} %`;
                csData.tasksCompleted = `${formatNumber(100 - pendingTaskPercent)} %`;
                csData.avgTimeToComplete = `${formatNumber(totalTimeToFinish / (csData.totalTasks - cptsData.pendingTasks))} hrs`;
                setPTSData(cptsData);
                setSData(csData);
                setPTTData(cpptData);
            }
        });
    };
    useEffect(() => { getData(); }, []);
    return (
        <>
            <CheckLogin />
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="px-8 py-6">
                    <h2 className="mb-6 text-3xl font-semibold text-gray-800">Dashboard</h2>
                    <Summary data={sData} />
                    <PendingTaskSummary data={ptsData} />
                    <PendingTaskTable data={pttData} />
                </main>
            </div>
        </>
    );
};

export default Dashboard;

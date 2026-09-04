import apiClient from "../../util/apiClient";
import React, { useEffect, useState } from "react";

interface Activity {
    id: number;
    activity_name: string;
    /** First month, kept by the API for older clients. */
    month: number;
    /** Every month the activity runs in. */
    months?: number[];
}

interface ActivitiesViewProps {
    projectCode: number;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({ projectCode }) => {
    const [activities, setActivities] = useState<Activity[]>([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await apiClient.get(`/api/project-activity/${projectCode}`);
                setActivities(response.data.activities || []);
            } catch (error) {
                console.error("Failed to fetch activities", error);
            }
        };
        fetchActivities();
    }, [projectCode]);

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] divide-y divide-gray-200 border border-gray-300">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fəaliyyət</th>
                        {[...Array(12)].map((_, i) => (
                            <th key={i} className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                                {i + 1}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {activities.map((activity, index) => {
                        // An activity may span several months; `month` alone is
                        // what an older row (or an older API) carries.
                        const months = activity.months ?? [activity.month];
                        return (
                            <tr key={activity.id} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-sm text-gray-700">{index + 1}</td>
                                <td className="px-3 py-2 text-sm text-gray-700">{activity.activity_name}</td>
                                {[...Array(12)].map((_, monthIndex) => (
                                    <td key={monthIndex} className="px-3 py-2 text-center text-sm text-gray-700">
                                        {months.includes(monthIndex + 1) ? "✅" : ""}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

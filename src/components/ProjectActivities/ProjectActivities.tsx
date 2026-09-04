import { useEffect, useState } from "react";
import apiClient from "../../util/apiClient";
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from "@mui/material/CircularProgress";
import Skeleton from "@mui/material/Skeleton";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());

interface Activity {
    id?: number;
    name: string;
    months: string[];
    created?: boolean;
    isEditing?: boolean;
}

interface ProjectActivity {
    id: number;
    activity_name: string;
    /** First month, kept by the API for older clients. */
    month: number;
    /** Every month the activity runs in. */
    months: number[];
    project_code: number;
    created_at: string;
    updated_at: string | null;
}

/**
 * `projectCode` defaults to the signed-in lead's ACTIVE project. The archive
 * edit page passes an explicit code so a past project's plan can be edited.
 */
const ProjectActivitiesTable = ({ projectCode: projectCodeProp }: { projectCode?: number } = {}) => {
    const activeProjectCode = useSelector((state: RootState) => state.auth.projectCode);
    const projectCode = projectCodeProp ?? activeProjectCode;
    const [activities, setActivities] = useState<Activity[]>(
        Array.from({ length: 15 }, (_) => ({
            name: "",
            months: [] as string[],
            created: false,
            isEditing: false
        }))
    );

    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // ✅ Fetch existing activities
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                setInitialLoading(true);
                const res = await apiClient.get<{ message: string; activities: ProjectActivity[]; status_code: number }>(
                    `/api/project-activity/${projectCode}`
                );
                if (res.data.activities) {
                    const existing = res.data.activities.map((a) => ({
                        id: a.id,
                        name: a.activity_name,
                        // `months` is the current field; fall back to the single
                        // `month` for a row written before activities could span.
                        months: (a.months ?? [a.month]).map(String),
                        created: true,
                        isEditing: false
                    }));
                    setActivities((prev) => [...existing, ...prev.slice(existing.length)]);
                }
            } catch (err) {
                console.error("Error fetching project activities:", err);
            } finally {
                setInitialLoading(false);
            }
        };
        fetchActivities();
    }, [projectCode]);

    // ✅ Handle name input
    const handleNameChange = (index: number, newName: string) => {
        setActivities((prev) =>
            prev.map((act, i) => (i === index ? { ...act, name: newName } : act))
        );
    };

    // ✅ Handle month selection — an activity may run over several months
    const handleMonthChange = (index: number, selectedMonth: string) => {
        setActivities((prev) =>
            prev.map((act, i) =>
                i === index
                    ? {
                        ...act,
                        months: act.months.includes(selectedMonth)
                            ? act.months.filter((m) => m !== selectedMonth)
                            : [...act.months, selectedMonth].sort((a, b) => +a - +b)
                    }
                    : act
            )
        );
    };

    // ✅ Create activity (POST to Flask)
    const handleCreate = async (index: number) => {
        const activity = activities[index];
        if (!activity.name.trim() || activity.months.length === 0) {
            alert("Fəaliyyət adı və ən azı bir ay seçilməlidir!");
            return;
        }

        try {
            setLoading(true);
            const res = await apiClient.post("/api/project-activity/create", {
                activity_name: activity.name,
                months: activity.months.map(Number),
                project_code: projectCode
            });

            // Keep the id the server assigned, otherwise the row cannot be
            // edited or deleted until the page is reloaded.
            const created = res.data?.activity;
            setActivities((prev) =>
                prev.map((act, i) =>
                    i === index ? { ...act, created: true, id: created?.id ?? act.id } : act
                )
            );
        } catch (err) {
            console.error("Error creating activity:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Start editing an activity
    const handleEdit = (index: number) => {
        setActivities((prev) =>
            prev.map((act, i) => ({
                ...act,
                isEditing: i === index,
            }))
        );
    };

    // ✅ Save edited activity (PATCH to Flask)
    const handleSave = async (index: number) => {
        const activity = activities[index];
        if (!activity.name.trim() || activity.months.length === 0) {
            alert("Fəaliyyət adı və ən azı bir ay seçilməlidir!");
            return;
        }
        if (!activity.id) {
            alert("Fəaliyyətin ID-si tapılmadı.");
            return;
        }

        try {
            setLoading(true);
            await apiClient.patch(`/api/project-activity/update/${activity.id}`, {
                activity_name: activity.name,
                months: activity.months.map(Number),
            });

            setActivities((prev) =>
                prev.map((act, i) =>
                    i === index ? { ...act, created: true, isEditing: false } : act
                )
            );
        } catch (err) {
            console.error("Error updating activity:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Delete an activity
    const handleDelete = async (index: number) => {
        const activity = activities[index];
        if (!activity.id) {
            alert("Silinəcək fəaliyyət tapılmadı.");
            return;
        }

        if (!window.confirm("Bu fəaliyyəti silmək istədiyinizə əminsiniz?")) return;

        try {
            setLoading(true);
            await apiClient.delete(`/api/project-activity/delete/${activity.id}`);
            setActivities((prev) => prev.filter((_, i) => i !== index));
        } catch (err) {
            console.error("Error deleting activity:", err);
        } finally {
            setLoading(false);
        }
    };

    const isAnyEditing = activities.some((act) => act.isEditing);

    return (
        <div className="p-4">
            {projectCode ? (
                <h2 className="text-2xl font-bold mb-4">
                Layihə Fəaliyyətləri (Proyekt kodu: {projectCode.toString()})
            </h2>
            ) : null}

            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                Bir fəaliyyət üçün <span className="font-semibold">bir neçə ay</span> seçə bilərsiniz.
                Eyni ayda bir neçə fəaliyyət də ola bilər.
            </p>

            <div className="max-w-full overflow-x-auto">
            <table className="table-auto border-collapse border border-gray-300 w-full min-w-[900px]">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2">#</th>
                        <th className="border border-gray-300 px-4 py-2">Fəaliyyət</th>
                        {months.map((month) => (
                            <th key={month} className="border border-gray-300 px-4 py-2">
                                {month}
                            </th>
                        ))}
                        <th className="border border-gray-300 px-4 py-2">Əməliyyat</th>
                    </tr>
                </thead>

                <tbody>
                    {initialLoading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                            <tr key={i}>
                                <td className="border border-gray-300 text-center">
                                    <Skeleton variant="text" width={20} />
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <Skeleton variant="rectangular" height={40} />
                                </td>
                                {months.map((_, j) => (
                                    <td key={j} className="border border-gray-300 text-center">
                                        <Skeleton variant="circular" width={20} height={20} />
                                    </td>
                                ))}
                                <td className="border border-gray-300 text-center">
                                    <Skeleton variant="circular" width={32} height={32} />
                                </td>
                            </tr>
                        ))
                    ) : (
                        activities.map((activity, index) => {
                            // const isSelectedByOther =
                            //     selectedMonths.has(activity.months[0]) &&
                            //     !activity.months.includes(activity.months[0]);
                            const disableInputs = isAnyEditing && !activity.isEditing;

                            return (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 text-center">{index + 1}</td>

                                    <td className="border border-gray-300 p-2">
                                        <textarea
                                            value={activity.name}
                                            placeholder="Fəaliyyətin adını daxil edin"
                                            onChange={(e) => handleNameChange(index, e.target.value)}
                                            className="w-full border border-gray-300 rounded px-2 py-1 h-20"
                                            disabled={disableInputs || (!activity.isEditing && activity.created)}
                                        />
                                    </td>

                                    {/* Several activities may run in the same month, and one
                                        activity may run across several — no exclusivity here. */}
                                    {months.map((month) => (
                                        <td key={month} className="border border-gray-300 text-center">
                                            <input
                                                type="checkbox"
                                                aria-label={`${month}-ci ay`}
                                                className="h-4 w-4 cursor-pointer accent-brand-600 disabled:cursor-not-allowed"
                                                checked={activity.months.includes(month)}
                                                onChange={() => handleMonthChange(index, month)}
                                                disabled={
                                                    disableInputs ||
                                                    (!activity.isEditing && activity.created)
                                                }
                                            />
                                        </td>
                                    ))}

                                    <td className="border border-gray-300 text-center">
                                        {!activity.created ? (
                                            <button
                                                onClick={() => handleCreate(index)}
                                                className="bg-green-600 hover:text-green-800 disabled:text-gray-400 rounded-[10px] p-[10px]"
                                                disabled={loading || isAnyEditing}
                                            >
                                                {loading ? <CircularProgress size={20} color="inherit" /> : <DoneIcon className="text-white" />}
                                            </button>
                                        ) : activity.isEditing ? (
                                            <button
                                                onClick={() => handleSave(index)}
                                                className="bg-green-600 hover:text-green-800 disabled:text-gray-400 rounded-[10px] p-[10px]"
                                                disabled={loading}
                                            >
                                                {loading ? <CircularProgress size={20} color="inherit" /> : <DoneIcon className="text-white" />}
                                            </button>
                                        ) : (
                                            <>
                                                <span className="text-gray-400 mr-2">✔️</span>
                                                <button
                                                    onClick={() => handleEdit(index)}
                                                    className="bg-brand-600 hover:bg-brand-700 text-white rounded-[10px] p-[10px] mr-2"
                                                    disabled={isAnyEditing}
                                                    title="Edit"
                                                >
                                                    {loading ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(index)}
                                                    className="bg-red-600 hover:bg-red-700 text-white rounded-[10px] p-[10px]"
                                                    disabled={loading}
                                                    title="Delete"
                                                >
                                                    {loading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
            </div>
        </div>
    );
};

export default ProjectActivitiesTable;
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiClient from "../util/apiClient";
import { RootState } from "../redux/store";
import { setGlobalIsCollaborator } from "../redux/slices/authSlice";

export interface CollaborationStatus {
    /** Projects of the running competition this person has already joined. */
    projectCodes: number[];
    usedSlots: number;
    /** How many projects this person's role may join per competition. */
    allowedSlots: number;
    remainingSlots: number;
    canJoinMore: boolean;
}

const EMPTY: CollaborationStatus = {
    projectCodes: [],
    usedSlots: 0,
    allowedSlots: 0,
    remainingSlots: 0,
    canJoinMore: false,
};

/**
 * How many projects the signed-in user may still join, and which ones they are
 * already on.
 *
 * Sign-in caches a single `isCollaborator` boolean, which cannot express "on
 * one of my two projects" and goes stale the moment a lead or an admin changes
 * a team. Every screen offering "İştirakçı Ol" reads this instead, and the
 * cached flag is kept in step for the parts of the app that still use it.
 */
export function useCollaborationStatus() {
    const dispatch = useDispatch();
    const projectRole = useSelector((state: RootState) => state.auth.projectRole);
    const [status, setStatus] = useState<CollaborationStatus>(EMPTY);
    const [loading, setLoading] = useState(true);

    const refresh = useCallback(async () => {
        // Admins never join teams; asking would only add a pointless request.
        if (projectRole !== 0 && projectRole !== 1) {
            setStatus(EMPTY);
            setLoading(false);
            return;
        }

        try {
            const response = await apiClient.get("/api/my-collaborator-status");
            const data = response.data?.data ?? {};
            const next: CollaborationStatus = {
                projectCodes: data.project_codes ?? [],
                usedSlots: data.used_slots ?? 0,
                allowedSlots: data.allowed_slots ?? 0,
                remainingSlots: data.remaining_slots ?? 0,
                canJoinMore: !!data.can_join_more,
            };
            setStatus(next);
            dispatch(setGlobalIsCollaborator(next.projectCodes.length > 0));
        } catch (error) {
            console.error("Failed to fetch collaboration status:", error);
        } finally {
            setLoading(false);
        }
    }, [projectRole, dispatch]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { ...status, loading, refresh };
}

export default useCollaborationStatus;

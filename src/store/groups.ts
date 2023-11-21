import {create} from "zustand";
import Group from "@/types/group";
import {persist} from "zustand/middleware";

type GroupsParams = {
    groups: Group[],
    setGroups: (groups: Group[]) => void,
}

export const useGroupsStore = create<GroupsParams>()(persist(set => ({
    groups: [],
    setGroups: (groups) => set({groups})
}), {name: 'groups-store'}))
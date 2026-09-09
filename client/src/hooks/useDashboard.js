import { useQuery } from "@tanstack/react-query";
import { getLearnerDashboard } from "../api/dashboard.api";

export function useDashboard(){

    return useQuery({

        queryKey:["dashboard"],

        queryFn:getLearnerDashboard

    });

}
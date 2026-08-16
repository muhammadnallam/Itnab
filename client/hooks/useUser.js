"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
    getProfile,
    updateProfile,
    updateSocialLinks,
    updatePassword,
    deleteAccount,
} from "@/lib/api/user";

export function useUser(username) {
    const qc = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: queryKeys.user(username),
        queryFn: () => getProfile(username),
        enabled: !!username,
    });

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            if (username) {
                qc.invalidateQueries({ queryKey: queryKeys.user(username) });
            }
        },
    });

    const updateSocialLinksMutation = useMutation({
        mutationFn: updateSocialLinks,
        onSuccess: () => {
            if (username) {
                qc.invalidateQueries({ queryKey: queryKeys.user(username) });
            }
        },
    });

    const updatePasswordMutation = useMutation({
        mutationFn: updatePassword,
    });

    const deleteAccountMutation = useMutation({
        mutationFn: deleteAccount,
        onSuccess: () => {
            if (username) {
                qc.removeQueries({ queryKey: queryKeys.user(username) });
            }
        },
    });

    return {
        profile: data,
        isLoading,
        error,
        updateProfile: updateProfileMutation.mutateAsync,
        isUpdatingProfile: updateProfileMutation.isPending,
        updateSocialLinks: updateSocialLinksMutation.mutateAsync,
        isUpdatingSocialLinks: updateSocialLinksMutation.isPending,
        updatePassword: updatePasswordMutation.mutateAsync,
        isUpdatingPassword: updatePasswordMutation.isPending,
        deleteAccount: deleteAccountMutation.mutateAsync,
        isDeleting: deleteAccountMutation.isPending,
    };
}
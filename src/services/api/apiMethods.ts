import { API } from "@foxogram/api";
import { REST } from "@foxogram/rest";
import { ChannelType } from "@foxogram/api-types";

const apiUrl = import.meta.env.PROD
    ? "https://api.foxogram.su"
    : "https://api.dev.foxogram.su/";

export const getAuthToken = (): string | null => localStorage.getItem("authToken");
const setAuthToken = (token: string): void => localStorage.setItem("authToken", token);
const removeAuthToken = (): void => localStorage.removeItem("authToken");

const defaultOptions = {
    baseURL: apiUrl,
};

const rest = new REST(defaultOptions);
const token = getAuthToken();
if (token) {
    rest.setToken(token);
}

const foxogramAPI = new API(rest);

export const apiMethods = {
    login: async (email: string, password: string) => {
        const token = await foxogramAPI.auth.login({ email, password });
        setAuthToken(token.accessToken);
        return token;
    },

    register: async (username: string, email: string, password: string) => {
        const token = await foxogramAPI.auth.register({ email, password, username });
        setAuthToken(token.accessToken);
        return token;
    },

    resendEmailVerification: () => foxogramAPI.auth.resendEmail(),
    resetPassword: (email: string) => foxogramAPI.auth.resetPassword({ email }),
    confirmResetPassword: (email: string, code: string, newPassword: string) => foxogramAPI.auth.resetPasswordConfirm({ email, code, newPassword }),
    verifyEmail: (code: string) => foxogramAPI.auth.verifyEmail({ code }),

    getCurrentUser: () => foxogramAPI.user.current(),
    editUser: (body: { name: string; email: string }) => foxogramAPI.user.edit(body),
    deleteUser: (body: { password: string }) => {
        const result = foxogramAPI.user.delete(body);
        removeAuthToken();
        return result;
    },
    confirmDeleteUser: (body: { password: string; code: string }) => foxogramAPI.user.confirmDelete(body),
    userChannelsList: () => foxogramAPI.user.channels(),

    createChannel: (body: { displayName: string; name: string; type: ChannelType }) => foxogramAPI.channel.create(body),
    deleteChannel: (channelName: string) => foxogramAPI.channel.delete(channelName),
    editChannel: (channelName: string, body: { name?: string }) => foxogramAPI.channel.edit(channelName, body),
    getChannel: (channelName: string) => foxogramAPI.channel.get(channelName),
    joinChannel: (channelName: string) => foxogramAPI.channel.join(channelName),
    leaveChannel: (channelName: string) => foxogramAPI.channel.leave(channelName),
    getChannelMember: (channelName: string, memberKey: string) => foxogramAPI.channel.member(channelName, memberKey),
    listChannelMembers: (channelName: string) => foxogramAPI.channel.members(channelName),
};
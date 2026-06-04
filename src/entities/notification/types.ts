export interface Notification {
    id: number;
    userId: number;
    title: string;
    body: string;
    link: string;
    isRead: boolean;
    createdAt: string;
}

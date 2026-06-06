export interface NotificationSource {
    authorId: number;
    userName: string;
    imgUrl: string | null;
}

export interface Notification {
    id: number;
    userId: number;
    title: string;
    body: string;
    link: string;
    isRead: boolean;
    createdAt: string;
    source: NotificationSource | null;
}

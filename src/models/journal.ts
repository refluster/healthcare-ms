export type Journal = {
    id: string;
    userId: string;
    author: 'user' | 'system';
    content: 'string';
    createdAt: string;
    updatedAt: string;
};

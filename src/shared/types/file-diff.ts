export type FilePath = string;

export type FileChange = {
    status: string;
    patch: string;
    filename: string;
};

export type RepoDiff = Record<FilePath, FileChange>;

export type FilePath = string;

export type FileStatus = 'added' | 'modified' | 'deleted';

export type FileChange = {
    status: FileStatus;
    patch: string;
    filename: string;
};

export type RepoDiff = Record<FilePath, FileChange>;

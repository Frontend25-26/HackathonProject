export const getChangePatch = (fileName: string, patch: string) => {
    return `
diff --git a/${fileName} b/${fileName}
--- a/${fileName}
+++ b/${fileName}
${patch}
`;
};

export const getCreatePatch = (fileName: string, patch: string) => {
    return `
diff --git a/${fileName} b/${fileName}
new file mode 100644
--- /dev/null
+++ b/${fileName}
${patch}
`;
};

export const getDeletePatch = (fileName: string, patch: string) => {
    return `
diff --git a/${fileName} b/${fileName}
deleted file mode 100644
--- a/${fileName}
+++ /dev/null
${patch}
`;
};

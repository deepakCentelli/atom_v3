import {
    contextBridge,
    ipcRenderer,
    webUtils
} from "electron";


contextBridge.exposeInMainWorld(
    "electronAPI",
    {

        logRendererDiagnostic: (detail: { event: string; message?: string; source?: string; line?: number; column?: number; errorName?: string }) =>
            ipcRenderer.send("renderer-diagnostic", detail),

        getProjectYears: () =>
            ipcRenderer.invoke(
                "get-project-years"
            ),


        getProjectMonths: (
            year: string
        ) =>
            ipcRenderer.invoke(
                "get-project-months",
                year
            ),


        getProjects: (
            year: string,
            month: string
        ) =>
            ipcRenderer.invoke(
                "get-projects",
                year,
                month
            ),

        getProjectFolderTabs: () => ipcRenderer.invoke("get-project-folder-tabs"),
        createProjectFolderTab: (name: string) => ipcRenderer.invoke("create-project-folder-tab", name),
        getProjectsInFolderTab: (folderPath: string) => ipcRenderer.invoke("get-projects-in-folder-tab", folderPath),
        createProjectInFolderTab: (folderPath: string, name: string, details?: { description?: string; status?: ProjectStatus; project_type?: ProjectType; deadline?: string; created_at?: string; templateId?: string | null }) => ipcRenderer.invoke("create-project-in-folder-tab", folderPath, name, details),

        getProjectContents: (
            yearOrPath: string,
            month?: string,
            projectName?: string
        ) =>
            ipcRenderer.invoke(
                "get-project-contents",
                yearOrPath,
                month,
                projectName
            ),

        getProjectFolderContents: (
            yearOrPath: string,
            month: string,
            projectName?: string,
            folderName?: string
        ) =>
            ipcRenderer.invoke(
                "get-project-folder-contents",
                yearOrPath,
                month,
                projectName,
                folderName
            ),

        createProject: (
            year: string,
            month: string,
            projectName: string,
            details?: { description?: string; status?: ProjectStatus; project_type?: ProjectType; deadline?: string; created_at?: string; templateId?: string | null; }
        ) =>
            ipcRenderer.invoke(
                "create-project",
                year,
                month,
                projectName,
                details
            ),

        updateProjectDetails: (
            ...args: [string, ProjectUpdateDetails] | [string, string, string, ProjectUpdateDetails]
        ) => ipcRenderer.invoke("update-project-details", ...args),

        toggleProjectPin: (
            year: string, month: string, projectName: string
        ) => ipcRenderer.invoke("toggle-project-pin", year, month, projectName),

        toggleProjectPinByPath: (
            projectPath: string
        ) => ipcRenderer.invoke("toggle-project-pin-by-path", projectPath),

        getPinnedProjects: () => ipcRenderer.invoke("get-pinned-projects"),

        getRecurringProjects: () => ipcRenderer.invoke("get-recurring-projects"),

        getDashboardData: () => ipcRenderer.invoke("get-dashboard-data"),

        punchIn: () => ipcRenderer.invoke("punch-in"),

        punchOut: () => ipcRenderer.invoke("punch-out"),

        getAttendanceData: () => ipcRenderer.invoke("get-attendance-data"),

        getMonthlyAttendance: (year?: number, month?: number) =>
            ipcRenderer.invoke("get-monthly-attendance", year, month),

        createAttendanceRecord: (record: { date: string; punchIn?: string; punchOut?: string; attendanceType?: "regular" | "leave" | "holiday"; breakDurations?: number[]; halfDayPart?: "first" | "second" | null }) =>
            ipcRenderer.invoke("create-attendance-record", record),

        updateAttendanceRecord: (id: string, record: { date: string; punchIn?: string; punchOut?: string; attendanceType: "regular" | "leave" | "holiday"; breakDurations?: number[]; halfDayPart?: "first" | "second" | null; replaceDateRecords?: boolean }) =>
            ipcRenderer.invoke("update-attendance-record", id, record),

        updateAttendanceBreaks: (id: string, breaks: number[]) => ipcRenderer.invoke("update-attendance-breaks", id, breaks),

        deleteAttendanceRecord: (id: string) =>
            ipcRenderer.invoke("delete-attendance-record", id),

        getProjectsRoot: () =>
            ipcRenderer.invoke(
                "get-projects-root"
            ),

        getSettings: () => ipcRenderer.invoke("get-settings"),
        setAttendancePreferences: (preferences: { userName: string; quotes: string[]; targetAttendanceSeconds: number; halfDayTargetSeconds: number }) =>
            ipcRenderer.invoke("set-attendance-preferences", preferences),

        chooseProjectsRoot: () =>
            ipcRenderer.invoke(
                "choose-projects-root"
            ),

        setProjectsRoot: (
            projectsRoot: string
        ) =>
            ipcRenderer.invoke(
                "set-projects-root",
                projectsRoot
            ),

            chooseRecurringProjectsRoot: () => ipcRenderer.invoke("choose-recurring-projects-root"),
            setRecurringProjectsRoot: (root: string) => ipcRenderer.invoke("set-recurring-projects-root", root),
            setAccentColor: (color: string) => ipcRenderer.invoke("set-accent-color", color),

        getDirectoryItems: (
            type: "label" | "person"
        ) =>
            ipcRenderer.invoke(
                "get-directory-items",
                type
            ),

        createDirectoryItem: (
            type: "label" | "person",
            item: { name: string; color: string; }
        ) =>
            ipcRenderer.invoke(
                "create-directory-item",
                type,
                item
            ),

        updateDirectoryItem: (
            type: "label" | "person",
            item: { id: string; name: string; color: string; }
        ) =>
            ipcRenderer.invoke(
                "update-directory-item",
                type,
                item
            ),

        deleteDirectoryItem: (
            type: "label" | "person",
            id: string
        ) =>
            ipcRenderer.invoke(
                "delete-directory-item",
                type,
                id
            ),

        getProjectTags: (...args: [string] | [string, string, string]) =>
            ipcRenderer.invoke("get-project-tags", ...args),

        setProjectTags: (...args: [string, { labelIds: string[]; personIds: string[] }] | [string, string, string, { labelIds: string[]; personIds: string[] }]) =>
            ipcRenderer.invoke("set-project-tags", ...args),

        getProjectNotes: (
            ...args: [string] | [string, string, string]
        ) => ipcRenderer.invoke("get-project-notes", ...args),

        getAllNotes: () =>
            ipcRenderer.invoke("get-all-notes"),

        createGeneralNote: (title?: string, content?: string) => ipcRenderer.invoke("create-general-note", title, content),

        getProjectTemplates: () => ipcRenderer.invoke("get-project-templates"),
        chooseTemplateFile: () => ipcRenderer.invoke("choose-template-file"),
        saveProjectTemplate: (template: { id?: string; name: string; project_type: ProjectType; description?: string; source_file_path?: string | null }) => ipcRenderer.invoke("save-project-template", template),
        deleteProjectTemplate: (id: string) => ipcRenderer.invoke("delete-project-template", id),

        createNote: (...args: [string, string, string] | [string, string, string, string, string]) =>
            ipcRenderer.invoke("create-note", ...args),

        updateNote: (
            noteId: string,
            content: string,
            title?: string,
            projectId?: string | null
        ) =>
            ipcRenderer.invoke(
                "update-note",
                noteId,
                content,
                title ?? "",
                projectId
            ),

        deleteNote: (noteId: string) =>
            ipcRenderer.invoke(
                "delete-note",
                noteId
            ),

        openProjectContent: (
            ...args: [string, string] | [string, string, string, string]
        ) => ipcRenderer.invoke("open-project-content", ...args),

        copyProjectPath: (projectPath: string) =>
            ipcRenderer.invoke("copy-project-path", projectPath),

        shareFile: (filePath: string) =>
            ipcRenderer.invoke("share-file", filePath),

        createProjectFolder: (projectPath: string, folderPath: string, folderName: string) =>
            ipcRenderer.invoke("create-project-folder", projectPath, folderPath, folderName),

        getDroppedFilePath: (file: File) => webUtils.getPathForFile(file),

        importProjectFiles: (projectPath: string, targetFolder: string, sourcePaths: string[]) =>
            ipcRenderer.invoke("import-project-files", projectPath, targetFolder, sourcePaths),

        startFileDrag: (projectPath: string, relativePaths: string[]) =>
            ipcRenderer.send("start-file-drag", projectPath, relativePaths),

        moveProjectItems: (projectPath: string, sourcePaths: string[], destinationFolder: string) =>
            ipcRenderer.invoke("move-project-items", projectPath, sourcePaths, destinationFolder),

        renameFile: (...args: [string, string, string] | [string, string, string, string, string]) =>
            ipcRenderer.invoke("rename-file", ...args),

        duplicateFile: (...args: [string, string] | [string, string, string, string]) =>
            ipcRenderer.invoke("duplicate-file", ...args),

        deleteFile: (...args: [string, string] | [string, string, string, string]) =>
            ipcRenderer.invoke("delete-file", ...args),

        renameProject: (...args: [string, string] | [string, string, string, string]) =>
            ipcRenderer.invoke("rename-project", ...args),

        duplicateProject: (
            year: string,
            month: string,
            projectName: string
        ) =>
            ipcRenderer.invoke(
                "duplicate-project",
                year,
                month,
                projectName
            ),

        deleteProject: (...args: [string] | [string, string, string]) =>
            ipcRenderer.invoke("delete-project", ...args),

    }
);

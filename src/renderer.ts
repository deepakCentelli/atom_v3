import './index.css';

import projectTypeGraphicsIcon from "./icons/project_type_graphics.svg";
import projectTypeDocumentIcon from "./icons/project_type_document.svg";
import projectTypeCodeIcon from "./icons/project_type_code.svg";
import projectTypePresentationIcon from "./icons/project_type_ppt.svg";
import projectTypeVideoIcon from "./icons/project_type_video.svg";
import projectTypeImageIcon from "./icons/project_type_image.svg";
import projectTypeDefaultIcon from "./icons/project_type_default.svg";
import openPathIcon from "./icons/open_path.svg";
import copyPathIcon from "./icons/copy_path.svg";
import editProjectIcon from "./icons/edit_project.svg";
import pdfIcon from "./icons/appIcons/pdf.svg";
import photoshopIcon from "./icons/appIcons/photoshop.svg";
import illustratorIcon from "./icons/appIcons/illustrator.svg";
import svgIcon from "./icons/appIcons/svg.svg";
import wordIcon from "./icons/appIcons/word.svg";
import excelIcon from "./icons/appIcons/excel.svg";
import powerpointIcon from "./icons/appIcons/powerpoint.svg";
import htmlIcon from "./icons/appIcons/html.svg";
import imagesIcon from "./icons/appIcons/images.svg";
import videoIcon from "./icons/appIcons/video.svg";
import textIcon from "./icons/appIcons/text.svg";
import xdIcon from "./icons/appIcons/xd.svg";
import premierProIcon from "./icons/appIcons/premierpro.svg";
import affinityIcon from "./icons/appIcons/affinity.svg";
import indesignIcon from "./icons/appIcons/indesign.svg";
import userIcon from "./icons/user.svg";
import labelIcon from "./icons/label.svg";
import renameIcon from "./icons/rename.svg";
import duplicateIcon from "./icons/duplicate 1.svg";
import deleteIcon from "./icons/delete.svg";
import openFileIcon from "./icons/openFile.svg";
import shareIcon from "./icons/share.svg";


// ==========================
// DOM
// ==========================

const projectList =
    document.querySelector(".project-list");

const projectTitle =
    document.querySelector(".project-header h1");

const projectDescription =
    document.querySelector(".project-header p");

const fileList =
    document.querySelector(".file-list");
const directorySettingsWorkspace = document.getElementById("directory-settings-workspace");

const fileViewControls =
    document.querySelector(".file-view-controls") as HTMLElement | null;

const notesContent =
    document.querySelector(".notes-content");

const projectDate =
    document.querySelector(".project-date");

const projectTagsHeader =
    document.querySelector(".project-tags-header");

const yearSelect =
    document.querySelector("#year-select") as HTMLSelectElement;

const closeProjectTagPickers = () => {
    if (!projectTagsHeader) return;
    projectTagsHeader.querySelectorAll<HTMLElement>(".tag-picker").forEach(picker => {
        picker.classList.remove("visible");
    });
};

const handleProjectTagDocumentClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!projectTagsHeader || !projectTagsHeader.contains(target)) {
        closeProjectTagPickers();
    }
};

let projectTagDocumentHandlerAttached = false;

const monthSelect =
    document.querySelector("#month-select") as HTMLSelectElement;
const notesSearchInput = document.querySelector<HTMLInputElement>("#notes-search-input");

const createProjectButton =
    document.querySelector("#create-project") as HTMLButtonElement | null;

const createNoteButton =
    document.querySelector("#create-note-button") as HTMLButtonElement | null;
const notesPanelToggleButton =
    document.querySelector<HTMLButtonElement>("#toggle-notes-panel");
const notesPanelToggleMarkup = notesPanelToggleButton?.innerHTML ?? "";

const settingsButton =
    document.querySelector(".settings-button");

if (createNoteButton) {
    createNoteButton.disabled = true;
}

notesPanelToggleButton?.addEventListener("click", () => {
    const workspaceContainer = document.querySelector<HTMLElement>("#standard-workspace-view .workspace-container");
    if (!workspaceContainer || !notesPanelToggleButton) return;

    setNotesPanelCollapsed(!workspaceContainer.classList.contains("notes-collapsed"));
});

function setNotesPanelCollapsed(isCollapsed: boolean) {
    const workspaceContainer = document.querySelector<HTMLElement>("#standard-workspace-view .workspace-container");
    if (!workspaceContainer || !notesPanelToggleButton) return;

    workspaceContainer.classList.toggle("notes-collapsed", isCollapsed);
    const notesPanel = workspaceContainer.querySelector<HTMLElement>(".notes-panel");
    const notesPanelActions = workspaceContainer.querySelector<HTMLElement>(".notes-panel-actions");
    const fileHeaderActions = workspaceContainer.querySelector<HTMLElement>(".file-header-right");
    if (notesPanel) notesPanel.style.display = isCollapsed ? "none" : "";
    if (isCollapsed) {
        fileHeaderActions?.appendChild(notesPanelToggleButton);
        notesPanelToggleButton.classList.add("notes-restore-button");
        notesPanelToggleButton.textContent = `Notes (${currentNotes.length})`;
    } else {
        notesPanelActions?.appendChild(notesPanelToggleButton);
        notesPanelToggleButton.classList.remove("notes-restore-button");
        notesPanelToggleButton.innerHTML = notesPanelToggleMarkup;
    }
    notesPanelToggleButton.setAttribute("aria-expanded", String(!isCollapsed));
    notesPanelToggleButton.setAttribute("aria-label", `${isCollapsed ? "Expand" : "Collapse"} Notes panel`);
    notesPanelToggleButton.title = `${isCollapsed ? "Expand" : "Collapse"} Notes panel`;
}

function updateNotesPanelToggleCount() {
    if (notesPanelToggleButton?.classList.contains("notes-restore-button")) {
        notesPanelToggleButton.textContent = `Notes (${currentNotes.length})`;
    }
}

const panelTitle =
    document.querySelector("#panel-title");

const dateSelector =
    document.querySelector(".date-selector") as HTMLElement;

const fileSectionTitle =
    document.querySelector(".file-section .section-title");

const notesPanelTitle =
    document.querySelector(".notes-panel .section-title");

const activeTabContent =
    document.querySelector<HTMLElement>("#active-tab-content");

let notesView: HTMLElement | null = null;
let notesAddButton: HTMLButtonElement | null = null;
let notesYearSelect: HTMLSelectElement | null = null;
let notesMonthSelect: HTMLSelectElement | null = null;
let notesList: HTMLElement | null = null;
let noteTitleInput: HTMLInputElement | null = null;
let noteDisplayDate: HTMLElement | null = null;
let noteEditorContent: HTMLElement | null = null;

const navigationItems =
    document.querySelectorAll<HTMLButtonElement>(".nav-item");

const dashboardView = document.querySelector("#dashboard-view") as HTMLElement;
const attendanceRecordView = document.querySelector("#attendance-record-view") as HTMLElement;
const allAppViews = [
    dashboardView,
    attendanceRecordView,
    document.getElementById("standard-explorer-view"),
    document.getElementById("notes-explorer-view"),
    document.getElementById("settings-explorer-view"),
    document.getElementById("templates-explorer-view"),
    document.getElementById("standard-workspace-view"),
    document.getElementById("directory-settings-workspace"),
    document.getElementById("notes-workspace-view"),
    document.getElementById("settings-workspace-view"),
    document.getElementById("templates-workspace-view")
].filter((view): view is HTMLElement => Boolean(view));

const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


// ==========================
// STATE
// ==========================

let selectedProjectName: string | null = null;
let selectedProject: RealProject | null = null;
let currentProjects: RealProject[] = [];
let currentFolderPath = "";
let activeProjectFolderTab: { name: string; path: string } | null = null;

let activeView: "projects" | "labels" | "people" | "templates" | "settings" | "dashboard" | "attendance" | "pinned" | "recurring" | "notes" =
    "projects";

document.querySelectorAll<HTMLButtonElement>(".project-tab[data-project-tab]").forEach(tab => tab.addEventListener("click", async () => {
    activeProjectFolderTab = null;
    clearWorkspace();
    document.querySelectorAll(".project-tab").forEach(el => el.classList.toggle("active", el === tab));
    await switchView(tab.dataset.projectTab as typeof activeView);
}));

document.getElementById("add-project-folder")?.addEventListener("click", () => showCreateProjectFolderDialog());

function showCreateProjectFolderDialog() {
    const overlay = document.createElement("div");
    overlay.className = "atom-modal-overlay";
    overlay.innerHTML = `
        <div class="atom-modal create-project-modal" role="dialog" aria-modal="true" aria-labelledby="create-project-folder-title">
            <div class="atom-modal-header">
                <div><h2 id="create-project-folder-title">New project tab</h2><p>Create a folder in your main Projects folder.</p></div>
                <button class="atom-modal-close" type="button" aria-label="Close">×</button>
            </div>
            <form class="atom-modal-body project-details-form" id="create-project-folder-form">
                <div class="form-group"><label for="project-folder-name">Folder name</label><input id="project-folder-name" type="text" autocomplete="off" required /><div class="form-error" id="project-folder-error"></div></div>
                <div class="atom-modal-footer"><button class="atom-button secondary" type="button" data-cancel>Cancel</button><button class="atom-button primary" type="submit">Create tab</button></div>
            </form>
        </div>`;
    document.body.appendChild(overlay);
    const form = overlay.querySelector<HTMLFormElement>("#create-project-folder-form")!;
    const input = overlay.querySelector<HTMLInputElement>("#project-folder-name")!;
    const error = overlay.querySelector<HTMLElement>("#project-folder-error")!;
    const close = () => overlay.remove();
    overlay.querySelector(".atom-modal-close")?.addEventListener("click", close);
    overlay.querySelector("[data-cancel]")?.addEventListener("click", close);
    overlay.addEventListener("click", event => { if (event.target === overlay) close(); });
    form.addEventListener("submit", async event => {
        event.preventDefault();
        const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
        submit.disabled = true;
        error.textContent = "";
        try {
            const folder = await window.electronAPI.createProjectFolderTab(input.value.trim());
            close();
            const tab = document.createElement("button");
            tab.className = "project-tab";
            tab.dataset.folderPath = folder.path;
            tab.innerHTML = `📁 <span>${escapeDashboardHtml(folder.name)}</span>`;
            document.getElementById("add-project-folder")?.before(tab);
            tab.addEventListener("click", () => void activateProjectFolderTab(folder, tab));
            await activateProjectFolderTab(folder, tab);
        } catch (cause) {
            error.textContent = cause instanceof Error ? cause.message : "Could not create the project tab.";
            submit.disabled = false;
            input.focus();
        }
    });
    input.focus();
}

async function activateProjectFolderTab(folder: { name: string; path: string }, tab: HTMLButtonElement) {
    await switchView("projects");
    activeProjectFolderTab = folder;
    clearWorkspace();
    document.querySelectorAll(".project-tab").forEach(el => el.classList.toggle("active", el === tab));
    if (panelTitle) panelTitle.textContent = folder.name;
    if (dateSelector) dateSelector.style.display = "flex";
    if (yearSelect) yearSelect.style.display = "none";
    if (monthSelect) monthSelect.style.display = "none";
    const dateIcon = document.querySelector<HTMLElement>(".projects-date-icon");
    if (dateIcon) dateIcon.style.display = "none";
    if (createProjectButton) {
        createProjectButton.style.display = "block";
        createProjectButton.textContent = "+ Add";
    }
    renderProjects(await window.electronAPI.getProjectsInFolderTab(folder.path));
}

function getProjectLocation(projectOrName?: RealProject | string | null): { year: string; month: string; name: string; path: string } {
    let proj: RealProject | undefined;
    if (projectOrName && typeof projectOrName === "object") {
        proj = projectOrName;
    } else if (typeof projectOrName === "string") {
        proj = currentProjects.find(p => p.name === projectOrName || p.path === projectOrName)
            || (selectedProject?.name === projectOrName || selectedProject?.path === projectOrName ? selectedProject : undefined);
    } else {
        proj = selectedProject || undefined;
    }

    if (proj) {
        const normalized = proj.path.replace(/\\/g, "/");
        const segments = normalized.split("/").filter(Boolean);
        const name = proj.name || (segments.length > 0 ? segments[segments.length - 1] : "");
        const month = segments.length >= 2 ? segments[segments.length - 2] : (monthSelect?.value || "");
        const year = segments.length >= 3 ? segments[segments.length - 3] : (yearSelect?.value || "");
        return { year, month, name, path: proj.path };
    }

    const name = typeof projectOrName === "string" ? projectOrName : (selectedProjectName || "");
    const year = yearSelect?.value || "";
    const month = monthSelect?.value || "";
    return { year, month, name, path: "" };
}

function getCurrentFilesFolderPath(): string {
    const projectPath = selectedProject?.path;
    if (!projectPath || !currentFolderPath) return projectPath || "";
    return `${projectPath.replace(/[\\/]$/, "")}\\${currentFolderPath.replace(/^[\\/]+|[\\/]+$/g, "")}`;
}

let currentNotes: NoteRecord[] = [];
let notesTabItems: Array<{ id: string; project_id: string | null; project_name: string; title: string; content: string; created_at: string; updated_at: string }> = [];
let activeNoteId: string | null = null;
let openNoteEditorTimeout: number | null = null;
let activeFileActionMenu: HTMLElement | null = null;
let noteAutosaveTimeout: number | null = null;
let activeProjectActionMenu: HTMLElement | null = null;
const selectedFilePaths = new Set<string>();

function getDroppedFilePaths(dataTransfer: DataTransfer): string[] {
    const getDroppedFilePath = window.electronAPI.getDroppedFilePath;
    if (typeof getDroppedFilePath !== "function") return [];
    return Array.from(dataTransfer.files)
        .map(file => {
            try {
                return getDroppedFilePath(file);
            } catch {
                return "";
            }
        })
        .filter(Boolean);
}

function isPathInsideProject(projectPath: string, filePath: string): boolean {
    const normalize = (value: string) => value.replace(/[\\/]+/g, "/").replace(/\/+$/, "");
    const caseInsensitive = projectPath.includes("\\");
    const root = normalize(projectPath);
    const target = normalize(filePath);
    const comparableRoot = caseInsensitive ? root.toLowerCase() : root;
    const comparableTarget = caseInsensitive ? target.toLowerCase() : target;
    return comparableTarget === comparableRoot || comparableTarget.startsWith(`${comparableRoot}/`);
}

function getAbsoluteProjectPath(projectPath: string, relativePath: string): string {
    const separator = projectPath.includes("\\") ? "\\" : "/";
    const root = projectPath.replace(/[\\/]+$/, "");
    const relative = relativePath.split(/[\\/]+/).filter(Boolean).join(separator);
    return relative ? `${root}${separator}${relative}` : root;
}

function isInternalProjectDrop(dataTransfer: DataTransfer, projectPath = selectedProject?.path): boolean {
    if (!projectPath) return false;
    const paths = getDroppedFilePaths(dataTransfer);
    return paths.length > 0 && paths.every(filePath => isPathInsideProject(projectPath, filePath));
}

async function importDroppedFiles(files: File[], targetFolder = currentFolderPath) {
    const projectPath = selectedProject?.path;
    if (!projectPath || files.length === 0) return;

    const api = window.electronAPI as Partial<typeof window.electronAPI>;
    if (typeof api.getDroppedFilePath !== "function" || typeof api.importProjectFiles !== "function") {
        window.alert("Restart Atom to enable dragging files into projects.");
        return;
    }
    const getDroppedFilePath = api.getDroppedFilePath;
    const importProjectFiles = api.importProjectFiles;

    const sourcePaths = files
        .map(file => getDroppedFilePath(file))
        .filter(Boolean);
    if (sourcePaths.length === 0) {
        window.alert("Atom could not read the dropped file path. Please try again after restarting Atom.");
        return;
    }

    try {
        const result = await importProjectFiles(
            projectPath,
            targetFolder,
            sourcePaths
        );
        selectedFilePaths.clear();
        await loadProjectContents(projectPath, currentFolderPath);

        if (result.imported.length === 0 && result.skipped.length > 0) {
            window.alert("No files were added. Files that already exist or are not valid files were skipped.");
        }
    } catch (error) {
        console.error("Importing dropped files failed:", error);
        const reason = error instanceof Error ? error.message : String(error);
        window.alert(`Could not add the dropped files to this project.\n\n${reason}`);
    }
}

function setupFilesPaneDropZone() {
    if (!fileList) return;

    let dragDepth = 0;
    fileList.addEventListener("dragenter", (event: Event) => {
        const dragEvent = event as DragEvent;
        if (dragEvent.dataTransfer && isInternalProjectDrop(dragEvent.dataTransfer)) return;
        if (!selectedProject || !dragEvent.dataTransfer?.types.includes("Files")) return;
        event.preventDefault();
        dragDepth += 1;
        fileList.classList.add("drop-active");
    });

    fileList.addEventListener("dragover", (event: Event) => {
        const dragEvent = event as DragEvent;
        if (dragEvent.dataTransfer && isInternalProjectDrop(dragEvent.dataTransfer)) return;
        if (!selectedProject || !dragEvent.dataTransfer?.types.includes("Files")) return;
        event.preventDefault();
        dragEvent.dataTransfer.dropEffect = "copy";
        fileList.classList.add("drop-active");
    });

    fileList.addEventListener("dragleave", (event: Event) => {
        const dragEvent = event as DragEvent;
        if (!dragEvent.dataTransfer?.types.includes("Files")) return;
        dragDepth -= 1;
        if (dragDepth <= 0) {
            dragDepth = 0;
            fileList.classList.remove("drop-active");
        }
    });

    fileList.addEventListener("drop", async (event: Event) => {
        const dragEvent = event as DragEvent;
        if (dragEvent.dataTransfer && isInternalProjectDrop(dragEvent.dataTransfer)) {
            // Same-project native drops only move onto a folder card. Dropping
            // elsewhere, including back into the source list, is a silent no-op.
            event.preventDefault();
            event.stopPropagation();
            dragDepth = 0;
            fileList.classList.remove("drop-active");
            return;
        }
        if (!selectedProject || !dragEvent.dataTransfer?.files.length) return;
        event.preventDefault();
        dragDepth = 0;
        fileList.classList.remove("drop-active");
        await importDroppedFiles(Array.from(dragEvent.dataTransfer.files));
    });
}

setupFilesPaneDropZone();

function closeFileActionMenu() {
    const menuButton = activeFileActionMenu?.parentElement?.querySelector<HTMLButtonElement>(".file-more-button");
    menuButton?.setAttribute("aria-expanded", "false");
    activeFileActionMenu?.classList.remove("visible");
    activeFileActionMenu = null;
}

function closeProjectActionMenu() {
    const menuButton = activeProjectActionMenu?.parentElement?.querySelector<HTMLButtonElement>(".project-more-button");
    menuButton?.setAttribute("aria-expanded", "false");
    activeProjectActionMenu?.classList.remove("visible");
    activeProjectActionMenu = null;
}

document.addEventListener("click", event => {
    const target = event.target as HTMLElement;
    if (!target.closest(".file-more-actions")) closeFileActionMenu();
    if (!target.closest(".project-more-actions")) closeProjectActionMenu();
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeFileActionMenu();
        closeProjectActionMenu();
    }
});

function setFileView(view: "list" | "grid") {
    fileList?.classList.toggle("grid-view", view === "grid");

    document.querySelectorAll<HTMLButtonElement>(".file-view-button")
        .forEach(button => {
            button.classList.toggle("active", button.dataset.fileView === view);
            button.setAttribute("aria-pressed", String(button.dataset.fileView === view));
        });
}

document.querySelectorAll<HTMLButtonElement>(".file-view-button")
    .forEach(button => {
        button.addEventListener("click", () => {
            const view = button.dataset.fileView as "list" | "grid";
            if (view) setFileView(view);
        });
    });

document.querySelector<HTMLButtonElement>("#open-project-folder-btn")?.addEventListener("click", async () => {
    const folderPath = getCurrentFilesFolderPath();
    if (!folderPath) return;
    try {
        await window.electronAPI.openProjectContent(folderPath, "");
    } catch (error) {
        console.error("Could not open current files folder:", error);
        window.alert("Could not open the current folder in Explorer.");
    }
});

document.querySelector<HTMLButtonElement>("#copy-project-path-btn")?.addEventListener("click", async event => {
    const folderPath = getCurrentFilesFolderPath();
    if (!folderPath) return;
    const button = event.currentTarget as HTMLButtonElement;
    await window.electronAPI.copyProjectPath(folderPath);
    const originalText = button.textContent;
    button.textContent = "Copied";
    window.setTimeout(() => { button.textContent = originalText || "Copy Path"; }, 1200);
});

document.querySelector<HTMLButtonElement>("#create-folder-btn")?.addEventListener("click", async () => {
    const project = selectedProject;
    const projectPath = project?.path;
    if (!projectPath) return;
    showCreateFolderModal(project);
});

interface NoteRecord {
    id: string;
    project_id: string | null;
    title: string | null;
    content: string;
    created_at: string;
    updated_at: string;
}


// ==========================
// PROJECT TYPE
// ==========================

interface RealProject {
    id: string;
    name: string;
    path: string;
    description: string | null;
    status: ProjectStatus | null;
    project_type: ProjectType;
    deadline: string | null;
    pinned?: number;
    created_at: string;
}

const PROJECT_STATUSES: { value: ProjectStatus; label: string }[] = [
    { value: "not-started", label: "Not started" },
    { value: "in-progress", label: "In Progress" },
    { value: "on-hold", label: "On hold" },
    { value: "cancelled", label: "Cancelled" },
    { value: "completed", label: "Completed" }
];

const PROJECT_TYPES: { value: ProjectType; label: string; icon: string; color: string }[] = [
    { value: "graphics", label: "Graphics", icon: projectTypeGraphicsIcon, color: "#A855F7" },
    { value: "document", label: "Document", icon: projectTypeDocumentIcon, color: "#3B82F6" },
    { value: "code", label: "Code", icon: projectTypeCodeIcon, color: "#22C55E" },
    { value: "presentation", label: "Presentation", icon: projectTypePresentationIcon, color: "#F97316" },
    { value: "video", label: "Video", icon: projectTypeVideoIcon, color: "#EF4444" },
    { value: "image", label: "Image", icon: projectTypeImageIcon, color: "#EAB308" },
    { value: "default", label: "Default", icon: projectTypeDefaultIcon, color: "#9CA3AF" }
];

const getProjectType = (projectType?: ProjectType | null) =>
    PROJECT_TYPES.find(type => type.value === projectType) ?? PROJECT_TYPES[PROJECT_TYPES.length - 1];

const formatCardDate = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (isNaN(date.getTime())) return "";
    return new Intl.DateTimeFormat(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(date);
};

interface ProjectContent {

    name: string;

    type: "file" | "folder";

}

interface DirectoryItem {

    id: string;

    name: string;

    color: string;

}

interface ProjectTags {

    labelIds: string[];

    personIds: string[];

}

function getFileTypeIcon(
    fileName: string
) {

    const fileNameParts =
        fileName.split(".");

    const type =
        fileNameParts.length > 1 &&
            fileNameParts[fileNameParts.length - 1]
            ? fileNameParts[
                fileNameParts.length - 1
            ].toLowerCase()
            : "file";

    const iconMap: Record<string, string> = {
        pdf: pdfIcon,
        psd: photoshopIcon,
        ai: illustratorIcon,
        svg: svgIcon,
        doc: wordIcon,
        docx: wordIcon,
        ppt: powerpointIcon,
        pptx: powerpointIcon,
        xls: excelIcon,
        xlsx: excelIcon,
        html: htmlIcon,
        htm: htmlIcon,
        png: imagesIcon,
        jpg: imagesIcon,
        jpeg: imagesIcon,
        gif: imagesIcon,
        webp: imagesIcon,
        bmp: imagesIcon,
        tiff: imagesIcon,
        tif: imagesIcon,
        mp4: videoIcon,
        mov: videoIcon,
        avi: videoIcon,
        mkv: videoIcon,
        webm: videoIcon,
        txt: textIcon,
        md: textIcon,
        css: textIcon,
        json: textIcon,
        js: textIcon,
        ts: textIcon,
        tsx: textIcon,
        jsx: textIcon,
        yml: textIcon,
        yaml: textIcon,
        xml: textIcon,
        fig: xdIcon,
        figma: xdIcon,
        aep: premierProIcon,
        prproj: premierProIcon,
        afdesign: affinityIcon,
        afphoto: affinityIcon,
        id: indesignIcon,
        indd: indesignIcon
    };

    const iconSrc = iconMap[type] || textIcon;

    return {
        className: type,
        label: type.toUpperCase(),
        iconSrc
    };

}

function getFileIconMarkup(
    fileName: string
) {

    const icon =
        getFileTypeIcon(fileName);

    return `
        <div class="file-icon ${icon.className}">
            <img src="${icon.iconSrc}" alt="${icon.label}" />
        </div>
    `;

}

function getFolderIconMarkup() {

    return `
        <div class="file-icon folder-icon" aria-label="Folder">
            <span></span>
        </div>
    `;

}

function getUserIconMarkup(color = "#52B6C2", className = "person-icon") {
    const strokeColor = color || "#52B6C2";
    return `<svg class="${className}" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M18.9157 21.619C17.2779 19.7899 14.8984 18.6389 12.25 18.6389C9.60161 18.6389 7.22184 19.7899 5.58409 21.619M12.25 23.75C5.89873 23.75 0.75 18.6013 0.75 12.25C0.75 5.89873 5.89873 0.75 12.25 0.75C18.6013 0.75 23.75 5.89873 23.75 12.25C23.75 18.6013 18.6013 23.75 12.25 23.75ZM12.25 14.8056C10.1329 14.8056 8.41667 13.0893 8.41667 10.9722C8.41667 8.85513 10.1329 7.13889 12.25 7.13889C14.3671 7.13889 16.0833 8.85513 16.0833 10.9722C16.0833 13.0893 14.3671 14.8056 12.25 14.8056Z" stroke="${strokeColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

async function openProjectContent(
    projectName: string,
    relativePath: string
) {

    if (!window.electronAPI.openProjectContent) {
        window.alert(
            "Restart Atom once to enable opening files in their default apps."
        );
        return;
    }

    const loc = getProjectLocation(projectName);
    const projectPath = loc.path || selectedProject?.path;
    if (!projectPath) {
        window.alert("The selected project folder is unavailable. Select the project again and retry.");
        return;
    }

    try {
        await window.electronAPI.openProjectContent(projectPath, relativePath);
    } catch (err) {
        console.error("Failed to open project content:", err);

        const reason =
            err instanceof Error
                ? err.message
                : "Unknown error";

        window.alert(
            `Windows could not open this file in its default app.\n\n${reason}\n\nIf no default app is installed for this file type, choose one in Windows first.`
        );
    }

}

function showCreateFolderModal(project: RealProject) {
    const overlay = document.createElement("div");
    overlay.className = "atom-modal-overlay";
    overlay.innerHTML = `
        <div class="atom-modal rename-file-modal" role="dialog" aria-modal="true" aria-labelledby="create-folder-title">
            <div class="atom-modal-header">
                <div>
                    <h2 id="create-folder-title">Create folder</h2>
                    <p>Choose a name for the new folder.</p>
                </div>
                <button class="atom-modal-close" type="button" aria-label="Close create folder dialog">&times;</button>
            </div>
            <form class="atom-modal-body rename-file-form">
                <div class="form-group">
                    <label for="create-folder-input">Folder name</label>
                    <input id="create-folder-input" type="text" autocomplete="off" required />
                </div>
                <div class="form-error" id="create-folder-error" role="alert"></div>
                <div class="atom-modal-footer">
                    <button class="atom-button secondary" type="button" data-close-create-folder>Cancel</button>
                    <button class="atom-button primary" type="submit">Create folder</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector<HTMLInputElement>("#create-folder-input");
    const form = overlay.querySelector<HTMLFormElement>(".rename-file-form");
    const error = overlay.querySelector<HTMLElement>("#create-folder-error");
    if (!input || !form || !error) {
        overlay.remove();
        return;
    }

    const close = () => overlay.remove();
    input.focus();
    overlay.querySelectorAll<HTMLElement>(".atom-modal-close, [data-close-create-folder]")
        .forEach(button => button.addEventListener("click", close));
    overlay.addEventListener("click", event => {
        if (event.target === overlay) close();
    });

    form.addEventListener("submit", async event => {
        event.preventDefault();
        const folderName = input.value.trim();
        if (!folderName) {
            error.textContent = "Enter a folder name.";
            input.focus();
            return;
        }

        const submitButton = form.querySelector<HTMLButtonElement>("button[type=submit]");
        if (submitButton) submitButton.disabled = true;
        error.textContent = "";
        try {
            await window.electronAPI.createProjectFolder(project.path, currentFolderPath, folderName);
            close();
            await loadProjectContents(project, currentFolderPath);
        } catch (reason) {
            console.error("Could not create folder:", reason);
            const message = reason instanceof Error ? reason.message : "The folder could not be created.";
            error.textContent = message.includes("already exists")
                ? "A folder with that name already exists."
                : message;
            if (submitButton) submitButton.disabled = false;
            input.focus();
        }
    });
}

function showRenameItemModal(itemName: string, isFolder = false) {
    const loc = getProjectLocation(selectedProject);
    const projectName = loc.name;
    if (!projectName) return;

    const overlay = document.createElement("div");
    overlay.className = "atom-modal-overlay";
    overlay.innerHTML = `
        <div class="atom-modal rename-file-modal" role="dialog" aria-modal="true" aria-labelledby="rename-file-title">
            <div class="atom-modal-header">
                <div>
                    <h2 id="rename-file-title">Rename ${isFolder ? "folder" : "file"}</h2>
                    <p>Choose a new name for this ${isFolder ? "folder" : "file"}.</p>
                </div>
                <button class="atom-modal-close" type="button" aria-label="Close rename dialog">×</button>
            </div>
            <form class="atom-modal-body rename-file-form">
                <div class="form-group">
                    <label for="rename-file-input">${isFolder ? "Folder" : "File"} name</label>
                    <input id="rename-file-input" type="text" autocomplete="off" required />
                </div>
                <div class="form-error" id="rename-file-error" role="alert"></div>
                <div class="atom-modal-footer">
                    <button class="atom-button secondary" type="button" data-close-rename>Cancel</button>
                    <button class="atom-button primary" type="submit">Rename ${isFolder ? "folder" : "file"}</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector("#rename-file-input") as HTMLInputElement;
    const form = overlay.querySelector(".rename-file-form") as HTMLFormElement;
    const error = overlay.querySelector("#rename-file-error") as HTMLElement;
    const close = () => overlay.remove();

    input.value = itemName;
    input.focus();
    input.select();

    overlay.querySelectorAll<HTMLElement>(".atom-modal-close, [data-close-rename]")
        .forEach(button => button.addEventListener("click", close));

    overlay.addEventListener("click", event => {
        if (event.target === overlay) close();
    });

    form.addEventListener("submit", async event => {
        event.preventDefault();

        const nextName = input.value.trim();
        if (!nextName) {
            error.textContent = `Enter a ${isFolder ? "folder" : "file"} name to continue.`;
            input.focus();
            return;
        }

        if (nextName === itemName) {
            close();
            return;
        }

        const submitButton = form.querySelector("button[type=submit]") as HTMLButtonElement;
        submitButton.disabled = true;
        error.textContent = "";

        const relativeCurrent = currentFolderPath ? `${currentFolderPath}\\${itemName}` : itemName;
        const relativeNext = currentFolderPath ? `${currentFolderPath}\\${nextName}` : nextName;

        try {
            await window.electronAPI.renameFile(
                loc.path,
                relativeCurrent,
                relativeNext
            );
            close();
            await loadProjectContents(loc.name, currentFolderPath);
        } catch (err) {
            console.error(`Rename ${isFolder ? "folder" : "file"} failed:`, err);
            error.textContent = `Could not rename the ${isFolder ? "folder" : "file"}. Check that the name is available.`;
            submitButton.disabled = false;
        }
    });
}

function showRenameFileModal(fileName: string) {
    showRenameItemModal(fileName, false);
}

// ==========================
// LABELS AND PEOPLE VIEWS
// ==========================

function getDirectoryType() {
    return (activeView === "settings" ? selectedSettingsSection === "labels" : activeView === "labels")
        ? "label"
        : "person";

}

async function loadDirectoryItems() {

    const type =
        getDirectoryType();

    const items =
        await window.electronAPI.getDirectoryItems(type);

    renderDirectoryItems(items);

}

function renderDirectoryItems(
    items: DirectoryItem[]
) {

    if (!projectList) return;

    const isPeople = getDirectoryType() === "person";
    const itemName = isPeople ? "people" : "labels";

    if (items.length === 0) {
        projectList.innerHTML = `
            <div class="empty-state">No ${itemName} yet</div>
        `;
        if (activeView === "settings") renderSettingsDirectoryForm();
        return;
    }

    projectList.innerHTML = items.map(item => `
        <button class="directory-item" data-directory-id="${item.id}">
            ${isPeople
                ? getUserIconMarkup(item.color, "directory-user-icon")
                : `<span class="directory-color" style="background: ${item.color}"></span>`
            }
            <span>${item.name}</span>
        </button>
    `).join("");

    projectList.querySelectorAll<HTMLButtonElement>(".directory-item")
        .forEach(element => {
            element.addEventListener("click", () => {
                const item = items.find(
                    entry => entry.id === element.dataset.directoryId
                );

                if (item) {
                    projectList.querySelectorAll(".directory-item").forEach(row => row.classList.toggle("selected", row === element));
                    showDirectoryItemForm(item);
                }
            });
        });

}

function showDirectoryItemForm(
    item?: DirectoryItem
) {

    if (activeView === "settings" && (selectedSettingsSection === "people" || selectedSettingsSection === "labels")) {
        renderSettingsDirectoryForm(item, !item);
        return;
    }

    if (!fileList || !projectTitle || !projectDescription) return;

    if (activeView === "labels" || activeView === "people") {
        const standardWorkspace = document.getElementById("standard-workspace-view");
        const header = standardWorkspace?.querySelector<HTMLElement>(".project-header");
        const container = standardWorkspace?.querySelector<HTMLElement>(".workspace-container");
        if (header) header.style.display = "";
        if (container) container.style.display = "";
    }

    const type =
        getDirectoryType();

    const singularName =
        type === "label" ? "Label" : "Person";

    projectTitle.textContent =
        item ? item.name : `New ${singularName}`;

    projectDescription.textContent =
        item
            ? `Edit this ${singularName.toLowerCase()}.`
            : `Create a new ${singularName.toLowerCase()}.`;

    if (fileSectionTitle) {
        fileSectionTitle.textContent =
            `${singularName} details`;
    }

    if (notesPanelTitle) {
        notesPanelTitle.textContent =
            "About";
    }

    if (notesContent) {
        notesContent.innerHTML = `
            <div class="directory-help">
                Choose a memorable name and colour to keep your ${type === "label" ? "labels" : "people"} easy to identify.
            </div>
        `;
    }

    fileList.innerHTML = `
        <form class="directory-form" id="directory-form">
            <div class="form-group">
                <label for="directory-name">Name</label>
                <input id="directory-name" type="text" autocomplete="off" />
            </div>
            <div class="form-group">
                <label for="directory-color">Colour</label>
                <div class="color-field">
                    <input id="directory-color" type="color" />
                    <span id="directory-color-value"></span>
                </div>
            </div>
            <div id="directory-form-error" class="form-error"></div>
            <div class="directory-form-actions">
                ${item ? `<button type="button" id="delete-directory-item" class="atom-button danger">Delete ${singularName}</button>` : ""}
                <button type="submit" class="atom-button primary">${item ? "Save changes" : `Create ${singularName}`}</button>
            </div>
        </form>
    `;

    const nameInput = fileList.querySelector(
        "#directory-name"
    ) as HTMLInputElement;

    const colorInput = fileList.querySelector(
        "#directory-color"
    ) as HTMLInputElement;

    const colorValue = fileList.querySelector(
        "#directory-color-value"
    ) as HTMLElement;

    nameInput.value = item?.name || "";
    colorInput.value = item?.color || "#52B6C2";
    colorValue.textContent = colorInput.value.toUpperCase();

    colorInput.addEventListener("input", () => {
        colorValue.textContent = colorInput.value.toUpperCase();
    });

    fileList.querySelector("#directory-form")?.addEventListener(
        "submit",
        async event => {
            event.preventDefault();

            const error = fileList.querySelector(
                "#directory-form-error"
            ) as HTMLElement;

            try {
                const savedItem = item
                    ? await window.electronAPI.updateDirectoryItem(
                        type,
                        { id: item.id, name: nameInput.value, color: colorInput.value }
                    )
                    : await window.electronAPI.createDirectoryItem(
                        type,
                        { name: nameInput.value, color: colorInput.value }
                    );

                await loadDirectoryItems();
                showDirectoryItemForm(savedItem);
            } catch (err) {
                console.error("Failed to save directory item:", err);
                error.textContent = "Enter a name to continue.";
            }
        }
    );

    fileList.querySelector("#delete-directory-item")?.addEventListener(
        "click",
        async () => {
            if (!item || !window.confirm(`Delete ${item.name}?`)) return;

            await window.electronAPI.deleteDirectoryItem(type, item.id);
            await loadDirectoryItems();
            clearDirectoryWorkspace();
        }
    );

    nameInput.focus();

}

function renderSettingsDirectoryForm(item?: DirectoryItem, creating = false) {
    if (!directorySettingsWorkspace) return;
    const type = getDirectoryType();
    const singularName = type === "label" ? "Label" : "Person";
    document.querySelectorAll<HTMLButtonElement>("#standard-explorer-view .directory-item").forEach(row => row.classList.toggle("selected", Boolean(item && row.dataset.directoryId === item.id)));
    directorySettingsWorkspace.innerHTML = `
        <section class="directory-settings-page">
            <header class="directory-settings-header"><h2>${singularName} details</h2></header>
            ${item || creating ? `<form class="directory-settings-form" id="settings-directory-form">
                <div class="form-group"><label for="settings-directory-name">Name</label><input id="settings-directory-name" type="text" autocomplete="off" /></div>
                <div class="form-group"><label for="settings-directory-color">Colour</label><div class="color-field"><input id="settings-directory-color" type="color" /><span id="settings-directory-color-value"></span></div></div>
                <div id="settings-directory-error" class="form-error" aria-live="polite"></div>
                <div class="directory-form-actions">${item ? `<button type="button" id="settings-directory-delete" class="atom-button danger">Delete ${singularName}</button>` : ""}<button type="submit" class="atom-button primary">${item ? "Save changes" : `Create ${singularName}`}</button></div>
            </form>` : '<div class="directory-settings-empty">Select an item to view its settings.</div>'}
        </section>`;

    const nameInput = directorySettingsWorkspace.querySelector<HTMLInputElement>("#settings-directory-name")!;
    const colorInput = directorySettingsWorkspace.querySelector<HTMLInputElement>("#settings-directory-color")!;
    const colorValue = directorySettingsWorkspace.querySelector<HTMLElement>("#settings-directory-color-value")!;
    nameInput.value = item?.name ?? "";
    colorInput.value = item?.color ?? "#52B6C2";
    colorValue.textContent = colorInput.value.toUpperCase();
    colorInput.addEventListener("input", () => { colorValue.textContent = colorInput.value.toUpperCase(); });
    directorySettingsWorkspace.querySelector("#settings-directory-form")?.addEventListener("submit", async event => {
        event.preventDefault();
        const error = directorySettingsWorkspace.querySelector<HTMLElement>("#settings-directory-error")!;
        try {
            const savedItem = item
                ? await window.electronAPI.updateDirectoryItem(type, { id: item.id, name: nameInput.value, color: colorInput.value })
                : await window.electronAPI.createDirectoryItem(type, { name: nameInput.value, color: colorInput.value });
            await loadDirectoryItems();
            renderSettingsDirectoryForm(savedItem);
        } catch (err) {
            console.error("Failed to save directory item:", err);
            error.textContent = "Enter a name to continue.";
        }
    });
    directorySettingsWorkspace.querySelector("#settings-directory-delete")?.addEventListener("click", async () => {
        if (!item) return;
        if (!window.confirm(`Delete ${item.name}?`)) return;
        await window.electronAPI.deleteDirectoryItem(type, item.id);
        await loadDirectoryItems();
        renderSettingsDirectoryForm();
    });
}

function clearDirectoryWorkspace() {

    if (activeView === "settings" && directorySettingsWorkspace) {
        directorySettingsWorkspace.innerHTML = "";
        return;
    }

    if (projectTitle) projectTitle.textContent = "";
    if (projectDescription) projectDescription.textContent = "";
    if (fileSectionTitle) fileSectionTitle.textContent = "";
    if (notesPanelTitle) notesPanelTitle.textContent = "";
    if (fileList) fileList.innerHTML = "";
    if (notesContent) notesContent.innerHTML = "";

}

let notesEditorEventsInitialized = false;

function formatNoteHeaderDate(dateStr: string): string {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Jul 31, 2026";
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function getNoteGroups<T extends { created_at: string }>(items: T[]) {
    const months = new Map<string, { year: number; month: number; weeks: Map<number, T[]> }>();

    items.forEach(item => {
        const date = new Date(item.created_at);
        if (isNaN(date.getTime())) return;
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthKey = `${year}-${month}`;
        const monthGroup = months.get(monthKey) ?? { year, month, weeks: new Map<number, T[]>() };
        const week = Math.floor((date.getDate() - 1) / 7) + 1;
        const weekItems = monthGroup.weeks.get(week) ?? [];
        weekItems.push(item);
        monthGroup.weeks.set(week, weekItems);
        months.set(monthKey, monthGroup);
    });

    return [...months.values()]
        .sort((a, b) => b.year - a.year || b.month - a.month)
        .map(monthGroup => ({
            ...monthGroup,
            weeks: [...monthGroup.weeks.entries()]
                .sort(([weekA], [weekB]) => weekB - weekA)
                .map(([week, weekItems]) => ({
                    week,
                    startDay: (week - 1) * 7 + 1,
                    items: weekItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                }))
        }));
}

function renderNoteGroupHeader(week: number, startDay: number, month: number): string {
    const ordinalSuffix = startDay % 100 >= 11 && startDay % 100 <= 13
        ? "th"
        : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[startDay % 10] ?? "th";
    const monthName = MONTH_NAMES[month];
    return `
        <div class="note-group-header">
            <span>Week ${week} | ${startDay}${ordinalSuffix} ${monthName}</span>
        </div>
    `;
}

function applyNotesSearch(query = notesSearchInput?.value ?? "") {
    if (!notesList) return;
    const normalizedQuery = query.trim().toLocaleLowerCase();
    let visibleCount = 0;
    notesList.querySelectorAll<HTMLElement>(".note-card").forEach(card => {
        const matches = !normalizedQuery || (card.dataset.searchText ?? card.textContent ?? "").toLocaleLowerCase().includes(normalizedQuery);
        card.hidden = !matches;
        card.style.display = matches ? "" : "none";
        if (matches) visibleCount++;
    });
    notesList.querySelectorAll<HTMLElement>(".note-week-items").forEach(group => {
        const hasVisibleNotes = Boolean(group.querySelector(".note-card:not([hidden])"));
        group.hidden = !hasVisibleNotes;
        group.style.display = hasVisibleNotes ? "" : "none";
    });
    notesList.querySelectorAll<HTMLElement>(".note-month-group").forEach(group => {
        const hasVisibleNotes = Boolean(group.querySelector(".note-card:not([hidden])"));
        group.hidden = !hasVisibleNotes;
        group.style.display = hasVisibleNotes ? "" : "none";
    });
    const emptyState = notesList.querySelector<HTMLElement>(".notes-search-empty");
    if (emptyState) {
        emptyState.hidden = !normalizedQuery || visibleCount > 0;
        emptyState.style.display = emptyState.hidden ? "none" : "";
    }
}

function refreshActiveNoteSearchText() {
    if (!activeNoteId || !notesList) return;
    const note = notesTabItems.find(item => item.id === activeNoteId);
    const card = notesList.querySelector<HTMLElement>(`.note-card[data-note-id="${activeNoteId}"]`);
    if (!note || !card) return;
    note.title = noteTitleInput?.value ?? note.title;
    note.content = noteEditorContent?.innerHTML ?? note.content;
    card.dataset.searchText = `${note.title} ${extractPlainText(note.content)} ${note.project_name ?? ""}`;
    applyNotesSearch();
}

async function resetNotesTabState() {
    if (noteAutosaveTimeout) {
        window.clearTimeout(noteAutosaveTimeout);
        noteAutosaveTimeout = null;
    }
    await saveActiveNote();
}

function readImageAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("load", () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("Could not read image.")), { once: true });
        reader.addEventListener("error", () => reject(reader.error ?? new Error("Could not read image.")), { once: true });
        reader.readAsDataURL(file);
    });
}

async function pasteImagesIntoNote(event: ClipboardEvent, editor: HTMLElement, onChange: () => void) {
    const imageFiles = Array.from(event.clipboardData?.items ?? [])
        .filter(item => item.kind === "file" && item.type.startsWith("image/"))
        .map(item => item.getAsFile())
        .filter((file): file is File => Boolean(file));
    if (!imageFiles.length) return;

    event.preventDefault();
    editor.focus();
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    if (!range || !editor.contains(range.commonAncestorContainer)) {
        const endRange = document.createRange();
        endRange.selectNodeContents(editor);
        endRange.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(endRange);
    }

    for (const file of imageFiles) {
        try {
            const image = document.createElement("img");
            image.src = await readImageAsDataUrl(file);
            image.alt = file.name || "Pasted image";
            image.className = "note-inline-image";
            image.draggable = false;
            const currentSelection = window.getSelection();
            const insertRange = currentSelection?.rangeCount ? currentSelection.getRangeAt(0) : null;
            if (insertRange && editor.contains(insertRange.commonAncestorContainer)) {
                insertRange.deleteContents();
                insertRange.insertNode(image);
                insertRange.setStartAfter(image);
                insertRange.collapse(true);
                currentSelection?.removeAllRanges();
                currentSelection?.addRange(insertRange);
            } else {
                editor.append(image);
            }
            onChange();
        } catch (error) {
            console.error("Could not paste note image:", error);
        }
    }
}

function previewNoteImage(src: string, alt = "Note image") {
    const overlay = document.createElement("div");
    overlay.className = "note-image-preview-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Image preview");
    overlay.innerHTML = `<button class="note-image-preview-close" type="button" aria-label="Close image preview">×</button><img class="note-image-preview" src="${escapeHtmlAttribute(src)}" alt="${escapeHtmlAttribute(alt)}">`;
    const close = () => { overlay.remove(); document.removeEventListener("keydown", onKeyDown); };
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") close(); };
    overlay.addEventListener("click", event => {
        if (event.target === overlay || (event.target as HTMLElement).closest(".note-image-preview-close")) close();
    });
    document.addEventListener("keydown", onKeyDown);
    document.body.append(overlay);
}

function attachNoteImageInteractions(editor: HTMLElement, onChange: () => void) {
    editor.addEventListener("paste", event => { void pasteImagesIntoNote(event, editor, onChange); });
    editor.addEventListener("click", event => {
        const image = (event.target as HTMLElement).closest<HTMLImageElement>("img");
        if (image && editor.contains(image)) {
            event.preventDefault();
            previewNoteImage(image.src, image.alt);
        }
    });
}

function insertChecklistItem() {
    if (!noteEditorContent) return;
    noteEditorContent.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const item = document.createElement("div");
    item.className = "checklist-item";
    item.innerHTML = `
        <span class="checklist-box unchecked" contenteditable="false"></span>
        <span class="checklist-text">New task</span>
    `;

    range.deleteContents();
    range.insertNode(item);

    const textSpan = item.querySelector(".checklist-text");
    if (textSpan) {
        const newRange = document.createRange();
        newRange.selectNodeContents(textSpan);
        selection.removeAllRanges();
        selection.addRange(newRange);
    }

    scheduleNoteAutosave();
}

function toggleChecklistLines(editor: HTMLElement) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const directBlocks = Array.from(editor.children).filter(child => {
        try {
            return range.intersectsNode(child);
        } catch {
            return false;
        }
    }) as HTMLElement[];
    const blocks = directBlocks.length > 0 ? directBlocks : [editor];
    const checklistBlocks = blocks.filter(block => block.classList.contains("checklist-item"));
    const removeChecklist = checklistBlocks.length === blocks.length;

    blocks.forEach(block => {
        if (removeChecklist) {
            const text = block.querySelector(".checklist-text")?.textContent?.trim() || "";
            const paragraph = document.createElement("p");
            paragraph.innerHTML = text || "<br>";
            block.replaceWith(paragraph);
            return;
        }

        if (block.classList.contains("checklist-item")) return;
        const item = document.createElement("div");
        item.className = "checklist-item";
        const text = block.textContent?.trim() || "";
        item.innerHTML = '<span class="checklist-box unchecked" contenteditable="false"></span><span class="checklist-text"></span>';
        item.querySelector(".checklist-text")!.textContent = text;
        block.replaceWith(item);
    });

    scheduleNoteAutosave();
}

function setupNotesEditorEvents() {
    if (notesEditorEventsInitialized) return;

    const notesWorkspace = document.getElementById("notes-workspace-view");
    const notesExplorer = document.getElementById("notes-explorer-view");
    if (!notesWorkspace || !notesExplorer) return;

    notesAddButton = notesExplorer.querySelector<HTMLButtonElement>("#notes-add-button");
    notesYearSelect = notesExplorer.querySelector<HTMLSelectElement>("#notes-year-select");
    notesMonthSelect = notesExplorer.querySelector<HTMLSelectElement>("#notes-month-select");
    notesList = notesExplorer.querySelector<HTMLElement>("#notes-list");
    notesSearchInput?.addEventListener("input", () => applyNotesSearch());
    noteTitleInput = notesWorkspace.querySelector<HTMLInputElement>("#note-title-input");
    noteDisplayDate = notesWorkspace.querySelector<HTMLElement>("#note-display-date");
    noteEditorContent = notesWorkspace.querySelector<HTMLElement>("#note-editor-content");

    const toolbar = notesWorkspace.querySelector<HTMLElement>("#note-editor-toolbar");
    const assignProjectBtn = notesWorkspace.querySelector<HTMLButtonElement>("#notes-assign-project-btn");
    const gotoProjectBtn = notesWorkspace.querySelector<HTMLButtonElement>("#notes-goto-project-btn");

    if (toolbar) {
        toolbar.querySelectorAll<HTMLButtonElement>(".toolbar-btn").forEach(button => {
            button.addEventListener("click", () => {
                const action = button.dataset.action;
                const value = button.dataset.value || "";
                if (!action || !noteEditorContent) return;

                noteEditorContent.focus();

                if (action === "undo" || action === "redo") {
                    document.execCommand(action, false);
                } else if (action === "formatBlock") {
                    document.execCommand("formatBlock", false, `<${value}>`);
                } else if (action === "bold" || action === "italic" || action === "underline" || action === "strikethrough") {
                    document.execCommand(action, false);
                } else if (action === "link") {
                    const url = window.prompt("Enter link URL:", "https://");
                    if (url) {
                        document.execCommand("createLink", false, url);
                    }
                } else if (action === "image") {
                    const url = window.prompt("Enter image URL or path:");
                    if (url) {
                        document.execCommand("insertImage", false, url);
                    }
                } else if (action === "checklist") {
                    toggleChecklistLines(noteEditorContent);
                }

                noteEditorContent.focus();
                scheduleNoteAutosave();
            });
        });
    }

    if (noteEditorContent) {
        noteEditorContent.contentEditable = "true";
        attachNoteImageInteractions(noteEditorContent, () => {
            refreshActiveNoteSearchText();
            scheduleNoteAutosave();
        });
        noteEditorContent.addEventListener("click", (event) => {
            const target = event.target as HTMLElement;
            const box = target.closest(".checklist-box") as HTMLElement | null;
            if (!box) return;

            if (box.classList.contains("checked")) {
                box.classList.remove("checked");
                box.classList.add("unchecked");
                box.innerHTML = "";
            } else {
                box.classList.remove("unchecked");
                box.classList.add("checked");
                box.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            }
            scheduleNoteAutosave();
        });

        noteEditorContent.addEventListener("keydown", (event) => {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;

            const target = event.target as HTMLElement;
            const currentItem = (selection.anchorNode instanceof HTMLElement ? selection.anchorNode : selection.anchorNode?.parentElement)?.closest(".checklist-item") as HTMLElement | null;

            if (event.key === "Enter" && !event.shiftKey && currentItem) {
                event.preventDefault();
                const newItem = document.createElement("div");
                newItem.className = "checklist-item";
                newItem.innerHTML = `
                    <span class="checklist-box unchecked" contenteditable="false"></span>
                    <span class="checklist-text">&nbsp;</span>
                `;
                currentItem.after(newItem);

                const newText = newItem.querySelector(".checklist-text");
                if (newText) {
                    const range = document.createRange();
                    range.selectNodeContents(newText);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
                scheduleNoteAutosave();
            } else if (event.key === "Backspace" && currentItem) {
                const textElement = currentItem.querySelector<HTMLElement>(".checklist-text");
                const text = textElement?.textContent?.trim() || "";
                const atStart = selection.isCollapsed && selection.anchorOffset === 0;
                if (!text || atStart) {
                    event.preventDefault();
                    const paragraph = document.createElement("p");
                    paragraph.textContent = text;
                    if (!text) paragraph.innerHTML = "<br>";
                    currentItem.replaceWith(paragraph);
                    const range = document.createRange();
                    range.selectNodeContents(paragraph);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    scheduleNoteAutosave();
                }
            }
        });

        noteEditorContent.addEventListener("input", () => {
            refreshActiveNoteSearchText();
            scheduleNoteAutosave();
        });
        noteEditorContent.addEventListener("blur", () => {
            if (noteAutosaveTimeout) {
                window.clearTimeout(noteAutosaveTimeout);
                noteAutosaveTimeout = null;
            }
            void saveActiveNote();
        });
    }

    if (noteTitleInput) {
        noteTitleInput.addEventListener("blur", () => {
            if (noteAutosaveTimeout) {
                window.clearTimeout(noteAutosaveTimeout);
                noteAutosaveTimeout = null;
            }
            void saveActiveNote();
        });
        noteTitleInput.addEventListener("input", () => {
            if (activeNoteId && notesList) {
                const card = notesList.querySelector<HTMLElement>(`.note-card[data-note-id="${activeNoteId}"]`);
                if (card) {
                    const titleEl = card.querySelector<HTMLElement>(".note-card-title");
                    if (titleEl) {
                        titleEl.textContent = noteTitleInput?.value.trim() || "Untitled note";
                    }
                }
            }
            refreshActiveNoteSearchText();
            scheduleNoteAutosave();
        });
    }

    assignProjectBtn?.addEventListener("click", async (event) => {
        event.stopPropagation();
        const activeNote = notesTabItems.find(item => item.id === activeNoteId);
        if (!activeNote) {
            window.alert("Select a note before assigning a project.");
            return;
        }

        document.querySelectorAll(".project-assign-dropdown").forEach(el => el.remove());

        const dropdown = document.createElement("div");
        dropdown.className = "project-assign-dropdown";

        try {
            const projectYears = await window.electronAPI.getProjectYears();
            const projectList: Array<{ id: string; name: string; year: string; month: string; created_at: string }> = [];

            for (const y of projectYears) {
                const months = await window.electronAPI.getProjectMonths(y);
                for (const m of months) {
                    const projs = await window.electronAPI.getProjects(y, m);
                    projs.forEach(p => projectList.push({ id: p.id || p.path, name: p.name, year: y, month: m, created_at: p.created_at }));
                }
            }

            projectList.sort((a, b) => {
                const dateA = new Date(a.created_at).getTime();
                const dateB = new Date(b.created_at).getTime();
                return dateB - dateA || a.name.localeCompare(b.name);
            });

            if (projectList.length === 0) {
                dropdown.innerHTML = '<div class="project-assign-option" style="color: #6b7280;">No projects found</div>';
            } else {
                dropdown.innerHTML = projectList.map(proj => {
                    const isSelected = activeNote.project_id === proj.id || activeNote.project_name === proj.name;
                    return `
                        <div class="project-assign-option ${isSelected ? "selected" : ""}" data-proj-id="${proj.id}" data-proj-name="${proj.name}">
                            <span>📁</span>
                            <span>${escapeDashboardHtml(proj.name)}</span>
                        </div>
                    `;
                }).join("");

                dropdown.querySelectorAll<HTMLElement>(".project-assign-option").forEach(opt => {
                    opt.addEventListener("click", async () => {
                        const projId = opt.dataset.projId || "";
                        const projName = opt.dataset.projName || "";
                        if (!projId || !projName) return;

                        activeNote.project_id = projId;
                        activeNote.project_name = projName;
                        await window.electronAPI.updateNote(activeNote.id, activeNote.content, activeNote.title, projId);
                        if (gotoProjectBtn) {
                            gotoProjectBtn.disabled = false;
                            gotoProjectBtn.title = "Open assigned project";
                        }
                        dropdown.remove();
                    });
                });
            }

            const rect = assignProjectBtn.getBoundingClientRect();
            dropdown.style.top = `${rect.bottom + 6}px`;
            dropdown.style.left = `${Math.max(10, rect.left)}px`;
            document.body.appendChild(dropdown);

            const closeDropdown = (e: MouseEvent) => {
                if (!dropdown.contains(e.target as Node) && e.target !== assignProjectBtn) {
                    dropdown.remove();
                    document.removeEventListener("click", closeDropdown);
                }
            };
            setTimeout(() => document.addEventListener("click", closeDropdown), 0);
        } catch (err) {
            console.error("Could not list projects for assignment:", err);
        }
    });

    gotoProjectBtn?.addEventListener("click", async () => {
        const activeNote = notesTabItems.find(item => item.id === activeNoteId);
        if (!activeNote || !activeNote.project_name || activeNote.project_name === "General") {
            return;
        }

        try {
            const years = await window.electronAPI.getProjectYears();
            for (const y of years) {
                const months = await window.electronAPI.getProjectMonths(y);
                for (const m of months) {
                    const projs = await window.electronAPI.getProjects(y, m);
                    const match = projs.find(p => p.name === activeNote.project_name || p.id === activeNote.project_id);
                    if (match) {
                        await switchView("projects");
                        if (yearSelect) yearSelect.value = y;
                        if (monthSelect) monthSelect.value = m;
                        await loadProjects(y, m);
                        updateProjectWorkspace(match);
                        return;
                    }
                }
            }
        } catch (err) {
            console.error("Could not navigate to assigned project:", err);
        }
    });

    notesAddButton?.addEventListener("click", async () => {
        if (!notesYearSelect || !notesMonthSelect) return;
        const year = notesYearSelect.value || String(new Date().getFullYear());
        const month = notesMonthSelect.value || String(new Date().getMonth() + 1);
        const projectList = await window.electronAPI.getProjects(year, month);
        const project = selectedProject || projectList[0];

        try {
                        const note = await window.electronAPI.createNote(year, month, project ? project.name : "", "", "");
            activeNoteId = note.id;
            await renderNotesForSelection(year, month);
        } catch (error) {
            console.error("Could not create note:", error);
            window.alert("Could not create the note. Check the database and try again.");
        }
    });

    notesYearSelect?.addEventListener("change", async () => {
        const yearSelectElement = notesYearSelect;
        const monthSelectElement = notesMonthSelect;
        if (!yearSelectElement || !monthSelectElement) return;
        const year = yearSelectElement.value;
        const months = await window.electronAPI.getProjectMonths(year);
        monthSelectElement.innerHTML = "";
        if (!months.length) {
            monthSelectElement.innerHTML = '<option value="">No months</option>';
            if (notesList) notesList.innerHTML = '<div class="empty-state">No notes available</div>';
            const editorContainer = document.querySelector<HTMLElement>("#notes-workspace-view .notes-editor-container");
            if (editorContainer) editorContainer.style.display = "none";
            if (noteTitleInput) noteTitleInput.value = "";
            if (noteDisplayDate) noteDisplayDate.textContent = "";
            if (noteEditorContent) noteEditorContent.innerHTML = "";
            activeNoteId = null;
            return;
        }
        months.forEach(month => {
            const option = document.createElement("option");
            option.value = month;
            option.textContent = month;
            monthSelectElement.appendChild(option);
        });
        const selectedMonth = getDefaultMonth(months, year);
        monthSelectElement.value = selectedMonth;
        await renderNotesForSelection(year, selectedMonth);
    });

    notesMonthSelect?.addEventListener("change", async () => {
        const yearSelectElement = notesYearSelect;
        const monthSelectElement = notesMonthSelect;
        if (!yearSelectElement || !monthSelectElement) return;
        await renderNotesForSelection(yearSelectElement.value, monthSelectElement.value);
    });

    notesEditorEventsInitialized = true;
}

async function saveActiveNote() {
    if (!activeNoteId || !noteTitleInput || !noteEditorContent) return;

    try {
        const note = notesTabItems.find(item => item.id === activeNoteId);
        if (!note) return;

        const content = noteEditorContent.innerHTML;
        const title = noteTitleInput.value.trim();
        const updated = await window.electronAPI.updateNote(note.id, content, title || "");
        note.title = updated.title ?? "";
        note.content = updated.content;
        note.updated_at = updated.updated_at;

        const noteIndex = notesTabItems.findIndex(item => item.id === note.id);
        if (noteIndex >= 0) {
            notesTabItems[noteIndex] = note;
        }

        if (notesList) {
            const card = notesList.querySelector<HTMLElement>(`.note-card[data-note-id="${note.id}"]`);
            if (card) {
                const titleEl = card.querySelector<HTMLElement>(".note-card-title");
                if (titleEl) {
                    const previewText = extractPlainText(note.content).trim() || "Untitled note";
                    titleEl.textContent = note.title?.trim() || previewText;
                }
            }
        }
    } catch (error) {
        console.error("Could not save note:", error);
    }
}

function scheduleNoteAutosave() {
    if (!activeNoteId || !noteTitleInput || !noteEditorContent) return;

    if (noteAutosaveTimeout) {
        window.clearTimeout(noteAutosaveTimeout);
    }

    noteAutosaveTimeout = window.setTimeout(() => {
        void saveActiveNote();
    }, 400);
}

async function openNotesTab() {
    setupNotesEditorEvents();
    await initializeNotesView();
}

async function switchView(
    view: "projects" | "labels" | "people" | "templates" | "settings" | "dashboard" | "attendance" | "pinned" | "recurring" | "notes"
) {

    if (view === "settings" && activeView !== "settings") settingsDraft = null;

    const projectViews = ["projects", "pinned", "recurring"];
    if (projectViews.includes(view) && view !== activeView) {
        clearWorkspace();
    }

    activeView = view;
    document.getElementById("standard-explorer-view")?.classList.toggle("project-heading-view", view === "pinned" || view === "recurring");

    const projectTabs = document.querySelector<HTMLElement>(".project-tabs");
    if (projectTabs) {
        projectTabs.style.display = ["projects", "pinned", "recurring"].includes(view) ? "flex" : "none";
    }

    if (view === "projects" || view === "pinned" || view === "recurring") {
        activeProjectFolderTab = null;
        document.querySelectorAll<HTMLButtonElement>(".project-tab[data-project-tab]").forEach(tab => tab.classList.toggle("active", tab.dataset.projectTab === view));
        const projectsDateIcon = document.querySelector<HTMLElement>(".projects-date-icon");
        if (projectsDateIcon) projectsDateIcon.style.display = "";
        if (view !== "recurring") {
            if (yearSelect) yearSelect.style.display = "block";
            if (monthSelect) monthSelect.style.display = "block";
        }
    }

    navigationItems.forEach(item => {
        item.classList.toggle("active", item.dataset.view === view);
    });

    const standardExplorerView = document.getElementById("standard-explorer-view");
    const notesExplorerView = document.getElementById("notes-explorer-view");
    const settingsExplorerView = document.getElementById("settings-explorer-view");
    const templatesExplorerView = document.getElementById("templates-explorer-view");
    const standardWorkspaceView = document.getElementById("standard-workspace-view");
    const notesWorkspaceView = document.getElementById("notes-workspace-view");
    const settingsWorkspaceView = document.getElementById("settings-workspace-view");
    const templatesWorkspaceView = document.getElementById("templates-workspace-view");
    const projectExplorer = document.querySelector<HTMLElement>(".project-explorer");
    const workspacePane = document.querySelector<HTMLElement>(".workspace");
    const settingsLabels = view === "settings" && (selectedSettingsSection === "labels" || selectedSettingsSection === "people");
    const settingsTemplates = view === "settings" && selectedSettingsSection === "people-templates";

    const visibleRootMap = new Map<HTMLElement, boolean>([
        [dashboardView, view === "dashboard"],
        [attendanceRecordView, view === "attendance"],
        [standardExplorerView as HTMLElement, view !== "dashboard" && view !== "attendance" && view !== "notes" && view !== "settings" && view !== "templates" || settingsLabels],
        [notesExplorerView as HTMLElement, view === "notes"],
        [settingsExplorerView as HTMLElement, view === "settings"],
        [templatesExplorerView as HTMLElement, view === "templates" || settingsTemplates],
        [standardWorkspaceView as HTMLElement, view !== "dashboard" && view !== "attendance" && view !== "notes" && view !== "settings" && view !== "templates"],
        [directorySettingsWorkspace as HTMLElement, settingsLabels],
        [notesWorkspaceView as HTMLElement, view === "notes"],
        [settingsWorkspaceView as HTMLElement, view === "settings" && !settingsLabels && !settingsTemplates],
        [templatesWorkspaceView as HTMLElement, view === "templates" || settingsTemplates]
    ]);

    allAppViews.forEach(appView => {
        const shouldBeVisible = visibleRootMap.get(appView) ?? false;
        appView.style.display = shouldBeVisible ? "flex" : "none";
        appView.classList.toggle("active", shouldBeVisible);
        appView.hidden = !shouldBeVisible;
    });

    if (projectExplorer) {
        projectExplorer.style.display = view === "dashboard" || view === "attendance" ? "none" : "flex";
        projectExplorer.classList.toggle("settings-adjacent", settingsLabels || settingsTemplates);
    }
    if (workspacePane) {
        workspacePane.style.display = view === "dashboard" || view === "attendance" ? "none" : "flex";
    }

    if (view !== "dashboard" && view !== "notes" && view !== "attendance" && attendanceInterval) {
        clearInterval(attendanceInterval);
        attendanceInterval = null;
    }

    if (view === "notes") {
        await openNotesTab();
        return;
    }

    if (view === "attendance") {
        await renderAttendanceRecord();
        return;
    }

    if (view === "settings" || view === "templates") {
        if (dateSelector) dateSelector.style.display = "flex";
        if (yearSelect) yearSelect.style.display = "none";
        if (monthSelect) monthSelect.style.display = "none";
        if (fileViewControls) fileViewControls.style.display = "none";
        if (createProjectButton) createProjectButton.style.display = "none";
        if (view === "settings") { await renderSettingsPage(); await updateSettingsAdjacentPanels(); }
        else await loadProjectTemplates();
        return;
    }

    if (activeTabContent) {
        activeTabContent.innerHTML = "";
    }
    await resetNotesTabState();

    const notesPanel = document.querySelector<HTMLElement>(".notes-panel");
    if (notesPanel) {
        notesPanel.style.display = "flex";
    }

    if (view === "dashboard") {
        await renderDashboard();
        return;
    }

    if (view === "pinned") {
        if (panelTitle) panelTitle.textContent = "Pinned Projects";
        if (dateSelector) dateSelector.style.display = "none";
        if (createProjectButton) createProjectButton.style.display = "none";
        if (fileSectionTitle) fileSectionTitle.textContent = "Files";
        if (fileViewControls) fileViewControls.style.display = "flex";
        if (notesPanelTitle) notesPanelTitle.textContent = "Notes";
        await loadPinnedProjects();
        return;
    }

    if (view === "recurring") {
        if (panelTitle) panelTitle.textContent = "Recurring Projects";
        if (dateSelector) dateSelector.style.display = "flex";
        if (yearSelect) yearSelect.style.display = "none";
        if (monthSelect) monthSelect.style.display = "none";
        const recurringDateIcon = document.querySelector<HTMLElement>(".projects-date-icon");
        if (recurringDateIcon) recurringDateIcon.style.display = "none";
        if (createProjectButton) {
            createProjectButton.textContent = "+ Add";
            createProjectButton.style.display = "block";
        }
        activeProjectFolderTab = { name: "Recurring Projects", path: (await window.electronAPI.getSettings()).recurringProjectsRoot };
        if (fileSectionTitle) fileSectionTitle.textContent = "Files";
        if (fileViewControls) fileViewControls.style.display = "flex";
        if (notesPanelTitle) notesPanelTitle.textContent = "Notes";
        await loadRecurringProjects();
        return;
    }

    if (view === "projects") {
        if (panelTitle) panelTitle.textContent = "Projects";
        if (dateSelector) dateSelector.style.display = "flex";
        const projectsDateIcon = document.querySelector<HTMLElement>(".projects-date-icon");
        if (projectsDateIcon) projectsDateIcon.style.display = "";
        if (yearSelect) yearSelect.style.display = "block";
        if (monthSelect) monthSelect.style.display = "block";
        if (createProjectButton) {
            createProjectButton.textContent = "+ Add";
            createProjectButton.style.display = "block";
        }
        if (fileSectionTitle) fileSectionTitle.textContent = "Files";
        if (fileViewControls) fileViewControls.style.display = "flex";
        if (notesPanelTitle) notesPanelTitle.textContent = "Notes";
        await loadYears();
        return;
    }

    const title = view === "labels" ? "Labels" : "People";
    const singular = view === "labels" ? "Label" : "Person";

    if (panelTitle) panelTitle.textContent = title;
    if (dateSelector) dateSelector.style.display = "flex";
    if (yearSelect) yearSelect.style.display = "none";
    if (monthSelect) monthSelect.style.display = "none";
    if (createProjectButton) {
        createProjectButton.textContent = `+ Create ${singular}`;
        createProjectButton.style.display = "block";
    }
    if (fileViewControls) fileViewControls.style.display = "none";
    clearWorkspace();
    clearDirectoryWorkspace();
    await loadDirectoryItems();

}

async function renderNotesForSelection(year: string, month: string) {
    if (!notesList || !notesYearSelect || !notesMonthSelect) return;

    try {
        const allNotes = await window.electronAPI.getAllNotes();
        const filteredNotes = allNotes
            .filter(note => {
                const noteDate = new Date(note.created_at);
                const selectedMonthIndex = MONTH_NAMES.findIndex(name => name.toLowerCase() === month.toLowerCase());
                const selectedMonth = selectedMonthIndex >= 0 ? selectedMonthIndex : Number(month) - 1;
                return noteDate.getFullYear() === Number(year) && noteDate.getMonth() === selectedMonth;
            })
            .map(note => ({ ...note, title: note.title ?? "" }));

        notesTabItems = filteredNotes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        const gotoProjectButton = document.querySelector<HTMLButtonElement>("#notes-goto-project-btn");
        if (gotoProjectButton) {
            const hasProject = Boolean(notesTabItems.find(note => note.id === activeNoteId)?.project_id);
            gotoProjectButton.disabled = !hasProject;
            gotoProjectButton.title = hasProject ? "Open assigned project" : "Assign this note to a project first";
        }

        if (!notesTabItems.length) {
            const searching = Boolean(notesSearchInput?.value.trim());
            notesList.innerHTML = `<div class="empty-state">${searching ? "No notes match your search" : "No notes available"}</div>`;
            const editorContainer = document.querySelector<HTMLElement>("#notes-workspace-view .notes-editor-container");
            if (editorContainer) editorContainer.style.display = "none";
            if (noteEditorContent) noteEditorContent.innerHTML = "";
            if (noteTitleInput) noteTitleInput.value = "";
            if (noteDisplayDate) noteDisplayDate.textContent = "";
            activeNoteId = null;
            return;
        }

        const editorContainer = document.querySelector<HTMLElement>("#notes-workspace-view .notes-editor-container");
        if (editorContainer) editorContainer.style.display = "";
        const selectedNote = notesTabItems.find(note => note.id === activeNoteId) ?? notesTabItems[0];
        activeNoteId = selectedNote.id;

        notesList.innerHTML = getNoteGroups(notesTabItems).map(monthGroup => `
            <section class="note-month-group" data-note-month="${monthGroup.year}-${monthGroup.month}">
                ${monthGroup.weeks.map(weekGroup => `
                    ${renderNoteGroupHeader(weekGroup.week, weekGroup.startDay, monthGroup.month)}
                    <div class="note-week-items">
                        ${weekGroup.items.map(note => {
                            const previewText = extractPlainText(note.content).trim() || "Untitled note";
                            const isSelected = note.id === selectedNote.id;
                            const titleText = note.title?.trim() || previewText;
                            const cardDate = new Date(note.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
                            return `
                                <div class="note-card ${isSelected ? "selected" : ""}" data-note-id="${note.id}" data-search-text="${escapeHtmlAttribute(`${note.title ?? ""} ${extractPlainText(note.content)} ${note.project_name ?? ""}`)}" role="button" tabindex="0">
                                    <div class="note-card-icon" aria-hidden="true">
                                        <svg viewBox="0 0 20 22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M5 1.9h6.5L17 7.4v11.1a1.6 1.6 0 0 1-1.6 1.6H5a1.6 1.6 0 0 1-1.6-1.6V3.5A1.6 1.6 0 0 1 5 1.9Z" />
                                            <path d="M11.2 2v5.7h5.5M6.5 12h7M6.5 15.5h7" />
                                        </svg>
                                    </div>
                                    <div class="note-card-content">
                                        <div class="note-card-date">${cardDate}</div>
                                        <div class="note-card-title">${escapeDashboardHtml(titleText)}</div>
                                        ${note.project_id ? `<div class="note-card-project">${escapeDashboardHtml(note.project_name)}</div>` : ""}
                                    </div>
                                    <div class="note-card-menu">
                                        <button class="note-more-button" type="button" aria-label="Open note actions" data-note-id="${note.id}">⋮</button>
                                        <div class="note-action-menu" role="menu">
                                            <button class="note-menu-item" type="button" data-note-action="duplicate" data-note-id="${note.id}">Duplicate</button>
                                            <button class="note-menu-item" type="button" data-note-action="rename" data-note-id="${note.id}">Rename</button>
                                            <button class="note-menu-item danger" type="button" data-note-action="delete" data-note-id="${note.id}">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join("")}
                    </div>
                `).join("")}
            </section>
        `).join("") + '<div class="empty-state notes-search-empty" hidden>No notes match your search</div>';
        applyNotesSearch();

        if (noteDisplayDate) noteDisplayDate.textContent = formatNoteHeaderDate(selectedNote.created_at);
        if (noteTitleInput) {
            noteTitleInput.value = selectedNote.title || "";
        }
        if (noteEditorContent) {
            noteEditorContent.innerHTML = selectedNote.content || "";
            noteEditorContent.contentEditable = "true";
            noteEditorContent.classList.add("is-active");
        }

        const yearSelectElement = notesYearSelect;
        const monthSelectElement = notesMonthSelect;
        if (!yearSelectElement || !monthSelectElement) return;

        notesList.querySelectorAll<HTMLElement>(".note-card").forEach(card => {
            const noteId = card.dataset.noteId;
            card.addEventListener("click", event => {
                if ((event.target as HTMLElement).closest(".note-more-button") || (event.target as HTMLElement).closest(".note-menu-item")) {
                    return;
                }
                const note = notesTabItems.find(item => item.id === noteId);
                if (!note) return;
                activeNoteId = note.id;
                renderNotesForSelection(yearSelectElement.value, monthSelectElement.value);
            });
        });

        notesList.querySelectorAll<HTMLButtonElement>(".note-more-button").forEach(button => {
            button.addEventListener("click", event => {
                event.stopPropagation();
                const actionMenu = button.parentElement?.querySelector<HTMLElement>(".note-action-menu");
                const isOpen = actionMenu?.classList.contains("visible");
                notesList?.querySelectorAll<HTMLElement>(".note-action-menu").forEach(menu => menu.classList.remove("visible"));
                if (actionMenu && !isOpen) {
                    actionMenu.classList.add("visible");
                }
            });
        });

        notesList.querySelectorAll<HTMLButtonElement>(".note-menu-item").forEach(button => {
            button.addEventListener("click", async event => {
                event.stopPropagation();
                const noteId = button.dataset.noteId;
                const note = notesTabItems.find(item => item.id === noteId);
                if (!note) return;

                const action = button.dataset.noteAction;
                if (action === "duplicate") {
                    const projectName = note.project_name || selectedProject?.name || (await window.electronAPI.getProjects(yearSelectElement.value, monthSelectElement.value))[0]?.name;
                    if (!projectName) {
                        window.alert("Create or select a project before duplicating this note.");
                        return;
                    }
                    const duplicated = await window.electronAPI.createNote(
                        yearSelectElement.value,
                        monthSelectElement.value,
                        projectName,
                        note.content,
                        note.title || ""
                    );
                    activeNoteId = duplicated.id;
                    await renderNotesForSelection(yearSelectElement.value, monthSelectElement.value);
                    return;
                }

                if (action === "rename") {
                    const name = window.prompt("Rename note", note.title || "Untitled note");
                    if (name === null) return;
                    const nextTitle = name.trim();
                    const updated = await window.electronAPI.updateNote(note.id, note.content, nextTitle);
                    note.title = updated.title || "";
                    activeNoteId = note.id;
                    await renderNotesForSelection(yearSelectElement.value, monthSelectElement.value);
                    return;
                }

                if (action === "delete") {
                    if (!window.confirm(`Delete note "${note.title || "Untitled note"}"?`)) return;
                    await window.electronAPI.deleteNote(note.id);
                    const remaining = notesTabItems.filter(item => item.id !== note.id);
                    activeNoteId = remaining[0]?.id ?? null;
                    await renderNotesForSelection(yearSelectElement.value, monthSelectElement.value);
                }
            });
        });
    } catch (error) {
        console.error("Could not load Notes tab entries:", error);
        if (notesList) notesList.innerHTML = '<div class="empty-state">Unable to load notes.</div>';
    }
}

async function initializeNotesView() {
    if (!notesYearSelect || !notesMonthSelect || !notesList) return;

    const editorContainer = document.querySelector<HTMLElement>("#notes-workspace-view .notes-editor-container");
    if (editorContainer) editorContainer.style.display = "none";

    const yearSelectElement = notesYearSelect;
    const monthSelectElement = notesMonthSelect;
    const notesListElement = notesList;

    notesAddButton?.removeAttribute("disabled");
    yearSelectElement.innerHTML = '<option>Loading...</option>';
    monthSelectElement.innerHTML = '<option>Loading...</option>';
    notesListElement.innerHTML = '<div class="empty-state">Loading notes…</div>';

    try {
        const years = await window.electronAPI.getProjectYears();
        if (!years.length) {
            yearSelectElement.innerHTML = '<option value="">No years</option>';
            monthSelectElement.innerHTML = '<option value="">No months</option>';
            notesListElement.innerHTML = '<div class="empty-state">No notes available</div>';
            return;
        }

        yearSelectElement.innerHTML = "";
        years.forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearSelectElement.appendChild(option);
        });

        const selectedYear = years.includes(String(new Date().getFullYear())) ? String(new Date().getFullYear()) : years[0];
        yearSelectElement.value = selectedYear;

        const months = await window.electronAPI.getProjectMonths(selectedYear);
        monthSelectElement.innerHTML = "";
        if (!months.length) {
            monthSelectElement.innerHTML = '<option value="">No months</option>';
            notesListElement.innerHTML = '<div class="empty-state">No notes available</div>';
            return;
        }

        months.forEach(month => {
            const option = document.createElement("option");
            option.value = month;
            option.textContent = month;
            monthSelectElement.appendChild(option);
        });

        const selectedMonth = getDefaultMonth(months, selectedYear);
        monthSelectElement.value = selectedMonth;
        await renderNotesForSelection(selectedYear, selectedMonth);
    } catch (error) {
        console.error("Could not initialize Notes view:", error);
        notesListElement.innerHTML = '<div class="empty-state">Unable to load notes.</div>';
    }
}

function escapeDashboardHtml(value: string) {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
}

function escapeHtmlAttribute(value: string) {
    return escapeDashboardHtml(value).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function dashboardDate(value: string) {
    return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" })
        .format(new Date(value));
}

// ==========================
// ATTENDANCE HELPERS
// ==========================

interface AttendanceSession {
    id: string;
    date: string;
    punch_in: string;
    punch_out: string | null;
    duration_seconds: number;
    break_durations?: string;
    attendance_type?: "regular" | "leave" | "holiday";
    half_day_part?: "first" | "second" | null;
    target_seconds?: number;
    created_at?: string;
    updated_at?: string;
}

let attendanceInterval: number | null = null;
let selectedSettingsSection: "folders" | "appearance" | "attendance" | "quotes" | "labels" | "people" | "people-templates" = "folders";
let settingsDraft: { projectsRoot: string; recurringProjectsRoot: string; accentColor: string; userName: string; quotes: string[]; targetAttendanceSeconds: number; halfDayTargetSeconds: number } | null = null;
let currentAttendanceState: {
    isPunchedIn: boolean;
    activePunchInTime: string | null;
    completedDurationSeconds: number;
    firstPunchInTime: string | null;
    sessionCount: number;
    sessions: AttendanceSession[];
    activeBreakSeconds?: number;
} | null = null;

const TARGET_WORK_SECONDS = 8 * 3600;
let configuredTargetWorkSeconds = TARGET_WORK_SECONDS;

function formatTimeAmPm(isoString?: string | null): string {
    if (!isoString) return "--:--";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "--:--";
    return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatElapsedHms(totalSeconds: number): string {
    const safeSecs = Math.max(0, Math.floor(totalSeconds));
    const hrs = Math.floor(safeSecs / 3600);
    const mins = Math.floor((safeSecs % 3600) / 60);
    const secs = safeSecs % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function formatHoursMinutes(totalSeconds: number): string {
    const safeSecs = Math.max(0, Math.floor(totalSeconds));
    const hrs = Math.floor(safeSecs / 3600);
    const mins = Math.floor((safeSecs % 3600) / 60);
    if (hrs === 0 && mins === 0) return "0m";
    if (hrs === 0) return `${mins}m`;
    return `${hrs}h ${mins}m`;
}

function formatTargetLabel(): string {
    return formatHoursMinutes(configuredTargetWorkSeconds);
}

function getActiveBreakSeconds(sessions: AttendanceSession[]): number {
    const active = sessions.find(session => !session.punch_out);
    if (!active?.break_durations) return 0;
    try {
        const durations = JSON.parse(active.break_durations);
        return Array.isArray(durations)
            ? durations.filter((value: unknown) => Number.isInteger(value) && Number(value) > 0).reduce((sum: number, value: number) => sum + value * 60, 0)
            : 0;
    } catch { return 0; }
}

function getLiveAttendanceElapsedSeconds(): number {
    if (!currentAttendanceState) return 0;
    let elapsed = currentAttendanceState.completedDurationSeconds || 0;
    if (currentAttendanceState.isPunchedIn && currentAttendanceState.activePunchInTime) {
        const punchInMs = new Date(currentAttendanceState.activePunchInTime).getTime();
        const activeElapsed = Math.max(0, Math.floor((Date.now() - punchInMs) / 1000));
        elapsed += Math.max(0, activeElapsed - (currentAttendanceState.activeBreakSeconds || 0));
    }
    return elapsed;
}

function updateAttendanceLiveDisplay() {
    const timerElem = dashboardView.querySelector<HTMLElement>("#attendance-timer-display");
    const progressFill = dashboardView.querySelector<HTMLElement>("#attendance-progress-fill");
    const progressPercentElem = dashboardView.querySelector<HTMLElement>("#attendance-progress-percent");
    const targetBanner = dashboardView.querySelector<HTMLElement>("#attendance-target-banner");
    const statusBadge = dashboardView.querySelector<HTMLElement>("#attendance-status-badge");
    const remainingElem = dashboardView.querySelector<HTMLElement>("#attendance-remaining-stat");

    if (!timerElem || !currentAttendanceState) return;

    const totalSeconds = getLiveAttendanceElapsedSeconds();
    const elapsedHours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const elapsedMinutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    timerElem.textContent = `${elapsedHours}:${elapsedMinutes}`;

    const progressPercent = Math.min(100, Math.round((totalSeconds / configuredTargetWorkSeconds) * 1000) / 10);
    const isTargetMet = totalSeconds >= configuredTargetWorkSeconds;
    dashboardView.querySelector<HTMLElement>(".dashboard-attendance-ring")?.style.setProperty("--attendance-progress", `${progressPercent}%`);
    const expectedLogout = new Date(Date.now() + Math.max(0, configuredTargetWorkSeconds - totalSeconds) * 1000)
        .toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
    const logout = dashboardView.querySelector<HTMLElement>("#attendance-expected-logout");
    if (logout) logout.textContent = isTargetMet ? "Goal reached" : expectedLogout;

    if (progressFill) {
        progressFill.style.width = `${progressPercent}%`;
        progressFill.classList.toggle("target-completed", isTargetMet);
    }

    if (progressPercentElem) {
        progressPercentElem.textContent = `${progressPercent}%`;
    }

    if (remainingElem) {
        if (isTargetMet) {
            remainingElem.textContent = "Goal reached!";
            remainingElem.style.color = "#52bc88";
        } else {
            const leftSecs = configuredTargetWorkSeconds - totalSeconds;
            remainingElem.textContent = `${formatHoursMinutes(leftSecs)} left`;
            remainingElem.style.color = "#8b92a0";
        }
    }

    if (targetBanner) {
        targetBanner.style.display = isTargetMet ? "flex" : "none";
    }

    if (statusBadge) {
        if (isTargetMet) {
            statusBadge.className = "dashboard-punch-state target-met";
            statusBadge.textContent = "Target Met";
        } else if (currentAttendanceState.isPunchedIn) {
            statusBadge.className = "dashboard-punch-state active";
            statusBadge.textContent = "Punched In";
        } else {
            statusBadge.className = "dashboard-punch-state inactive";
            statusBadge.textContent = "Not Working";
        }
    }
}

async function showMonthlyAttendanceModal(initialYear?: number, initialMonth?: number) {
    const today = new Date();
    let currentYear = initialYear ?? today.getFullYear();
    let currentMonth = initialMonth ?? (today.getMonth() + 1);

    const overlay = document.createElement("div");
    overlay.className = "atom-modal-overlay";

    const renderModalContent = async () => {
        const data = await window.electronAPI.getMonthlyAttendance(currentYear, currentMonth);

        overlay.innerHTML = `
            <div class="atom-modal attendance-monthly-modal" role="dialog" aria-modal="true" aria-labelledby="monthly-attendance-title">
                <div class="atom-modal-header">
                    <div>
                        <h2 id="monthly-attendance-title">Monthly Attendance</h2>
                        <p style="color: #9aa1ad; font-size: 12px; margin-top: 2px;">Working hours and daily breakdown</p>
                    </div>
                    <div class="attendance-month-nav">
                        <button class="attendance-nav-arrow" id="att-prev-month" type="button" title="Previous month">‹</button>
                        <span style="font-weight: 600; font-size: 13px; min-width: 110px; text-align: center;">${data.monthName} ${data.year}</span>
                        <button class="attendance-nav-arrow" id="att-next-month" type="button" title="Next month">›</button>
                    </div>
                    <button class="atom-modal-close" id="close-attendance-modal" type="button" aria-label="Close">×</button>
                </div>
                <div class="atom-modal-body">
                    <div class="attendance-monthly-stats">
                        <div class="attendance-stat-card">
                            <div class="attendance-stat-card-value">${data.daysAttended}</div>
                            <div class="attendance-stat-card-label">Days Attended</div>
                        </div>
                        <div class="attendance-stat-card">
                            <div class="attendance-stat-card-value">${data.totalHoursFormatted}</div>
                            <div class="attendance-stat-card-label">Total Hours</div>
                        </div>
                        <div class="attendance-stat-card">
                            <div class="attendance-stat-card-value">${data.avgHoursPerDayFormatted}</div>
                            <div class="attendance-stat-card-label">Avg Daily</div>
                        </div>
                        <div class="attendance-stat-card">
                            <div class="attendance-stat-card-value" style="color: #52bc88;">${data.targetMetDaysCount}</div>
                            <div class="attendance-stat-card-label">Target Met (${formatTargetLabel()})</div>
                        </div>
                    </div>

                    <div class="attendance-history-title">
                        <span>Day-by-Day Activity</span>
                        <span style="font-size: 11px; color: #8b92a0; font-weight: normal;">Target: ${formatTargetLabel()} / day</span>
                    </div>

                    <div class="attendance-table-container">
                        ${data.dailySummaries.length === 0 ? `
                            <div class="dashboard-empty" style="padding: 30px; text-align: center; color: #6b7280; font-size: 13px;">No attendance sessions logged for ${data.monthName} ${data.year}.</div>
                        ` : `
                            <table class="attendance-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>First In</th>
                                        <th>Last Out</th>
                                        <th>Duration</th>
                                        <th>${formatTargetLabel()} Goal</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.dailySummaries.map(day => `
                                        <tr>
                                            <td style="font-weight: 500; color: #fff;">${escapeDashboardHtml(day.formattedDate)}</td>
                                            <td>${formatTimeAmPm(day.firstPunchIn)}</td>
                                            <td>${day.isActiveToday ? '<span style="color: #52b6c2; font-weight: 600;">Currently In</span>' : formatTimeAmPm(day.lastPunchOut)}</td>
                                            <td style="font-weight: 600; font-variant-numeric: tabular-nums;">${escapeDashboardHtml(day.formattedHours)}</td>
                                            <td style="min-width: 100px;">
                                                <div class="attendance-progress-track" style="height: 6px;">
                                                    <div class="attendance-progress-fill ${day.targetCompleted ? 'target-completed' : ''}" style="width: ${day.progressPercentage}%"></div>
                                                </div>
                                            </td>
                                            <td>
                                                ${day.targetCompleted ? `
                                                    <span class="attendance-pill-badge met">✓ ${formatTargetLabel()} Done</span>
                                                ` : day.isActiveToday ? `
                                                    <span class="attendance-pill-badge active">● In Progress</span>
                                                ` : `
                                                    <span class="attendance-pill-badge partial">${day.progressPercentage}%</span>
                                                `}
                                            </td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        `}
                    </div>
                </div>
            </div>
        `;

        overlay.querySelector("#close-attendance-modal")?.addEventListener("click", () => overlay.remove());
        overlay.querySelector("#att-prev-month")?.addEventListener("click", async () => {
            currentMonth -= 1;
            if (currentMonth < 1) {
                currentMonth = 12;
                currentYear -= 1;
            }
            await renderModalContent();
        });
        overlay.querySelector("#att-next-month")?.addEventListener("click", async () => {
            currentMonth += 1;
            if (currentMonth > 12) {
                currentMonth = 1;
                currentYear += 1;
            }
            await renderModalContent();
        });
    };

    await renderModalContent();
    document.body.appendChild(overlay);

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

function attendanceTimeInput(value: string | null): string {
    return value ? new Date(value).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) : "";
}

function attendanceLocalDate(value: string): string {
    return value || new Date().toISOString().slice(0, 10);
}

function attendanceDateTimeToIso(dateValue: string, timeValue: string): string | undefined {
    if (!dateValue || !timeValue) return undefined;
    const [year, month, day] = dateValue.split("-").map(Number);
    const [hours, minutes] = timeValue.split(":").map(Number);
    if (![year, month, day, hours, minutes].every(Number.isFinite)) return undefined;
    const localDateTime = new Date(year, month - 1, day, hours, minutes, 0, 0);
    if (
        localDateTime.getFullYear() !== year ||
        localDateTime.getMonth() !== month - 1 ||
        localDateTime.getDate() !== day ||
        localDateTime.getHours() !== hours ||
        localDateTime.getMinutes() !== minutes
    ) return undefined;
    return localDateTime.toISOString();
}

function getDailyAttendanceQuote(availableQuotes: string[]): string {
    const quotes = availableQuotes.map(quote => quote.trim()).filter(Boolean);
    if (quotes.length === 0) return "Your attendance journey is built one focused day at a time.";
    const dateKey = `atom-attendance-quote-${new Date().toISOString().slice(0, 10)}`;
    const stored = localStorage.getItem(dateKey);
    if (stored && quotes.includes(stored)) return stored;
    const selected = quotes[Math.floor(Math.random() * quotes.length)];
    localStorage.setItem(dateKey, selected);
    return selected;
}

async function openAttendanceForm(options: { mode: "backlog" | "edit"; record?: { recordId: string; date: string; firstPunchIn: string | null; lastPunchOut: string | null; attendanceType: "regular" | "leave" | "holiday"; breakDurations?: number[]; halfDayPart?: "first" | "second" | null } }) {
    const record = options.record;
    const overlay = document.createElement("div");
    overlay.className = "attendance-form-overlay";
    overlay.innerHTML = `
        <form class="attendance-form" id="attendance-form">
            <div class="attendance-form-header"><h2>${options.mode === "edit" ? "Edit Attendance" : "Record Backlog Attendance"}</h2><button type="button" class="attendance-close" aria-label="Close">×</button></div>
            <label>Date<input name="date" type="date" required max="${options.mode === "backlog" ? new Date(Date.now() - 86400000).toISOString().slice(0, 10) : ""}" value="${attendanceLocalDate(record?.date || "")}"></label>
            <fieldset class="attendance-type-options"><legend>Attendance type</legend><label><input type="radio" name="attendanceType" value="regular" ${(record?.attendanceType ?? "regular") === "regular" ? "checked" : ""}><span>Regular</span></label><label><input type="radio" name="attendanceType" value="leave" ${record?.attendanceType === "leave" ? "checked" : ""}><span>Leave</span></label><label><input type="radio" name="attendanceType" value="holiday" ${record?.attendanceType === "holiday" ? "checked" : ""}><span>Holiday</span></label></fieldset>
            <label class="attendance-half-toggle"><input type="checkbox" name="halfDay" ${record?.halfDayPart ? "checked" : ""}><span>Half Day</span></label>
            <fieldset class="attendance-half-options" ${record?.halfDayPart ? "" : "hidden"}><legend>Half-day period</legend><label><input type="radio" name="halfDayPart" value="first" ${record?.halfDayPart === "first" ? "checked" : ""}><span>First Half</span></label><label><input type="radio" name="halfDayPart" value="second" ${record?.halfDayPart === "second" ? "checked" : ""}><span>Second Half</span></label></fieldset>
            <div class="attendance-time-fields"><label>Punch In<input name="punchIn" type="time" value="${attendanceTimeInput(record?.firstPunchIn || null)}"></label><label>Punch Out<input name="punchOut" type="time" value="${attendanceTimeInput(record?.lastPunchOut || null)}"></label></div>
            <div class="attendance-break-editor"><strong>Breaks</strong><div class="attendance-break-editor-list"></div><div class="attendance-break-editor-add"><input name="breakMinutes" type="number" min="1" step="1" placeholder="Minutes" aria-label="Break duration in minutes"><button type="button" class="attendance-break-add">Add break</button></div><small>Enter each break in minutes.</small></div>
            <p class="attendance-form-error" aria-live="polite"></p>
            <div class="attendance-form-actions">${options.mode === "edit" && record ? '<button class="attendance-delete-button" type="button">Delete Entry</button>' : ""}<button class="attendance-form-save" type="submit">Save attendance</button></div>
        </form>`;
    document.body.appendChild(overlay);
    const form = overlay.querySelector("form") as HTMLFormElement;
    const typeInputs = Array.from(form.querySelectorAll<HTMLInputElement>("input[name='attendanceType']"));
    const timeFields = form.querySelector(".attendance-time-fields") as HTMLElement;
    const halfDayToggle = form.querySelector<HTMLInputElement>("input[name='halfDay']")!;
    const halfDayOptions = form.querySelector<HTMLElement>(".attendance-half-options")!;
    let breakDurations = [...(record?.breakDurations || [])];
    const formError = form.querySelector(".attendance-form-error") as HTMLElement;
    const syncType = () => { timeFields.hidden = form.querySelector<HTMLInputElement>("input[name='attendanceType']:checked")?.value !== "regular"; };
    const renderBreakEditor = () => {
        const list = form.querySelector<HTMLElement>(".attendance-break-editor-list")!;
        const total = breakDurations.reduce((sum, duration) => sum + duration, 0);
        list.innerHTML = `${breakDurations.length ? breakDurations.map((duration, index) => `<span class="attendance-break-chip">${duration} min <button type="button" data-break-index="${index}" aria-label="Remove ${duration} minute break">×</button></span>`).join("") : '<span class="attendance-break-none">No breaks added</span>'}<strong>Total: ${total} min</strong>`;
        list.querySelectorAll<HTMLButtonElement>("[data-break-index]").forEach(button => button.addEventListener("click", () => {
            breakDurations.splice(Number(button.dataset.breakIndex), 1);
            renderBreakEditor();
        }));
    };
    form.querySelector(".attendance-break-add")?.addEventListener("click", () => {
        const input = form.querySelector<HTMLInputElement>("input[name='breakMinutes']")!;
        const value = Number(input.value);
        if (!Number.isInteger(value) || value < 1) {
            formError.textContent = "Enter a positive whole number of break minutes.";
            return;
        }
        breakDurations.push(value);
        input.value = "";
        formError.textContent = "";
        renderBreakEditor();
    });
    halfDayToggle.addEventListener("change", () => {
        halfDayOptions.hidden = !halfDayToggle.checked;
        if (halfDayToggle.checked && !form.querySelector<HTMLInputElement>("input[name='halfDayPart']:checked")) {
            form.querySelector<HTMLInputElement>("input[name='halfDayPart'][value='first']")!.checked = true;
        }
    });
    typeInputs.forEach(input => input.addEventListener("change", syncType));
    syncType();
    renderBreakEditor();
    overlay.querySelector(".attendance-close")?.addEventListener("click", () => overlay.remove());
    overlay.querySelector(".attendance-delete-button")?.addEventListener("click", async () => {
        if (!record || !window.confirm("Delete this attendance entry?")) return;
        try {
            await window.electronAPI.deleteAttendanceRecord(record.recordId);
            overlay.remove();
            await renderAttendanceRecord();
        } catch (deleteError) {
            formError.textContent = deleteError instanceof Error ? deleteError.message : "Attendance could not be deleted.";
        }
    });
    form.addEventListener("submit", async event => {
        event.preventDefault();
        const data = new FormData(form);
        const date = String(data.get("date"));
        const type = String(data.get("attendanceType")) as "regular" | "leave" | "holiday";
        const punchIn = String(data.get("punchIn") || "");
        const punchOut = String(data.get("punchOut") || "");
        const halfDayPart = halfDayToggle.checked ? String(data.get("halfDayPart") || "first") as "first" | "second" : null;
        const error = form.querySelector(".attendance-form-error") as HTMLElement;
        if (options.mode === "backlog" && date >= new Date().toISOString().slice(0, 10)) {
            error.textContent = "Backlog attendance must use a previous date.";
            return;
        }
        if (type === "regular" && (!punchIn || !punchOut || punchOut <= punchIn)) {
            error.textContent = "Enter a valid punch-in and punch-out time.";
            return;
        }
        try {
            if (options.mode === "edit" && record) {
                await window.electronAPI.updateAttendanceRecord(record.recordId, { date, punchIn, punchOut, attendanceType: type, breakDurations, halfDayPart, replaceDateRecords: true });
            } else {
                await window.electronAPI.createAttendanceRecord({ date, punchIn, punchOut, attendanceType: type, breakDurations, halfDayPart });
            }
            overlay.remove();
            await renderAttendanceRecord();
        } catch (submitError) {
            error.textContent = submitError instanceof Error ? submitError.message : "Attendance could not be saved.";
        }
    });
}

async function renderAttendanceRecord() {
    if (!attendanceRecordView) return;
    if (attendanceInterval) window.clearInterval(attendanceInterval);
    attendanceRecordView.innerHTML = `<div class="attendance-page-loading">Loading attendance...</div>`;
    const today = new Date();
    let selectedYear = today.getFullYear();
    let selectedMonth = today.getMonth() + 1;
    const render = async () => {
        const [data, monthly, settings] = await Promise.all([window.electronAPI.getAttendanceData(), window.electronAPI.getMonthlyAttendance(selectedYear, selectedMonth), window.electronAPI.getSettings()]);
        if (activeView !== "attendance") return;
        const activeSession = data.today.sessions.find((session: AttendanceSession) => !session.punch_out);
        const breakSession = activeSession || [...data.today.sessions].reverse().find((session: AttendanceSession) => session.attendance_type === "regular");
        const parseSessionBreaks = (session?: AttendanceSession) => {
            try {
                const values = JSON.parse(session?.break_durations || "[]");
                return Array.isArray(values) ? values.filter((value: unknown) => Number.isInteger(value) && Number(value) > 0) as number[] : [];
            } catch { return []; }
        };
        const todayBreaks = parseSessionBreaks(breakSession);
        currentAttendanceState = {
            isPunchedIn: data.today.isPunchedIn,
            activePunchInTime: data.today.activePunchInTime,
            completedDurationSeconds: data.today.completedDurationSeconds,
            firstPunchInTime: data.today.firstPunchInTime,
            sessionCount: data.today.sessionCount,
            sessions: data.today.sessions,
            activeBreakSeconds: parseSessionBreaks(activeSession).reduce((sum, minutes) => sum + minutes * 60, 0),
        };
        configuredTargetWorkSeconds = data.today.targetSeconds;
        const totalSeconds = getLiveAttendanceElapsedSeconds();
        const progress = Math.min(100, totalSeconds / configuredTargetWorkSeconds * 100);
        const durationParts = (seconds: number) => ({ hours: Math.floor(seconds / 3600), minutes: Math.floor(seconds % 3600 / 60) });
        const live = durationParts(totalSeconds);
        const attendanceWeekGroups = new Map<number, typeof monthly.dailySummaries>();
        monthly.dailySummaries.forEach(day => {
            const [year, month, date] = day.date.split("-").map(Number);
            const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
            const weekNumber = Math.floor((firstDayOfMonth + date - 1) / 7) + 1;
            const weekDays = attendanceWeekGroups.get(weekNumber) ?? [];
            weekDays.push(day);
            attendanceWeekGroups.set(weekNumber, weekDays);
        });
        const attendanceWeekRows = Array.from(attendanceWeekGroups.entries())
            .sort(([, weekDaysA], [, weekDaysB]) => {
                const latestDateA = weekDaysA.reduce((latest, day) => day.date > latest ? day.date : latest, "");
                const latestDateB = weekDaysB.reduce((latest, day) => day.date > latest ? day.date : latest, "");
                return latestDateB.localeCompare(latestDateA);
            })
            .map(([weekNumber, weekDays]) => {
                const completedRegularDays = weekDays.filter(day => day.attendanceType === "regular" && day.firstPunchIn && day.lastPunchOut && Number.isFinite(new Date(day.firstPunchIn).getTime()) && Number.isFinite(new Date(day.lastPunchOut).getTime()) && Number.isFinite(day.totalDurationSeconds));
                const weeklyAverage = completedRegularDays.length > 0
                    ? ` (avg ${formatHoursMinutes(Math.round(completedRegularDays.reduce((total, day) => total + day.totalDurationSeconds, 0) / completedRegularDays.length))})`
                    : "";
                return `<div class="attendance-week-group"><div class="attendance-week-divider" role="separator"><span>Week ${weekNumber}${weeklyAverage}</span></div>${weekDays.sort((dayA, dayB) => dayB.date.localeCompare(dayA.date)).map(day => { const parts = durationParts(day.totalDurationSeconds); const state = day.attendanceType !== "regular" ? day.attendanceType : day.targetCompleted ? "above" : "below"; return `<article class="attendance-day-row ${state}"><div class="attendance-day-info"><span class="attendance-date-badge">${day.dayNumber}<small>${day.formattedDate.split(" ")[0]}</small></span><div><strong>${day.dayOfWeek}</strong><small>${day.attendanceType === "regular" ? `Login: ${formatTimeAmPm(day.firstPunchIn)}` : day.attendanceType}</small></div><i></i><small>${day.attendanceType === "regular" ? `Logout: ${formatTimeAmPm(day.lastPunchOut)}` : "Not applicable"}</small></div><div class="attendance-day-total">${day.attendanceType === "regular" ? `<strong>${String(parts.hours).padStart(2, "0")}</strong><span>${String(parts.minutes).padStart(2, "0")} min</span><small>hrs</small>` : `<strong class="attendance-special">${day.attendanceType}</strong>`}</div><button class="attendance-edit-button" data-attendance-id="${day.recordId}" type="button">Edit</button></article>`; }).join("")}</div>`;
            })
            .join("");
        attendanceRecordView.innerHTML = `
            <div class="attendance-page">
                <section class="attendance-status-panel">
                    <div class="attendance-status-stack">
                        <div class="attendance-timer-section">
                            <div class="attendance-status-copy"><h1>Hey ${escapeDashboardHtml(settings.userName)}</h1><h2>Welcome Back</h2><p>${escapeDashboardHtml(getDailyAttendanceQuote(settings.quotes))}</p></div>
                            <div class="attendance-gauge" style="--attendance-progress:${progress * 3.6}deg"><div class="attendance-gauge-inner"><span class="attendance-status-pill ${data.today.isPunchedIn ? "is-active" : ""}">${data.today.isPunchedIn ? "Punched In" : "Not Working"}</span><small>${data.today.firstPunchInTime ? formatTimeAmPm(data.today.firstPunchInTime) : "Not started"}</small><strong>${String(live.hours).padStart(2, "0")}:${String(live.minutes).padStart(2, "0")}</strong><em>hrs</em><small>EXPECTED LOGOUT</small><b>${data.today.firstPunchInTime ? formatTimeAmPm(new Date(new Date(data.today.firstPunchInTime).getTime() + (configuredTargetWorkSeconds + todayBreaks.reduce((sum, value) => sum + value * 60, 0)) * 1000).toISOString()) : "--:--"}</b></div></div>
                        </div>

                        <div class="attendance-section attendance-breaks-section">
                            <div class="attendance-section-heading">Breaks</div>
                            <div class="attendance-live-breaks">
                                <div class="attendance-live-break-summary">${todayBreaks.length ? `${todayBreaks.join(" min + ")} min = ${todayBreaks.reduce((sum, value) => sum + value, 0)} min` : "No breaks"}</div>
                                <div class="attendance-live-break-add">
                                    <input id="attendance-break-minutes" type="number" min="1" step="1" placeholder="Minutes" aria-label="Break duration in minutes" ${breakSession ? "" : "disabled"}>
                                    <button id="attendance-break-add" type="button" ${breakSession ? "" : "disabled"}>Add Break</button>
                                </div>
                                <div class="attendance-live-break-list">${todayBreaks.map((minutes, index) => `<span>${minutes} min <button type="button" data-break-remove="${index}" aria-label="Remove ${minutes} minute break">×</button></span>`).join("")}</div>
                                <small id="attendance-break-error" aria-live="polite"></small>
                            </div>
                        </div>

                        <div class="attendance-action-section">
                            <button class="attendance-primary-action ${data.today.isPunchedIn ? "is-punch-out" : ""}" id="record-punch-button">${data.today.isPunchedIn ? "Punch Out" : "Punch In"}</button>
                        </div>

                        <div class="attendance-edit-section">
                            <div class="attendance-section-heading">Edit Start Time</div>
                            <div class="attendance-bottom-control">
                                <label><span>Time</span><input id="attendance-start-time" type="time" value="${attendanceTimeInput(data.today.firstPunchInTime)}"></label>
                                <button id="attendance-start-update" type="button">Update</button>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="attendance-log-panel"><header><div><span class="attendance-period">${monthly.monthName}</span><small>${monthly.year}</small></div><div class="attendance-average"><small>Avg Per Day</small><strong>${monthly.avgHoursPerDayFormatted}</strong></div><div class="attendance-month-buttons"><button id="attendance-prev-month" type="button" aria-label="Previous month">‹</button><button id="attendance-next-month" type="button" aria-label="Next month">›</button></div></header><div class="attendance-log-actions"><button id="attendance-backlog" type="button">+ Record Backlog Attendance</button><span>${monthly.daysAttended} logged days · ${monthly.totalHoursFormatted} total</span></div><div class="attendance-day-list">${monthly.dailySummaries.length ? attendanceWeekRows : `<div class="attendance-empty">No attendance recorded for ${monthly.monthName}.</div>`}</div></section>
            </div>`;
        attendanceRecordView.querySelector("#record-punch-button")?.addEventListener("click", async () => {
            const button = attendanceRecordView.querySelector("#record-punch-button") as HTMLButtonElement;
            button.disabled = true;
            try {
                if (data.today.isPunchedIn) {
                    await window.electronAPI.punchOut();
                } else {
                    await window.electronAPI.punchIn();
                }
                await render();
            } catch (punchError) {
                console.error("Attendance punch action failed:", punchError);
                button.disabled = false;
            }
        });
        const updateBreakList = async (nextBreaks: number[]) => {
            if (!breakSession) return;
            const error = attendanceRecordView.querySelector<HTMLElement>("#attendance-break-error");
            try {
                await window.electronAPI.updateAttendanceBreaks(breakSession.id, nextBreaks);
                if (error) error.textContent = "";
                await render();
            } catch (breakError) {
                if (error) error.textContent = breakError instanceof Error ? breakError.message : "Breaks could not be saved.";
            }
        };
        attendanceRecordView.querySelector("#attendance-break-add")?.addEventListener("click", async () => {
            const input = attendanceRecordView.querySelector<HTMLInputElement>("#attendance-break-minutes");
            const minutes = Number(input?.value);
            const error = attendanceRecordView.querySelector<HTMLElement>("#attendance-break-error");
            if (!Number.isInteger(minutes) || minutes < 1) {
                if (error) error.textContent = "Enter a positive whole number of minutes.";
                return;
            }
            await updateBreakList([...todayBreaks, minutes]);
        });
        attendanceRecordView.querySelectorAll<HTMLButtonElement>("[data-break-remove]").forEach(button => button.addEventListener("click", () => {
            const nextBreaks = [...todayBreaks];
            nextBreaks.splice(Number(button.dataset.breakRemove), 1);
            void updateBreakList(nextBreaks);
        }));
        attendanceRecordView.querySelector("#attendance-backlog")?.addEventListener("click", () => openAttendanceForm({ mode: "backlog" }));
        attendanceRecordView.querySelector("#attendance-start-update")?.addEventListener("click", async () => {
            const session = data.today.sessions[0];
            const input = attendanceRecordView.querySelector("#attendance-start-time") as HTMLInputElement | null;
            if (!session || !input?.value) return;
            await window.electronAPI.updateAttendanceRecord(session.id, {
                date: data.today.date,
                punchIn: attendanceDateTimeToIso(data.today.date, input.value),
                punchOut: session.punch_out || undefined,
                attendanceType: "regular",
            });
            await render();
        });
        attendanceRecordView.querySelector("#attendance-prev-month")?.addEventListener("click", async () => { selectedMonth -= 1; if (selectedMonth < 1) { selectedMonth = 12; selectedYear -= 1; } await render(); });
        attendanceRecordView.querySelector("#attendance-next-month")?.addEventListener("click", async () => { selectedMonth += 1; if (selectedMonth > 12) { selectedMonth = 1; selectedYear += 1; } await render(); });
        attendanceRecordView.querySelectorAll<HTMLButtonElement>(".attendance-edit-button").forEach(button => { button.addEventListener("click", async () => { const day = monthly.dailySummaries.find(item => item.recordId === button.dataset.attendanceId); if (day) await openAttendanceForm({ mode: "edit", record: day }); }); });
        attendanceInterval = window.setInterval(() => { if (activeView === "attendance") void render(); }, 30000);
    };
    await render();
}

let dashboardCalendarDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
let dashboardSelectedDate = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`;

async function renderDashboard() {
    if (attendanceInterval) {
        clearInterval(attendanceInterval);
        attendanceInterval = null;
    }

    dashboardView.innerHTML = `<div class="dashboard-loading">Loading dashboard…</div>`;

    try {
        const [{ projects, notes }, attendanceData, settings] = await Promise.all([
            window.electronAPI.getDashboardData(),
            window.electronAPI.getAttendanceData(),
            window.electronAPI.getSettings()
        ]);
        if (activeView !== "dashboard") return;

        currentAttendanceState = {
            isPunchedIn: attendanceData.today.isPunchedIn,
            activePunchInTime: attendanceData.today.activePunchInTime,
            completedDurationSeconds: attendanceData.today.completedDurationSeconds,
            firstPunchInTime: attendanceData.today.firstPunchInTime,
            sessionCount: attendanceData.today.sessionCount,
            sessions: attendanceData.today.sessions,
            activeBreakSeconds: getActiveBreakSeconds(attendanceData.today.sessions),
        };

        const recentProjects = projects.slice(0, 4);
        const today = new Date();
        dashboardCalendarDate = new Date(dashboardCalendarDate.getFullYear(), dashboardCalendarDate.getMonth(), 1);
        const calendarMonth = dashboardCalendarDate;
        const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
        const calendarDays = Array.from({ length: 42 }, (_, index) => {
            const day = new Date(monthStart);
            day.setDate(1 - monthStart.getDay() + index);
            return day;
        });
        const deadlines = new Set(projects.filter(project => project.deadline).map(project => project.deadline));

        const liveTotalSecs = getLiveAttendanceElapsedSeconds();
        configuredTargetWorkSeconds = attendanceData.today.targetSeconds;
        const progressPercent = Math.min(100, Math.round((liveTotalSecs / configuredTargetWorkSeconds) * 1000) / 10);
        const isTargetMet = liveTotalSecs >= configuredTargetWorkSeconds;
        const expectedLogout = new Date(Date.now() + Math.max(0, configuredTargetWorkSeconds - liveTotalSecs) * 1000)
            .toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
        const activeSession = attendanceData.today.sessions[0];
        const startTimeValue = activeSession?.punch_in ? new Date(activeSession.punch_in).toTimeString().slice(0, 5) : "";
        const quote = settings.quotes?.[today.getDate() % Math.max(settings.quotes.length, 1)] || "Make today count.";
        const monthLabel = calendarMonth.toLocaleString(undefined, { month: "long", year: "numeric" });
        const selectedDateIso = dashboardSelectedDate;
        const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

        dashboardView.innerHTML = `
            <div class="dashboard-grid">
                <header class="dashboard-greeting">
                    <h1>Hey ${escapeDashboardHtml(settings.userName || "User")}</h1>
                    <p>“${escapeDashboardHtml(quote)}”</p>
                </header>
                <section class="dashboard-panel dashboard-tasks-panel">
                    <div class="dashboard-panel-heading"><h2>Tasks</h2><button class="dashboard-add-task" id="dashboard-add-task" type="button">＋ Add</button></div>
                    <div class="dashboard-task-list">
                        ${recentProjects.map(project => `<article class="dashboard-task-card">
                            <div class="dashboard-task-meta"><time>${formatCardDate(project.created_at || project.updated_at)}</time><span class="dashboard-task-status status-${project.status ?? "not-started"}">${PROJECT_STATUSES.find(item => item.value === project.status)?.label ?? "Not started"}</span></div>
                            <button class="dashboard-task-title dashboard-open-project" data-dashboard-project-id="${project.id}" type="button"><span aria-hidden="true">▤</span>${escapeDashboardHtml(project.name)}</button>
                            <p>${escapeDashboardHtml(project.description || "Open this project to view its files, notes, and details.")}</p>
                            ${project.deadline ? `<small class="dashboard-task-deadline">Deadline: ${dashboardDate(project.deadline)}</small>` : ""}
                        </article>`).join("") || `<div class="dashboard-empty">Create a project to see it here.</div>`}
                    </div>
                </section>

                <section class="dashboard-panel attendance-panel dashboard-attendance-panel">
                    <div class="dashboard-attendance-ring" style="--attendance-progress:${progressPercent}%">
                        <div class="dashboard-attendance-ring-inner">
                            <span id="attendance-status-badge" class="dashboard-punch-state ${isTargetMet ? "target-met" : currentAttendanceState.isPunchedIn ? "active" : "inactive"}">${isTargetMet ? "Target Met" : currentAttendanceState.isPunchedIn ? "Punched In" : "Not Working"}</span>
                            <span class="dashboard-start-time">${currentAttendanceState.firstPunchInTime ? formatTimeAmPm(currentAttendanceState.firstPunchInTime) : "Not started"}</span>
                            <div class="attendance-timer-display" id="attendance-timer-display">${String(Math.floor(liveTotalSecs / 3600)).padStart(2, "0")}:${String(Math.floor((liveTotalSecs % 3600) / 60)).padStart(2, "0")}</div>
                            <small>of ${formatTargetLabel()}</small>
                            <div class="dashboard-expected-logout"><span>EXPECTED LOGOUT</span><strong id="attendance-expected-logout">${isTargetMet ? "Goal reached" : expectedLogout}</strong></div>
                        </div>
                    </div>
                    <button class="attendance-punch-btn ${currentAttendanceState.isPunchedIn ? "punch-out" : "punch-in"}" id="attendance-punch-btn" type="button">${currentAttendanceState.isPunchedIn ? "Punch Out" : "Punch In"}</button>
                    <div class="dashboard-start-edit"><label for="attendance-start-time">Edit Start Time:</label><input id="attendance-start-time" type="time" value="${startTimeValue}" ${activeSession ? "" : "disabled"}><button id="attendance-start-update" type="button" ${activeSession ? "" : "disabled"}>Update</button></div>
                    <button class="attendance-monthly-btn" id="attendance-monthly-btn" type="button">${attendanceData.monthly.daysAttended} days · ${attendanceData.monthly.totalHoursFormatted} · Monthly overview</button>
                </section>

                <section class="dashboard-panel calendar-panel">
                    <div class="dashboard-calendar-heading"><button id="dashboard-calendar-prev" type="button" aria-label="Previous month">‹</button><h2>${monthLabel}</h2><button id="dashboard-calendar-next" type="button" aria-label="Next month">›</button></div>
                    <div class="dashboard-calendar-weekdays">${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => `<span>${day}</span>`).join("")}</div>
                    <div class="dashboard-calendar-days">${calendarDays.map(day => { const iso = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`; return `<button type="button" data-calendar-date="${iso}" class="${day.getMonth() !== calendarMonth.getMonth() ? "outside-month " : ""}${iso === todayIso ? "today " : ""}${iso === selectedDateIso ? "selected-day " : ""}${deadlines.has(iso) ? "has-deadline" : ""}">${day.getDate()}</button>`; }).join("")}</div>
                </section>
                <section class="dashboard-panel recent-notes-panel">
                    <div class="dashboard-panel-heading"><h2>Recent Notes</h2></div>
                    <div class="dashboard-notes-grid">
                        ${notes.slice(0, 4).map(note => { const plainText = extractPlainText(note.content).trim() || "Untitled note"; const [title, ...body] = plainText.split(/\n/); const project = projects.find(item => item.id === note.project_id); return `<article class="dashboard-note-card"><div><time>${dashboardDate(note.updated_at)}</time></div><h3><span aria-hidden="true">▤</span> ${escapeDashboardHtml(title)}</h3><p>${escapeDashboardHtml(body.join(" ") || plainText)}</p>${project ? `<button class="dashboard-note-project-link dashboard-open-project" data-dashboard-project-id="${project.id}" type="button">Open project</button>` : ""}</article>`; }).join("") || `<div class="dashboard-empty">No notes yet.</div>`}
                    </div>
                </section>
            </div>`;

        // Start live accurate ticking
        attendanceInterval = window.setInterval(() => {
            if (activeView === "dashboard") {
                updateAttendanceLiveDisplay();
            }
        }, 500);

        // Punch button listener
        const punchBtn = document.getElementById("attendance-punch-btn") as HTMLButtonElement | null;
        punchBtn?.addEventListener("click", async () => {
            punchBtn.disabled = true;
            try {
                if (currentAttendanceState?.isPunchedIn) {
                    const updated = await window.electronAPI.punchOut();
                    currentAttendanceState = {
                        isPunchedIn: updated.isPunchedIn,
                        activePunchInTime: updated.activePunchInTime,
                        completedDurationSeconds: updated.completedDurationSeconds,
                        firstPunchInTime: updated.firstPunchInTime,
                        sessionCount: updated.sessionCount,
                        sessions: updated.sessions,
                        activeBreakSeconds: getActiveBreakSeconds(updated.sessions),
                    };
                    punchBtn.textContent = "Punch In";
                    punchBtn.className = "attendance-punch-btn punch-in";
                } else {
                    const updated = await window.electronAPI.punchIn();
                    currentAttendanceState = {
                        isPunchedIn: updated.isPunchedIn,
                        activePunchInTime: updated.activePunchInTime,
                        completedDurationSeconds: updated.completedDurationSeconds,
                        firstPunchInTime: updated.firstPunchInTime,
                        sessionCount: updated.sessionCount,
                        sessions: updated.sessions,
                        activeBreakSeconds: getActiveBreakSeconds(updated.sessions),
                    };
                    punchBtn.textContent = "Punch Out";
                    punchBtn.className = "attendance-punch-btn punch-out";
                }
                updateAttendanceLiveDisplay();
            } catch (err) {
                console.error("Attendance action error:", err);
            } finally {
                punchBtn.disabled = false;
            }
        });

        // Monthly overview button listener
        document.getElementById("attendance-monthly-btn")?.addEventListener("click", () => {
            showMonthlyAttendanceModal();
        });

        dashboardView.querySelector<HTMLButtonElement>("#dashboard-add-task")?.addEventListener("click", async () => {
            await switchView("projects");
            createProjectButton?.click();
        });
        dashboardView.querySelector<HTMLButtonElement>("#dashboard-calendar-prev")?.addEventListener("click", () => {
            dashboardCalendarDate = new Date(dashboardCalendarDate.getFullYear(), dashboardCalendarDate.getMonth() - 1, 1);
            void renderDashboard();
        });
        dashboardView.querySelector<HTMLButtonElement>("#dashboard-calendar-next")?.addEventListener("click", () => {
            dashboardCalendarDate = new Date(dashboardCalendarDate.getFullYear(), dashboardCalendarDate.getMonth() + 1, 1);
            void renderDashboard();
        });
        dashboardView.querySelectorAll<HTMLButtonElement>("[data-calendar-date]").forEach(button => button.addEventListener("click", async () => {
            const selectedIso = button.dataset.calendarDate || dashboardSelectedDate;
            dashboardSelectedDate = selectedIso;
            const [year, monthNumber] = selectedIso.split("-");
            const monthIndex = Number(monthNumber) - 1;
            const monthName = MONTH_NAMES[monthIndex];
            if (!year || !monthName || !yearSelect || !monthSelect) return;

            dashboardView.querySelectorAll("[data-calendar-date]").forEach(day => day.classList.toggle("selected-day", day === button));
            dashboardCalendarDate = new Date(Number(year), monthIndex, 1);

            await switchView("projects");

            const years = await window.electronAPI.getProjectYears();
            if (!years.includes(year)) {
                const yearOption = document.createElement("option");
                yearOption.value = year;
                yearOption.textContent = year;
                yearSelect.appendChild(yearOption);
            }
            yearSelect.value = year;

            const availableMonths = await window.electronAPI.getProjectMonths(year);
            monthSelect.innerHTML = "";
            availableMonths.forEach(availableMonth => {
                const option = document.createElement("option");
                option.value = availableMonth;
                option.textContent = availableMonth;
                monthSelect.appendChild(option);
            });
            const monthValue = availableMonths.find(availableMonth => {
                const range = getMonthDateRange(year, availableMonth);
                return range.minDate.slice(5, 7) === monthNumber;
            }) ?? monthName;
            if (!availableMonths.includes(monthValue)) {
                const monthOption = document.createElement("option");
                monthOption.value = monthValue;
                monthOption.textContent = monthValue;
                monthSelect.appendChild(monthOption);
            }
            monthSelect.value = monthValue;

            try {
                const projects = await window.electronAPI.getProjects(year, monthValue);
                if (activeView !== "projects") return;
                renderProjects(projects);
                const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                const projectForDate = projects.find(project => dateKey(new Date(project.created_at)) === selectedIso);
                const project = projectForDate ?? projects[0];
                if (project) updateProjectWorkspace(project);
                else clearWorkspace();
            } catch (error) {
                console.error("Could not open projects for the selected calendar date:", error);
                renderProjects([]);
            }
        }));
        dashboardView.querySelector<HTMLButtonElement>("#attendance-start-update")?.addEventListener("click", async () => {
            const session = attendanceData.today.sessions[0];
            const input = dashboardView.querySelector<HTMLInputElement>("#attendance-start-time");
            if (!session || !input?.value) return;
            await window.electronAPI.updateAttendanceRecord(session.id, {
                date: attendanceData.today.date,
                punchIn: attendanceDateTimeToIso(attendanceData.today.date, input.value),
                punchOut: session.punch_out || undefined,
                attendanceType: "regular",
            });
            await renderDashboard();
        });

        dashboardView.querySelectorAll<HTMLButtonElement>(".dashboard-open-project").forEach(button => {
            button.addEventListener("click", async () => {
                const project = projects.find(item => item.id === button.dataset.dashboardProjectId);
                if (!project) return;
                const [year, month] = project.path.split(/[\\/]/).slice(-3, -1);
                await switchView("projects");
                yearSelect.value = year;
                await loadMonths(year);
                monthSelect.value = month;
                await loadProjects(year, month);
                selectedProjectName = project.name;
                updateProjectWorkspace(project.name);
            });
        });
    } catch (error) {
        console.error("Failed to load dashboard:", error);
        dashboardView.innerHTML = `<div class="dashboard-empty">The dashboard could not be loaded.</div>`;
    }
}


// ==========================
// LOAD YEARS
// ==========================

function getDefaultYear(years: string[]) {
    const currentYear = String(new Date().getFullYear());

    if (years.includes(currentYear)) {
        return currentYear;
    }

    return years[0] || "";
}

function getDefaultMonth(months: string[], year: string) {
    const currentYear = String(new Date().getFullYear());
    const currentMonth = MONTH_NAMES[new Date().getMonth()];

    if (year === currentYear && months.includes(currentMonth)) {
        return currentMonth;
    }

    return months[0] || "";
}

function getMonthDateRange(yearStr: string, monthStr: string): { minDate: string; maxDate: string } {
    let year = parseInt(yearStr, 10);
    if (isNaN(year) || year < 1900) {
        year = new Date().getFullYear();
    }

    let monthIndex = -1;
    const lowerMonth = (monthStr || "").toLowerCase();
    monthIndex = MONTH_NAMES.findIndex(m => lowerMonth.includes(m.toLowerCase()));

    if (monthIndex === -1) {
        const numMatch = (monthStr || "").match(/\b(0?[1-9]|1[0-2])\b/);
        if (numMatch) {
            monthIndex = parseInt(numMatch[1], 10) - 1;
        }
    }

    if (monthIndex < 0 || monthIndex > 11) {
        monthIndex = new Date().getMonth();
    }

    const monthPadded = String(monthIndex + 1).padStart(2, "0");
    const lastDay = new Date(year, monthIndex + 1, 0).getDate();
    const lastDayPadded = String(lastDay).padStart(2, "0");

    return {
        minDate: `${year}-${monthPadded}-01`,
        maxDate: `${year}-${monthPadded}-${lastDayPadded}`
    };
}

async function loadYears() {

    const years =
        await window.electronAPI.getProjectYears();

    if (activeView !== "projects") return;

    yearSelect.innerHTML = "";

    if (years.length === 0) {
        yearSelect.innerHTML =
            `<option value="">No years</option>`;
        monthSelect.innerHTML =
            `<option value="">No months</option>`;
        renderProjects([]);
        return;
    }

    years.forEach(year => {
        const option =
            document.createElement("option");

        option.value = year;
        option.textContent = year;

        yearSelect.appendChild(option);
    });

    const selectedYear = getDefaultYear(years);
    yearSelect.value = selectedYear;

    await loadMonths(selectedYear);

}


// ==========================
// LOAD MONTHS
// ==========================

async function loadMonths(
    year: string
) {

    const months =
        await window.electronAPI.getProjectMonths(year);

    if (activeView !== "projects") return;

    monthSelect.innerHTML = "";

    if (months.length === 0) {
        monthSelect.innerHTML =
            `<option value="">No months</option>`;
        renderProjects([]);
        return;
    }

    months.forEach(month => {
        const option =
            document.createElement("option");

        option.value = month;
        option.textContent = month;

        monthSelect.appendChild(option);
    });

    const selectedMonth = getDefaultMonth(months, year);
    monthSelect.value = selectedMonth;

    await loadProjects(
        year,
        selectedMonth
    );

}


// ==========================
// LOAD PROJECTS
// ==========================

async function loadProjects(
    year: string,
    month: string
) {

    if (!year || !month) {
        renderProjects([]);
        return;
    }

    try {
        const projects =
            await window.electronAPI.getProjects(
                year,
                month
            );

        if (activeView !== "projects") return;

        if (activeProjectFolderTab) {
            showCreateProjectModal();
            return;
        }

        renderProjects(projects);
    } catch (error) {
        console.error("Failed to load projects:", error);
        if (activeView === "projects") {
            renderProjects([]);
        }
    }

}


// ==========================
// LOAD PINNED PROJECTS
// ==========================

async function loadPinnedProjects() {
    try {
        const projects = await window.electronAPI.getPinnedProjects();
        if (activeView !== "pinned") return;
        renderProjects(projects as RealProject[]);
        if (projects.length === 0) {
            if (projectList) {
                projectList.innerHTML = `<div class="empty-state">No pinned projects yet.<br>Use the ★ Pin Project option in a project's menu to pin it.</div>`;
            }
            clearWorkspace();
        }
    } catch (error) {
        console.error("Failed to load pinned projects:", error);
        if (activeView === "pinned") renderProjects([]);
    }
}


// ==========================
// LOAD RECURRING PROJECTS
// ==========================

async function loadRecurringProjects() {
    try {
        const projects = await window.electronAPI.getRecurringProjects();
        if (activeView !== "recurring") return;
        renderProjects(projects as RealProject[]);
        if (projects.length === 0) {
            if (projectList) {
                projectList.innerHTML = `<div class="empty-state">No recurring projects yet.<br>Create a folder in <strong>Recurring Projects</strong> inside your projects root to see it here.</div>`;
            }
            clearWorkspace();
        }
    } catch (error) {
        console.error("Failed to load recurring projects:", error);
        if (activeView === "recurring") renderProjects([]);
    }
}


// ==========================
// RENDER PROJECTS
// ==========================

async function showProjectOptions(
    projectName: string,
    projectPath?: string
) {
    let project: RealProject | undefined = currentProjects.find(
        p => (projectPath && p.path === projectPath) || p.name === projectName
    );

    const loc = getProjectLocation(project || projectPath || projectName);

    const [tags, labels, people] =
        await Promise.all([
            loc.path ? window.electronAPI.getProjectTags(loc.path) : window.electronAPI.getProjectTags(loc.year, loc.month, loc.name),
            window.electronAPI.getDirectoryItems("label"),
            window.electronAPI.getDirectoryItems("person")
        ]);

    if (!project) {
        const allPinned = await window.electronAPI.getPinnedProjects().catch(() => []);
        project = allPinned.find((p: RealProject) => (projectPath && p.path === projectPath) || p.name === projectName)
            || (await window.electronAPI.getProjects(loc.year, loc.month).then((list: RealProject[]) => list.find(p => p.name === loc.name)).catch(() => undefined));
    }

    if (!project) return;

    const overlay =
        document.createElement("div");

    overlay.className =
        "atom-modal-overlay";

    const renderTagSection = (
        type: "label" | "person",
        title: string,
        items: DirectoryItem[],
        assignedIds: string[]
    ) => {
        const assigned = items.filter(item =>
            assignedIds.includes(item.id)
        );

        const available = items.filter(item => !assignedIds.includes(item.id));

        return `
            <div class="project-options-section">
                <div class="project-options-section-row">
                    <span class="project-options-label">${title}</span>
                    <button class="project-option-add-button" type="button" data-picker-type="${type}">+ Add</button>
                </div>
                <div class="project-options-tags">
                    ${assigned.map(item => `
                        <button
                            class="project-option-tag"
                            data-project-tag-type="${type}"
                            data-project-tag-id="${item.id}"
                            title="Remove ${item.name}"
                        >
                            ${type === "person"
                                ? getUserIconMarkup(item.color, "project-option-user-icon")
                                : `<span style="background: ${item.color}"></span>`
                            }
                            ${item.name} ×
                        </button>
                    `).join("") || `<span class="tag-empty">None assigned</span>`}
                </div>
                <div class="project-option-picker" data-picker-type="${type}">
                    ${available.length === 0
                        ? `<div class="tag-picker-empty">No ${title.toLowerCase()} available</div>`
                        : available.map(item => `
                            <button type="button" class="project-option-picker-option" data-tag-id="${item.id}" data-tag-type="${type}">
                                ${type === "person"
                                    ? getUserIconMarkup(item.color, "project-option-user-icon")
                                    : `<span style="background: ${item.color}"></span>`
                                }
                                ${item.name}
                            </button>
                        `).join("")}
                </div>
            </div>
        `;
    };

    const { minDate, maxDate } = getMonthDateRange(
        loc.year || "",
        loc.month || ""
    );
    const dateInputBounds = activeView === "recurring" ? "" : `min="${minDate}" max="${maxDate}"`;

    let currentCreatedDate = "";
    if (project.created_at) {
        try {
            currentCreatedDate = new Date(project.created_at).toISOString().slice(0, 10);
        } catch {}
    }

    overlay.innerHTML = `
        <div class="atom-modal project-options-modal" role="dialog" aria-modal="true" aria-labelledby="project-options-title">
            <div class="atom-modal-header">
                <div>
                    <h2 id="project-options-title">${project.name}</h2>
                    <p>Manage project details and organization.</p>
                </div>
                <button
                    class="atom-modal-close"
                    id="close-project-options"
                    type="button"
                    aria-label="Close project options"
                >
                    ×
                </button>
            </div>
            <div class="atom-modal-body project-details-form">
                <div class="form-group">
                    <label for="edit-project-description">Project Description</label>
                    <textarea id="edit-project-description" rows="3" placeholder="Add a description for this project..."></textarea>
                </div>

                <div class="project-form-row">
                    <div class="form-group">
                        <label for="edit-project-status">Status</label>
                        <select id="edit-project-status" class="status-${project.status ?? "not-started"}">
                            ${PROJECT_STATUSES.map(status => `<option value="${status.value}" ${status.value === (project.status ?? "not-started") ? "selected" : ""}>${status.label}</option>`).join("")}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="edit-project-type">Project Type</label>
                        <select id="edit-project-type">
                            ${PROJECT_TYPES.map(type => `<option value="${type.value}" ${type.value === (project.project_type ?? "default") ? "selected" : ""}>${type.label}</option>`).join("")}
                        </select>
                    </div>
                </div>

                <div class="project-form-row">
                    <div class="form-group">
                        <label for="edit-project-deadline">Deadline</label>
                        <input id="edit-project-deadline" type="date" value="${project.deadline ?? ""}" />
                    </div>
                    <div class="form-group">
                        <label for="edit-project-created-date">${activeView === "recurring" ? "Date created" : `Date created (within ${loc.month})`}</label>
                        <input id="edit-project-created-date" type="date" value="${currentCreatedDate}" ${dateInputBounds} />
                    </div>
                </div>

                <div class="project-options-save-row">
                    <button id="save-project-details" class="atom-button primary">Save changes</button>
                </div>

                ${renderTagSection("label", "Labels", labels, tags.labelIds)}
                ${renderTagSection("person", "People", people, tags.personIds)}

                <div class="project-options-section rename-section">
                    <span class="project-options-label">Rename Project</span>
                    <div class="rename-project-row">
                        <input id="rename-project-input" type="text" autocomplete="off" />
                        <button id="save-project-rename" class="atom-button secondary">Rename</button>
                    </div>
                </div>

                <div class="project-danger-zone" id="project-danger-zone">
                    <span>Delete this project and all files inside it.</span>
                    <button id="start-project-delete" class="atom-button danger">Delete project</button>
                </div>
                <div class="form-error" id="project-options-error"></div>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const renameInput = overlay.querySelector(
        "#rename-project-input"
    ) as HTMLInputElement;

    renameInput.value = project.name;
    (overlay.querySelector("#edit-project-description") as HTMLTextAreaElement).value = project.description ?? "";

    const closeModal = () => overlay.remove();
    const refreshModal = async () => {
        closeModal();
        await showProjectOptions(loc.name, project?.path);
    };

    overlay.querySelector("#close-project-options")?.addEventListener(
        "click", closeModal
    );

    overlay.addEventListener("click", event => {
        if (event.target === overlay) closeModal();
    });

    const closePickers = () => {
        overlay.querySelectorAll<HTMLDivElement>(".project-option-picker").forEach(picker => {
            picker.classList.remove("visible");
        });
    };

    overlay.addEventListener("click", event => {
        const target = event.target as HTMLElement;
        if (!target.closest(".project-option-picker") && !target.closest(".project-option-add-button")) {
            closePickers();
        }
    });

    const refreshActiveView = async () => {
        if (activeView === "pinned") {
            await loadPinnedProjects();
        } else if (activeView === "recurring") {
            await loadRecurringProjects();
        } else {
            await loadProjects(yearSelect.value, monthSelect.value);
        }
    };

    const saveTags = async (nextTags: ProjectTags) => {
        if (loc.path) await window.electronAPI.setProjectTags(loc.path, nextTags);
        else await window.electronAPI.setProjectTags(loc.year, loc.month, loc.name, nextTags);
        await refreshModal();
        await loadProjectTags(loc.name);
    };

    overlay.querySelectorAll<HTMLButtonElement>(".project-option-add-button")
        .forEach(button => {
            button.addEventListener("click", () => {
                const type = button.dataset.pickerType;
                if (!type) return;

                const picker = overlay.querySelector<HTMLDivElement>(`.project-option-picker[data-picker-type="${type}"]`);
                if (!picker) return;
                picker.classList.toggle("visible");
            });
        });

    overlay.querySelectorAll<HTMLButtonElement>(".project-option-picker-option")
        .forEach(option => {
            option.addEventListener("click", () => {
                const tagId = option.dataset.tagId;
                const isLabel = option.dataset.tagType === "label";
                if (!tagId) return;

                saveTags({
                    labelIds: isLabel
                        ? [...tags.labelIds, tagId]
                        : tags.labelIds,
                    personIds: isLabel
                        ? tags.personIds
                        : [...tags.personIds, tagId]
                });
            });
        });

    overlay.querySelectorAll<HTMLButtonElement>(".project-option-tag")
        .forEach(tag => {
            tag.addEventListener("click", () => {
                const tagId = tag.dataset.projectTagId;
                const isLabel = tag.dataset.projectTagType === "label";

                if (!tagId) return;

                saveTags({
                    labelIds: isLabel
                        ? tags.labelIds.filter(id => id !== tagId)
                        : tags.labelIds,
                    personIds: isLabel
                        ? tags.personIds
                        : tags.personIds.filter(id => id !== tagId)
                });
            });
        });

    overlay.querySelector("#save-project-rename")?.addEventListener(
        "click",
        async () => {
            const error = overlay.querySelector(
                "#project-options-error"
            ) as HTMLElement;

            try {
                const nextName = loc.path
                    ? await window.electronAPI.renameProject(loc.path, renameInput.value)
                    : await window.electronAPI.renameProject(loc.year, loc.month, loc.name, renameInput.value);

                closeModal();
                await refreshActiveView();
                selectedProjectName = nextName;
                updateProjectWorkspace(nextName);
            } catch (err) {
                error.textContent = "The project could not be renamed. Choose a different name.";
            }
        }
    );

    overlay.querySelector("#save-project-details")?.addEventListener("click", async () => {
        const error = overlay.querySelector("#project-options-error") as HTMLElement;
        const createdDateInput = overlay.querySelector("#edit-project-created-date") as HTMLInputElement;
        const selectedCreatedDate = createdDateInput?.value;

        const dateChanged = selectedCreatedDate !== currentCreatedDate;
        if (dateChanged && activeView !== "recurring" && selectedCreatedDate && (selectedCreatedDate < minDate || selectedCreatedDate > maxDate)) {
            error.textContent = `Date created must be within ${loc.month} (${minDate} to ${maxDate}).`;
            return;
        }

        try {
            const details: ProjectUpdateDetails = {
                description: (overlay.querySelector("#edit-project-description") as HTMLTextAreaElement).value,
                status: (overlay.querySelector("#edit-project-status") as HTMLSelectElement).value as ProjectStatus,
                project_type: (overlay.querySelector("#edit-project-type") as HTMLSelectElement).value as ProjectType,
                deadline: (overlay.querySelector("#edit-project-deadline") as HTMLInputElement).value
            };

            if (dateChanged) {
                details.created_at = selectedCreatedDate ? new Date(`${selectedCreatedDate}T12:00:00.000Z`).toISOString() : undefined;
            }

            const updated = await window.electronAPI.updateProjectDetails(project.path, details);
            if (updated) {
                selectedProject = updated as RealProject;
                selectedProjectName = updated.name;
                updateProjectWorkspace(updated as RealProject);
            }
            closeModal();
            await refreshActiveView();
        } catch (err) {
            error.textContent = "Project details could not be saved.";
        }
    });

    overlay.querySelector("#start-project-delete")?.addEventListener(
        "click",
        () => {
            const dangerZone = overlay.querySelector(
                "#project-danger-zone"
            ) as HTMLElement;

            dangerZone.innerHTML = `
                <strong>This permanently deletes “${project.name}” and every file inside it.</strong>
                <div class="danger-confirm-actions">
                    <button id="cancel-project-delete" class="atom-button secondary">Cancel</button>
                    <button id="confirm-project-delete" class="atom-button danger">Delete permanently</button>
                </div>
            `;

            dangerZone.querySelector("#cancel-project-delete")?.addEventListener(
                "click",
                () => refreshModal()
            );

            dangerZone.querySelector("#confirm-project-delete")?.addEventListener(
                "click",
                async () => {
                    try {
                        if (loc.path) await window.electronAPI.deleteProject(loc.path);
                        else await window.electronAPI.deleteProject(loc.year, loc.month, loc.name);

                        closeModal();
                        await refreshActiveView();
                        clearWorkspace();
                    } catch (err) {
                        console.error("Failed to delete project:", err);
                        dangerZone.insertAdjacentHTML(
                            "beforeend",
                            `<div class="form-error">The project could not be deleted.</div>`
                        );
                    }
                }
            );
        }
    );

}

function getProjectCreationWeekGroups(projects: RealProject[]) {
    const months = new Map<string, { year: number; month: number; weeks: Map<number, RealProject[]> }>();
    const undated: RealProject[] = [];

    projects.forEach(project => {
        const createdAt = new Date(project.created_at);
        if (!project.created_at || !Number.isFinite(createdAt.getTime())) {
            undated.push(project);
            return;
        }
        const year = createdAt.getFullYear();
        const month = createdAt.getMonth();
        const day = createdAt.getDate();
        const firstSunday = 1 + ((7 - new Date(year, month, 1).getDay()) % 7);
        const week = day <= firstSunday ? 1 : 2 + Math.floor((day - firstSunday - 1) / 7);
        const monthKey = `${year}-${month}`;
        const monthGroup = months.get(monthKey) ?? { year, month, weeks: new Map<number, RealProject[]>() };
        const weekProjects = monthGroup.weeks.get(week) ?? [];
        weekProjects.push(project);
        monthGroup.weeks.set(week, weekProjects);
        months.set(monthKey, monthGroup);
    });

    return {
        months: [...months.values()]
            .sort((a, b) => b.year - a.year || b.month - a.month)
            .map(group => ({
                year: group.year,
                month: group.month,
                weeks: [...group.weeks.entries()]
                    .sort(([weekA], [weekB]) => weekB - weekA)
                    .map(([week, weekProjects]) => ({
                        week,
                        projects: weekProjects.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
                    })),
            })),
        undated: undated.sort((a, b) => a.name.localeCompare(b.name)),
    };
}

function renderProjectWeekHeader(week: number) {
    return `<div class="note-group-header project-week-header"><span>Week ${week}</span></div>`;
}

function renderProjectCard(project: RealProject) {
    const projectType = getProjectType(project.project_type);
    return `
        <div class="project-card ${project.name === selectedProjectName ? "selected" : ""}"
            data-project-name="${escapeHtmlAttribute(project.name)}"
            data-project-path="${escapeHtmlAttribute(project.path)}"
            data-project-deadline="${escapeHtmlAttribute(project.deadline ?? "")}">
            <span class="project-type-badge" style="--project-type-color: ${projectType.color}; --project-type-icon: url('${projectType.icon}')" aria-label="${projectType.label} project">
                <span class="project-type-icon"></span>
            </span>
            <div class="project-card-main">
                <div class="project-card-title">
                    <span class="project-card-date">${formatCardDate(project.created_at)}</span>
                    <h3>${escapeDashboardHtml(project.name)}</h3>
                </div>
                <select class="project-status-select status-${project.status ?? "not-started"}" aria-label="Project status">
                    ${PROJECT_STATUSES.map(status => `<option value="${status.value}" ${status.value === (project.status ?? "not-started") ? "selected" : ""}>${status.label}</option>`).join("")}
                </select>
            </div>
            <div class="project-card-actions">
                <div class="project-more-actions">
                    <button class="project-card-button project-more-button" type="button" title="Project options" aria-label="Project options" aria-expanded="false"><span aria-hidden="true">⋮</span></button>
                    <div class="project-action-menu" role="menu">
                        <button class="project-menu-item project-open-explorer-button" type="button" role="menuitem"><img src="${openPathIcon}" alt="" />Open Path</button>
                        <button class="project-menu-item project-copy-path-button" type="button" role="menuitem"><img src="${copyPathIcon}" alt="" />Copy Path</button>
                        <button class="project-menu-item project-pin-button" type="button" role="menuitem" data-pinned="${project.pinned ? "1" : ""}"><span class="project-menu-icon project-pin-icon" aria-hidden="true">📌</span>${project.pinned ? "Unpin Project" : "★ Pin Project"}</button>
                        <button class="project-menu-item project-edit-button" type="button" role="menuitem"><img class="project-edit-menu-icon" src="${editProjectIcon}" alt="" />Edit Project</button>
                    </div>
                </div>
            </div>
        </div>`;
}

function renderProjects(
    projects: RealProject[]
) {
    currentProjects = projects;

    if (!projectList)
        return;


    if (projects.length === 0) {

        projectList.innerHTML = `

            <div class="empty-state">

                ${activeView === "pinned" ? "No pinned projects yet.<br>Use the 📌 Pin Project option in a project's menu to pin it." : "No projects in this month"}

            </div>

        `;

        clearWorkspace();

        return;

    }


    if (activeView === "pinned" || activeView === "recurring") {
        const grouped = getProjectCreationWeekGroups(projects);
        const ordered = [...grouped.months.flatMap(month => month.weeks.flatMap(week => week.projects)), ...grouped.undated];
        projectList.innerHTML = `<div class="project-week-items">${ordered.map(renderProjectCard).join("")}</div>`;
        addProjectListeners();
        return;
    }

    const grouped = getProjectCreationWeekGroups(projects);
    projectList.innerHTML = grouped.months.map(month => `
        <section class="project-month-group">
            ${month.weeks.map(group => `
                <section class="project-week-group">
                    ${renderProjectWeekHeader(group.week)}
                    <div class="project-week-items">${group.projects.map(renderProjectCard).join("")}</div>
                </section>
            `).join("")}
        </section>
    `).join("") + (grouped.undated.length ? `
        <section class="project-week-group project-undated-group">
            <div class="note-group-header project-week-header"><span>Date unavailable</span></div>
            <div class="project-week-items">${grouped.undated.map(renderProjectCard).join("")}</div>
        </section>
    ` : "");


    addProjectListeners();

}


// ==========================
// PROJECT CLICK
// ==========================

function addProjectListeners() {

    const cards =
        document.querySelectorAll(".project-card");


    cards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const name =
                    card.getAttribute(
                        "data-project-name"
                    );
                const path =
                    card.getAttribute(
                        "data-project-path"
                    );


                if (!name)
                    return;


                const proj = currentProjects.find(p => (path && p.path === path) || p.name === name);
                if (proj) {
                    selectedProject = proj;
                    selectedProjectName = proj.name;
                    updateProjectWorkspace(proj);
                } else {
                    selectedProjectName = name;
                    updateProjectWorkspace(name);
                }


                document
                    .querySelectorAll(".project-card")
                    .forEach(otherCard => {

                        otherCard.classList.remove(
                            "selected"
                        );

                    });


                card.classList.add(
                    "selected"
                );

            }
        );

    });

    document.querySelectorAll<HTMLButtonElement>(".project-more-button")
        .forEach(button => {
            const card = button.closest(".project-card");
            const actionMenu = card?.querySelector<HTMLElement>(".project-action-menu");

            button.addEventListener("click", event => {
                event.stopPropagation();
                const willOpen = !actionMenu?.classList.contains("visible");
                closeFileActionMenu();
                closeProjectActionMenu();

                if (willOpen && actionMenu) {
                    actionMenu.classList.add("visible");
                    activeProjectActionMenu = actionMenu;
                }

                button.setAttribute("aria-expanded", String(willOpen));
            });
        });

    document.querySelectorAll<HTMLButtonElement>(".project-open-explorer-button")
        .forEach(button => {
            button.addEventListener("click", async event => {
                event.stopPropagation();
                closeProjectActionMenu();
                const card = button.closest(".project-card");
                const projectPath = card?.getAttribute("data-project-path");
                if (!projectPath) return;

                try {
                    await window.electronAPI.openProjectContent(projectPath, "");
                } catch (err) {
                    console.error("Open in Explorer failed:", err);
                    window.alert("Could not open the project folder in Explorer.");
                }
            });
        });

    document.querySelectorAll<HTMLButtonElement>(".project-copy-path-button")
        .forEach(button => {
            button.addEventListener("click", async event => {
                event.stopPropagation();
                closeProjectActionMenu();
                const card = button.closest(".project-card");
                const projectPath = card?.getAttribute("data-project-path");
                if (!projectPath) return;

                try {
                    const copyProjectPath = (window.electronAPI as Partial<typeof window.electronAPI>).copyProjectPath;
                    if (typeof copyProjectPath === "function") {
                        await copyProjectPath(projectPath);
                    } else if (navigator.clipboard?.writeText) {
                        await navigator.clipboard.writeText(projectPath);
                    } else {
                        const copyInput = document.createElement("textarea");
                        copyInput.value = projectPath;
                        copyInput.style.position = "fixed";
                        copyInput.style.opacity = "0";
                        document.body.appendChild(copyInput);
                        copyInput.select();
                        const copied = document.execCommand("copy");
                        copyInput.remove();
                        if (!copied) throw new Error("Clipboard access was unavailable.");
                    }

                    const originalLabel = button.textContent;
                    button.lastChild!.textContent = "Copied Path";
                    window.setTimeout(() => {
                        button.lastChild!.textContent = originalLabel?.trim() || "Copy Path";
                    }, 1200);
                } catch (err) {
                    console.error("Copy project path failed:", err);
                    window.alert("Could not copy the project path.");
                }
            });
        });

    document.querySelectorAll<HTMLButtonElement>(".project-edit-button")
        .forEach(button => {
            button.addEventListener("click", event => {
                event.stopPropagation();
                closeProjectActionMenu();
                const card = button.closest(".project-card");
                const projectName = card?.getAttribute("data-project-name");
                const projectPath = card?.getAttribute("data-project-path");
                if (projectName) showProjectOptions(projectName, projectPath || undefined);
            });
        });

    document.querySelectorAll<HTMLButtonElement>(".project-pin-button")
        .forEach(button => {
            button.addEventListener("click", async event => {
                event.stopPropagation();
                closeProjectActionMenu();
                const card = button.closest(".project-card");
                const projectPath = card?.getAttribute("data-project-path");
                if (!projectPath) return;
                try {
                    await window.electronAPI.toggleProjectPinByPath(projectPath);
                    // Refresh whichever list is currently showing
                    if (activeView === "pinned") {
                        await loadPinnedProjects();
                    } else if (activeView === "recurring") {
                        await loadRecurringProjects();
                    } else {
                        await loadProjects(yearSelect.value, monthSelect.value);
                    }
                } catch (err) {
                    console.error("Failed to toggle pin:", err);
                }
            });
        });

    document.querySelectorAll<HTMLSelectElement>(".project-status-select")
        .forEach(select => {
            select.addEventListener("click", event => event.stopPropagation());
            select.addEventListener("change", async event => {
                event.stopPropagation();
                const card = select.closest(".project-card");
                const projectName = card?.getAttribute("data-project-name");
                const projectPath = card?.getAttribute("data-project-path");
                if (!projectName) return;
                const currentStatus = select.value as ProjectStatus;
                const proj = currentProjects.find(p => (projectPath && p.path === projectPath) || p.name === projectName);
                if (!projectPath) return;
                await window.electronAPI.updateProjectDetails(projectPath, {
                    description: proj?.description || "",
                    status: currentStatus,
                    project_type: proj?.project_type ?? "default",
                    deadline: card?.getAttribute("data-project-deadline") ?? (proj?.deadline ?? "")
                });
                selectedProjectName = projectName;
                if (activeView === "pinned") {
                    await loadPinnedProjects();
                } else if (activeView === "recurring") {
                    await loadRecurringProjects();
                } else {
                    await loadProjects(yearSelect.value, monthSelect.value);
                }
            });
        });

}


// ==========================
// CREATE PROJECT MODAL
// ==========================

async function showCreateProjectModal() {

    const availableTemplates = await window.electronAPI.getProjectTemplates();

    const overlay =
        document.createElement("div");

    overlay.className =
        "atom-modal-overlay";

    const { minDate: newMinDate, maxDate: newMaxDate } = getMonthDateRange(
        yearSelect.value || "",
        monthSelect.value || ""
    );

    const nowIso = new Date().toISOString().slice(0, 10);
    const defaultNewCreatedDate = activeProjectFolderTab || (nowIso >= newMinDate && nowIso <= newMaxDate) ? nowIso : newMinDate;

    overlay.innerHTML = `
        <div class="atom-modal create-project-modal">
            <div class="atom-modal-header">
                <div>
                    <h2>Create Project</h2>
                    <p>Enter project details to get started</p>
                </div>
                <button
                    class="atom-modal-close"
                    id="close-create-project"
                >
                    ×
                </button>
            </div>

            <div class="atom-modal-body project-details-form">
                <div class="form-group">
                    <label for="project-name-input">Project Name</label>
                    <input
                        id="project-name-input"
                        type="text"
                        placeholder="Enter project name"
                        autocomplete="off"
                    />
                    <div
                        id="create-project-error"
                        class="form-error"
                    ></div>
                </div>

                <div class="form-group">
                    <label for="project-description-input">Project description</label>
                    <textarea id="project-description-input" rows="3" maxlength="500" placeholder="Briefly describe this project"></textarea>
                </div>

                <div class="project-form-row">
                    <div class="form-group">
                        <label for="project-status-input">Status</label>
                        <select id="project-status-input">
                            ${PROJECT_STATUSES.map(status => `<option value="${status.value}">${status.label}</option>`).join("")}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="project-type-input">Project Type</label>
                        <select id="project-type-input">
                            ${PROJECT_TYPES.map(type => `<option value="${type.value}" ${type.value === "default" ? "selected" : ""}>${type.label}</option>`).join("")}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="project-created-date-input">Date created</label>
                        <input id="project-created-date-input" type="date" ${activeProjectFolderTab ? "" : `min="${newMinDate}" max="${newMaxDate}"`} value="${defaultNewCreatedDate}" />
                    </div>
                </div>

                <div class="form-group">
                    <label for="project-template-input">Template</label>
                    <select id="project-template-input"><option value="">No Template</option>${availableTemplates.map(template => `<option value="${template.id}">${escapeDashboardHtml(template.name)}</option>`).join("")}</select>
                </div>

                <div class="project-form-row">
                    <div class="form-group">
                        <label for="project-deadline-input">Deadline</label>
                        <input id="project-deadline-input" type="date" />
                    </div>
                </div>

                <div class="project-location">
                    <span>
                        Location
                    </span>
                    <strong>
                        ${activeProjectFolderTab ? escapeDashboardHtml(activeProjectFolderTab.name) : `${yearSelect.value} / ${monthSelect.value}`}
                    </strong>
                </div>
            </div>

            <div class="atom-modal-footer">
                <button
                    id="cancel-create-project"
                    class="atom-button secondary"
                >
                    Cancel
                </button>
                <button
                    id="confirm-create-project"
                    class="atom-button primary"
                >
                    Create Project
                </button>
            </div>
        </div>
    `;


    document.body.appendChild(overlay);

    if (activeProjectFolderTab) {
        overlay.querySelector("#project-created-date-input")?.closest(".form-group")?.remove();
    }


    const input =
        overlay.querySelector(
            "#project-name-input"
        ) as HTMLInputElement;


    const error =
        overlay.querySelector(
            "#create-project-error"
        ) as HTMLElement;

    const descriptionInput = overlay.querySelector("#project-description-input") as HTMLTextAreaElement;
    const statusInput = overlay.querySelector("#project-status-input") as HTMLSelectElement;
    const projectTypeInput = overlay.querySelector("#project-type-input") as HTMLSelectElement;
    const deadlineInput = overlay.querySelector("#project-deadline-input") as HTMLInputElement;
    const templateInput = overlay.querySelector("#project-template-input") as HTMLSelectElement;

    templateInput.addEventListener("change", () => {
        const template = availableTemplates.find(item => item.id === templateInput.value);
        if (template) projectTypeInput.value = template.project_type;
    });


    const closeModal = () => {

        overlay.remove();

    };


    overlay
        .querySelector(
            "#close-create-project"
        )
        ?.addEventListener(
            "click",
            closeModal
        );


    overlay
        .querySelector(
            "#cancel-create-project"
        )
        ?.addEventListener(
            "click",
            closeModal
        );


    overlay.addEventListener(
        "click",
        event => {

            if (
                event.target === overlay
            ) {

                closeModal();

            }

        }
    );


    const createButton =
        overlay.querySelector(
            "#confirm-create-project"
        ) as HTMLButtonElement;


    createButton.addEventListener(
        "click",
        async () => {

            const projectName =
                input.value.trim();


            if (!projectName) {

                error.textContent =
                    "Please enter a project name.";

                input.focus();

                return;

            }


            createButton.disabled = true;

            createButton.textContent =
                "Creating...";

            const createdDateInput = overlay.querySelector("#project-created-date-input") as HTMLInputElement;
            const selectedCreatedDate = createdDateInput?.value;

            if (!activeProjectFolderTab && selectedCreatedDate && (selectedCreatedDate < newMinDate || selectedCreatedDate > newMaxDate)) {
                error.textContent = `Date created must be within ${monthSelect.value} (${newMinDate} to ${newMaxDate}).`;
                createButton.disabled = false;
                createButton.textContent = "Create Project";
                return;
            }

            try {

                const details = {
                        description: descriptionInput.value,
                        status: statusInput.value as ProjectStatus,
                        project_type: projectTypeInput.value as ProjectType,
                        deadline: deadlineInput.value,
                        templateId: templateInput.value || null,
                        created_at: selectedCreatedDate ? new Date(`${selectedCreatedDate}T12:00:00.000Z`).toISOString() : undefined
                    };
                const created = activeProjectFolderTab
                    ? await window.electronAPI.createProjectInFolderTab(activeProjectFolderTab.path, projectName, details)
                    : await window.electronAPI.createProject(

                    yearSelect.value,

                    monthSelect.value,

                    projectName,
                    details

                );

                if (created.templateWarning) window.alert(created.templateWarning);


                closeModal();


                if (activeProjectFolderTab && activeView === "recurring") await loadRecurringProjects();
                else if (activeProjectFolderTab) renderProjects(await window.electronAPI.getProjectsInFolderTab(activeProjectFolderTab.path));
                else await loadProjects(

                    yearSelect.value,

                    monthSelect.value

                );


            } catch (err) {

                console.error(
                    "Failed to create project:",
                    err
                );


                error.textContent =
                    "A project with this name may already exist.";

                createButton.disabled = false;

                createButton.textContent =
                    "Create Project";

            }

        }
    );


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                createButton.click();

            }


            if (
                event.key === "Escape"
            ) {

                closeModal();

            }

        }
    );


    requestAnimationFrame(() => {

        input.focus();

    });

}


// ==========================
// SETTINGS MODAL
// ==========================

function secondsToTargetInput(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function targetInputToSeconds(value: string): number {
    const [hours, minutes] = value.split(":").map(Number);
    return Number.isInteger(hours) && Number.isInteger(minutes) && hours >= 0 && minutes >= 0 && minutes < 60
        ? (hours * 60 + minutes) * 60
        : 0;
}

async function updateSettingsAdjacentPanels() {
    const settingsList = document.getElementById("settings-explorer-view");
    const standardExplorer = document.getElementById("standard-explorer-view");
    const standardWorkspace = document.getElementById("standard-workspace-view");
    const templatesExplorer = document.getElementById("templates-explorer-view");
    const templatesWorkspace = document.getElementById("templates-workspace-view");
    const settingsWorkspace = document.getElementById("settings-workspace-view");
    const directoryWorkspace = document.getElementById("directory-settings-workspace");
    const labels = activeView === "settings" && (selectedSettingsSection === "labels" || selectedSettingsSection === "people");
    const templates = activeView === "settings" && selectedSettingsSection === "people-templates";
    if (activeView !== "settings") return;
    document.querySelector<HTMLElement>(".project-explorer")?.classList.toggle("settings-adjacent", labels || templates);
    const show = (element: HTMLElement | null, visible: boolean) => {
        if (!element) return;
        element.style.display = visible ? "flex" : "none";
        element.hidden = !visible;
        element.classList.toggle("active", visible);
    };
    show(standardExplorer, labels);
    show(standardWorkspace, false);
    show(directoryWorkspace, labels);
    show(templatesExplorer, templates);
    show(templatesWorkspace, templates);
    show(settingsWorkspace, !labels && !templates);
    if (labels) {
        const isPeople = selectedSettingsSection === "people";
        if (panelTitle) panelTitle.textContent = isPeople ? "People" : "Labels";
        if (createProjectButton) {
            createProjectButton.textContent = isPeople ? "+ Create People" : "+ Create Labels";
            createProjectButton.style.display = "block";
        }
        if (dateSelector) dateSelector.style.display = "flex";
        if (yearSelect) yearSelect.style.display = "none";
        if (monthSelect) monthSelect.style.display = "none";
        if (fileViewControls) fileViewControls.style.display = "none";
        clearDirectoryWorkspace();
        await loadDirectoryItems();
    } else if (templates) {
        if (createProjectButton) createProjectButton.style.display = "none";
        if (dateSelector) dateSelector.style.display = "none";
        if (fileViewControls) fileViewControls.style.display = "none";
        const templatesHeading = templatesExplorer?.querySelector<HTMLElement>(".templates-explorer-header h2");
        if (templatesHeading) templatesHeading.textContent = "Project Templates";
        await loadProjectTemplates();
    }
}

async function renderSettingsPage() {
    const host = document.getElementById("settings-workspace-view");
    const settingsList = document.getElementById("settings-section-list");
    if (!host) return;
    const currentSettings = await window.electronAPI.getSettings();
    settingsDraft ??= { ...currentSettings, quotes: [...currentSettings.quotes] };
    const sections = [
        { id: "folders", label: "Project Folders", icon: '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H10l2 2h7.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/><path d="M3 9h18"/>' },
        { id: "appearance", label: "Appearance", icon: '<path d="M12 3a9 9 0 1 0 0 18h1.2a2 2 0 0 0 1.4-3.4 1.7 1.7 0 0 1 1.2-2.9H18a3 3 0 0 0 3-3c0-4.8-4-8.7-9-8.7Z"/><circle cx="7.5" cy="10" r=".8"/><circle cx="11" cy="7" r=".8"/><circle cx="16" cy="8" r=".8"/>' },
        { id: "attendance", label: "Attendance", icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>' },
        { id: "quotes", label: "Quotes", icon: '<path d="M4 7h7v6H6l-2 4V7Zm10 0h7v6h-5l-2 4V7Z"/>' },
        { id: "people", label: "People", icon: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>' },
        { id: "labels", label: "Labels", icon: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r=".8"/>' },
        { id: "people-templates", label: "Project Templates", icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>' }
    ] as const;

    if (settingsList) {
        settingsList.innerHTML = sections.map(section => `
            <button class="settings-section-item ${section.id === selectedSettingsSection ? "selected" : ""}" type="button" data-settings-section="${section.id}">
                <svg class="settings-section-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${section.icon}</svg>
                <span>${section.label}</span>
            </button>
        `).join("");
        settingsList.querySelectorAll<HTMLButtonElement>(".settings-section-item").forEach(button => {
            button.addEventListener("click", () => {
                settingsDraft = {
                    ...settingsDraft!,
                    projectsRoot: host.querySelector<HTMLInputElement>("#settings-projects-root")?.value ?? settingsDraft!.projectsRoot,
                    recurringProjectsRoot: host.querySelector<HTMLInputElement>("#settings-recurring-root")?.value ?? settingsDraft!.recurringProjectsRoot,
                    accentColor: host.querySelector<HTMLInputElement>("#settings-accent")?.value ?? settingsDraft!.accentColor,
                    userName: host.querySelector<HTMLInputElement>("#settings-user-name")?.value ?? settingsDraft!.userName,
                    quotes: host.querySelector<HTMLTextAreaElement>("#settings-quotes")?.value.split(/\r?\n/).map(value => value.trim()).filter(Boolean) ?? settingsDraft!.quotes,
                    targetAttendanceSeconds: host.querySelector<HTMLInputElement>("#settings-full-target")?.value ? targetInputToSeconds(host.querySelector<HTMLInputElement>("#settings-full-target")!.value) : settingsDraft!.targetAttendanceSeconds,
                    halfDayTargetSeconds: host.querySelector<HTMLInputElement>("#settings-half-target")?.value ? targetInputToSeconds(host.querySelector<HTMLInputElement>("#settings-half-target")!.value) : settingsDraft!.halfDayTargetSeconds,
                };
                selectedSettingsSection = button.dataset.settingsSection as typeof selectedSettingsSection;
                void renderSettingsPage();
                void updateSettingsAdjacentPanels();
            });
        });
    }

    const renderSection = () => {
        const settingsHeading = sections.find(section => section.id === selectedSettingsSection)?.label ?? "Project Folders";
        const sectionBody = selectedSettingsSection === "labels" || selectedSettingsSection === "people" || selectedSettingsSection === "people-templates" ? `
            <div class="settings-panel-header"><h2>${settingsHeading}</h2></div>
            <p class="settings-section-hint">${selectedSettingsSection === "labels" ? "Manage your labels in the adjacent panel." : selectedSettingsSection === "people" ? "Manage your people in the adjacent panel." : "Manage your project templates in the adjacent panel."}</p>
        ` : selectedSettingsSection === "folders" ? `
            <div class="settings-panel-header"><h2>${settingsHeading}</h2></div>
            <div class="settings-form-stack">
                <div class="form-group"><label for="settings-projects-root">Main projects folder</label><div class="path-picker"><input id="settings-projects-root" type="text" readonly><button id="settings-browse-projects" class="atom-button secondary" type="button">Browse…</button></div><div class="form-error" id="settings-projects-error"></div></div>
                <div class="form-group"><label for="settings-recurring-root">Recurring projects folder</label><div class="path-picker"><input id="settings-recurring-root" type="text" readonly><button id="settings-browse-recurring" class="atom-button secondary" type="button">Browse…</button></div><div class="form-error" id="settings-recurring-error"></div></div>
            </div>
        ` : selectedSettingsSection === "appearance" ? `
            <div class="settings-panel-header"><h2>${settingsHeading}</h2></div>
            <div class="settings-form-stack">
                <div class="form-group"><label for="settings-accent">Main accent color</label><input id="settings-accent" type="color"></div>
            </div>
        ` : selectedSettingsSection === "attendance" ? `
            <div class="settings-panel-header"><h2>${settingsHeading}</h2></div>
            <div class="settings-form-stack">
                <div class="form-group"><label for="settings-full-target">Full-day target</label><input id="settings-full-target" type="time" step="60"></div>
                <div class="form-group"><label for="settings-half-target">Half-day target</label><input id="settings-half-target" type="time" step="60"></div>
                <div class="form-group"><label for="settings-user-name">User name</label><input id="settings-user-name" type="text" placeholder="Your name"></div>
            </div>
        ` : `
            <div class="settings-panel-header"><h2>${settingsHeading}</h2></div>
            <div class="settings-form-stack">
                <div class="form-group"><label for="settings-quotes">Quotes</label><textarea id="settings-quotes" rows="8" placeholder="One quote per line"></textarea></div>
            </div>
        `;

        host.innerHTML = `<div class="settings-page"><div class="settings-content-panel">${sectionBody}${selectedSettingsSection === "labels" || selectedSettingsSection === "people" || selectedSettingsSection === "people-templates" ? "" : '<div class="settings-page-actions"><span id="settings-save-status" aria-live="polite"></span><button id="settings-save" type="button" class="atom-button primary">Save changes</button></div>'}</div></div>`;

        const rootInput = host.querySelector<HTMLInputElement>("#settings-projects-root");
        const recurringInput = host.querySelector<HTMLInputElement>("#settings-recurring-root");
        const accentInput = host.querySelector<HTMLInputElement>("#settings-accent");
        const fullTargetInput = host.querySelector<HTMLInputElement>("#settings-full-target");
        const halfTargetInput = host.querySelector<HTMLInputElement>("#settings-half-target");
        const userNameInput = host.querySelector<HTMLInputElement>("#settings-user-name");
        const quotesInput = host.querySelector<HTMLTextAreaElement>("#settings-quotes");

        if (rootInput) rootInput.value = settingsDraft!.projectsRoot;
        if (recurringInput) recurringInput.value = settingsDraft!.recurringProjectsRoot;
        if (accentInput) accentInput.value = settingsDraft!.accentColor;
        if (fullTargetInput) fullTargetInput.value = secondsToTargetInput(settingsDraft!.targetAttendanceSeconds);
        if (halfTargetInput) halfTargetInput.value = secondsToTargetInput(settingsDraft!.halfDayTargetSeconds);
        if (userNameInput) userNameInput.value = settingsDraft!.userName;
        if (quotesInput) quotesInput.value = settingsDraft!.quotes.join("\n");

        host.querySelector("#settings-browse-projects")?.addEventListener("click", async () => {
            const root = await window.electronAPI.chooseProjectsRoot();
            if (root) { rootInput!.value = root; host.querySelector<HTMLElement>("#settings-projects-error")!.textContent = ""; }
        });
        host.querySelector("#settings-browse-recurring")?.addEventListener("click", async () => {
            const root = await window.electronAPI.chooseRecurringProjectsRoot();
            if (root) { recurringInput!.value = root; host.querySelector<HTMLElement>("#settings-recurring-error")!.textContent = ""; }
        });
        host.querySelector<HTMLButtonElement>("#settings-save")?.addEventListener("click", async event => {
            const button = event.currentTarget as HTMLButtonElement;
            const status = host.querySelector<HTMLElement>("#settings-save-status")!;
            const parseTarget = (value: string) => {
                const [hours, minutes] = value.split(":").map(Number);
                return Number.isInteger(hours) && Number.isInteger(minutes) && hours >= 0 && minutes >= 0 && minutes < 60 ? (hours * 60 + minutes) * 60 : 0;
            };
            const fullTarget = fullTargetInput ? parseTarget(fullTargetInput.value) : settingsDraft!.targetAttendanceSeconds;
            const halfTarget = halfTargetInput ? parseTarget(halfTargetInput.value) : settingsDraft!.halfDayTargetSeconds;
            if (selectedSettingsSection === "attendance" && (!fullTarget || !halfTarget)) { status.textContent = "Enter valid, non-zero full-day and half-day targets."; return; }
            button.disabled = true;
            status.textContent = "Saving…";
            try {
                if (rootInput) await window.electronAPI.setProjectsRoot(rootInput.value);
                if (recurringInput) await window.electronAPI.setRecurringProjectsRoot(recurringInput.value);
                const accent = accentInput ? await window.electronAPI.setAccentColor(accentInput.value) : settingsDraft!.accentColor;
                if (selectedSettingsSection === "attendance" || selectedSettingsSection === "quotes") {
                    await window.electronAPI.setAttendancePreferences({
                        userName: userNameInput ? userNameInput.value : settingsDraft!.userName,
                        quotes: quotesInput ? quotesInput.value.split(/\r?\n/).map(quote => quote.trim()).filter(Boolean) : settingsDraft!.quotes,
                        targetAttendanceSeconds: fullTarget || settingsDraft!.targetAttendanceSeconds,
                        halfDayTargetSeconds: halfTarget || settingsDraft!.halfDayTargetSeconds,
                    });
                }
                document.documentElement.style.setProperty("--accent-color", accent);
                settingsDraft = {
                    ...settingsDraft!,
                    ...(rootInput ? { projectsRoot: rootInput.value } : {}),
                    ...(recurringInput ? { recurringProjectsRoot: recurringInput.value } : {}),
                    ...(accentInput ? { accentColor: accentInput.value } : {}),
                    ...(userNameInput ? { userName: userNameInput.value } : {}),
                    ...(quotesInput ? { quotes: quotesInput.value.split(/\r?\n/).map(quote => quote.trim()).filter(Boolean) } : {}),
                    ...(selectedSettingsSection === "attendance" ? { targetAttendanceSeconds: fullTarget, halfDayTargetSeconds: halfTarget } : {}),
                };
                status.textContent = "Settings saved.";
            } catch (error) {
                console.error("Failed to save Settings:", error);
                status.textContent = error instanceof Error ? error.message : "Settings could not be saved.";
            } finally { button.disabled = false; }
        });
    };

    renderSection();
}

let projectTemplates: ProjectTemplateMetadata[] = [];
let selectedTemplateId: string | null = null;
let isCreatingTemplate = false;

async function loadProjectTemplates() {
    const host = document.getElementById("templates-workspace-view");
    const templatesList = document.getElementById("templates-list");
    if (!host || !templatesList) return;
    projectTemplates = await window.electronAPI.getProjectTemplates();
    if (!selectedTemplateId || !projectTemplates.some(template => template.id === selectedTemplateId)) selectedTemplateId = projectTemplates[0]?.id ?? null;
    templatesList.innerHTML = `${projectTemplates.length ? projectTemplates.map(template => `<button class="template-list-item ${template.id === selectedTemplateId ? "selected" : ""}" type="button" data-template-id="${template.id}"><strong>${escapeDashboardHtml(template.name)}</strong><small>${escapeDashboardHtml(getProjectType(template.project_type).label)}</small></button>`).join("") : '<div class="template-empty-state"><strong>No templates yet</strong><span>Create a template to get started.</span></div>'}`;
    templatesList.querySelectorAll<HTMLButtonElement>(".template-list-item").forEach(button => button.addEventListener("click", () => {
        selectedTemplateId = button.dataset.templateId || null;
        isCreatingTemplate = false;
        void renderTemplateWorkspace(projectTemplates.find(template => template.id === selectedTemplateId));
        templatesList.querySelectorAll(".template-list-item").forEach(item => item.classList.toggle("selected", item === button));
    }));
    if (!isCreatingTemplate) await renderTemplateWorkspace(projectTemplates.find(template => template.id === selectedTemplateId));
}

async function renderTemplateWorkspace(template?: ProjectTemplateMetadata) {
    const host = document.getElementById("templates-workspace-view");
    if (!host) return;
    if (!template && !isCreatingTemplate) {
        host.innerHTML = "";
        return;
    }
    host.innerHTML = `<div class="template-editor-page"><header class="settings-panel-header"><div><h2>${template ? "Edit Template" : "New Template"}</h2><p>Reusable project details and an optional source file.</p></div></header>
        <form id="template-form" class="template-form">
            <div class="settings-form-stack">
                <div class="form-group"><label for="template-name">Template name</label><input id="template-name" type="text" required maxlength="120" placeholder="Social Media Campaign"></div>
                <div class="form-group"><label for="template-project-type">Project type</label><select id="template-project-type">${PROJECT_TYPES.map(type => `<option value="${type.value}">${type.label}</option>`).join("")}</select></div>
                <div class="form-group"><label for="template-description">Description</label><textarea id="template-description" rows="4" maxlength="500" placeholder="What is this template used for?"></textarea></div>
                <div class="form-group"><label>Template file</label><div class="template-file-picker"><span id="template-file-path">${escapeDashboardHtml(template?.source_file_path || "No file selected")}</span><div class="template-file-actions"><button id="template-choose-file" class="atom-button secondary" type="button">Select file</button><button id="template-clear-file" class="atom-button secondary" type="button">Clear</button></div></div></div>
            </div>
            <div class="form-error" id="template-form-error" aria-live="polite"></div>
            <div class="template-form-actions">${template ? '<button id="template-delete" type="button" class="atom-button danger">Delete template</button>' : ""}<button type="submit" class="atom-button primary">${template ? "Save changes" : "Create template"}</button></div>
        </form></div>`;
    const nameInput = host.querySelector<HTMLInputElement>("#template-name")!;
    const typeInput = host.querySelector<HTMLSelectElement>("#template-project-type")!;
    const descriptionInput = host.querySelector<HTMLTextAreaElement>("#template-description")!;
    const filePathLabel = host.querySelector<HTMLElement>("#template-file-path")!;
    let sourcePath = template?.source_file_path || null;
    nameInput.value = template?.name || "";
    typeInput.value = template?.project_type || "default";
    descriptionInput.value = template?.description || "";
    host.querySelector("#template-choose-file")?.addEventListener("click", async () => {
        const chosen = await window.electronAPI.chooseTemplateFile();
        if (chosen) { sourcePath = chosen; filePathLabel.textContent = chosen; }
    });
    host.querySelector("#template-clear-file")?.addEventListener("click", () => { sourcePath = null; filePathLabel.textContent = "No file selected"; });
    host.querySelector("#template-delete")?.addEventListener("click", async () => {
        if (!template || !window.confirm(`Delete template “${template.name}”?`)) return;
        await window.electronAPI.deleteProjectTemplate(template.id);
        selectedTemplateId = null;
        isCreatingTemplate = false;
        await loadProjectTemplates();
    });
    host.querySelector("#template-form")?.addEventListener("submit", async event => {
        event.preventDefault();
        const error = host.querySelector<HTMLElement>("#template-form-error")!;
        try {
            const saved = await window.electronAPI.saveProjectTemplate({
                ...(template ? { id: template.id } : {}),
                name: nameInput.value.trim(),
                project_type: typeInput.value as ProjectType,
                description: descriptionInput.value.trim(),
                source_file_path: sourcePath,
            });
            selectedTemplateId = saved.id;
            isCreatingTemplate = false;
            await loadProjectTemplates();
        } catch (saveError) { error.textContent = saveError instanceof Error ? saveError.message : "Template could not be saved."; }
    });
}

async function showSettingsModal() {
    const currentSettings = await window.electronAPI.getSettings();

    const overlay =
        document.createElement("div");

    overlay.className =
        "atom-modal-overlay";

    overlay.innerHTML = `

        <div class="atom-modal">
            <div class="atom-modal-header">
                <div>
                    <h2>Settings</h2>
                    <p>Configure project folders and the application accent.</p>
                </div>
                <button class="atom-modal-close" id="close-settings">×</button>
            </div>

            <div class="atom-modal-body">
                <div class="form-group">
                    <label for="projects-root-input">Main projects folder</label>
                    <div class="path-picker">
                        <input id="projects-root-input" type="text" readonly />
                        <button id="browse-projects-root" class="atom-button secondary">Browse…</button>
                    </div>
                    <div id="projects-root-error" class="form-error"></div>
                </div>
                <div class="form-group">
                    <label for="recurring-projects-root-input">Recurring projects folder</label>
                    <div class="path-picker">
                        <input id="recurring-projects-root-input" type="text" readonly />
                        <button id="browse-recurring-projects-root" class="atom-button secondary">Browse…</button>
                    </div>
                    <div id="recurring-projects-root-error" class="form-error"></div>
                </div>
                <div class="form-group">
                    <label for="accent-color-input">Main accent color</label>
                    <input id="accent-color-input" type="color" />
                </div>
                <div class="form-group">
                    <label for="attendance-user-name-input">User Name</label>
                    <input id="attendance-user-name-input" type="text" placeholder="Your name" />
                </div>
                <div class="form-group">
                    <label for="attendance-quotes-input">Quotes</label>
                    <textarea id="attendance-quotes-input" rows="4" placeholder="One quote per line"></textarea>
                </div>
                <div class="form-group">
                    <label for="attendance-target-input">Target Attendance Time</label>
                    <input id="attendance-target-input" type="time" step="60" />
                </div>
            </div>

            <div class="atom-modal-footer">
                <button id="cancel-settings" class="atom-button secondary">Cancel</button>
                <button id="save-settings" class="atom-button primary">Save changes</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector(
        "#projects-root-input"
    ) as HTMLInputElement;

    input.value = currentSettings.projectsRoot;
    const recurringInput = overlay.querySelector("#recurring-projects-root-input") as HTMLInputElement;
    recurringInput.value = currentSettings.recurringProjectsRoot;
    const accentInput = overlay.querySelector("#accent-color-input") as HTMLInputElement;
    accentInput.value = currentSettings.accentColor;
    const userNameInput = overlay.querySelector("#attendance-user-name-input") as HTMLInputElement;
    userNameInput.value = currentSettings.userName;
    const quotesInput = overlay.querySelector("#attendance-quotes-input") as HTMLTextAreaElement;
    quotesInput.value = currentSettings.quotes.join("\n");
    const targetInput = overlay.querySelector("#attendance-target-input") as HTMLInputElement;
    const targetHours = Math.floor(currentSettings.targetAttendanceSeconds / 3600);
    const targetMinutes = Math.floor(currentSettings.targetAttendanceSeconds % 3600 / 60);
    targetInput.value = `${String(targetHours).padStart(2, "0")}:${String(targetMinutes).padStart(2, "0")}`;

    const error = overlay.querySelector(
        "#projects-root-error"
    ) as HTMLElement;
    const recurringError = overlay.querySelector("#recurring-projects-root-error") as HTMLElement;

    const closeModal = () => overlay.remove();

    overlay.querySelector("#close-settings")?.addEventListener(
        "click", closeModal
    );

    overlay.querySelector("#cancel-settings")?.addEventListener(
        "click", closeModal
    );

    overlay.addEventListener("click", event => {
        if (event.target === overlay) closeModal();
    });

    overlay.querySelector("#browse-projects-root")?.addEventListener(
        "click",
        async () => {
            const selectedRoot =
                await window.electronAPI.chooseProjectsRoot();

            if (selectedRoot) {
                input.value = selectedRoot;
                error.textContent = "";
            }
        }
    );

    overlay.querySelector("#browse-recurring-projects-root")?.addEventListener("click", async () => {
        const selectedRoot = await window.electronAPI.chooseRecurringProjectsRoot();
        if (selectedRoot) {
            recurringInput.value = selectedRoot;
            recurringError.textContent = "";
        }
    });

    const saveButton = overlay.querySelector(
        "#save-settings"
    ) as HTMLButtonElement;

    saveButton.addEventListener("click", async () => {
        if (!input.value) {
            error.textContent = "Choose a projects folder first.";
            return;
        }

        saveButton.disabled = true;
        saveButton.textContent = "Saving...";

        try {
            await window.electronAPI.setProjectsRoot(input.value);
            await window.electronAPI.setRecurringProjectsRoot(recurringInput.value);
            const savedAccent = await window.electronAPI.setAccentColor(accentInput.value);
            const [targetHour, targetMinute] = targetInput.value.split(":").map(Number);
            await window.electronAPI.setAttendancePreferences({
                userName: userNameInput.value,
                quotes: quotesInput.value.split(/\r?\n/).map(quote => quote.trim()).filter(Boolean),
                targetAttendanceSeconds: (targetHour * 60 + targetMinute) * 60,
                halfDayTargetSeconds: currentSettings.halfDayTargetSeconds,
            });
            document.documentElement.style.setProperty("--accent-color", savedAccent);
            closeModal();
            await loadYears();
        } catch (err) {
            console.error("Failed to update projects folder:", err);
            error.textContent = "That folder could not be used.";
            recurringError.textContent = "That folder could not be used.";
            saveButton.disabled = false;
            saveButton.textContent = "Save changes";
        }
    });

}


// ==========================
// CREATE PROJECT BUTTON
// ==========================

createProjectButton?.addEventListener(
    "click",
    () => {

        if (activeView === "labels" || activeView === "people" || (activeView === "settings" && (selectedSettingsSection === "labels" || selectedSettingsSection === "people"))) {
            showDirectoryItemForm();
            return;
        }

        if (activeView === "templates") {
            selectedTemplateId = null;
            isCreatingTemplate = true;
            void renderTemplateWorkspace();
            return;
        }

        if (activeView !== "projects" && activeView !== "recurring") return;

        if (!activeProjectFolderTab && (
            !yearSelect.value ||
            !monthSelect.value
        )) {

            return;

        }


        showCreateProjectModal();

    }
);

document.getElementById("create-template-button")?.addEventListener("click", () => {
    selectedTemplateId = null;
    isCreatingTemplate = true;
    void renderTemplateWorkspace();
});

createNoteButton?.addEventListener(
    "click",
    () => {
        const activeProjectName = selectedProject?.name || selectedProjectName;
        if (!activeProjectName) {
            window.alert("Select a project before creating a new note.");
            return;
        }

        void createOrOpenNewNote();
    }
);

navigationItems.forEach(item => {
    item.addEventListener("click", () => {
        const view = item.dataset.view as
            "projects" | "labels" | "people" | "templates" | "settings" | "dashboard" | "attendance" | "pinned" | "recurring" | "notes";

        if (view) {
            if (view === "projects") activeProjectFolderTab = null;
            switchView(view);
        }
    });
});


// ==========================
// WORKSPACE
// ==========================

function updateProjectWorkspace(
    projectOrName: RealProject | string
) {
    const standardWorkspace = document.getElementById("standard-workspace-view");
    const projectHeader = standardWorkspace?.querySelector<HTMLElement>(".project-header");
    const workspaceContainer = standardWorkspace?.querySelector<HTMLElement>(".workspace-container");
    if (projectHeader) projectHeader.style.display = "";
    if (workspaceContainer) workspaceContainer.style.display = "";
    currentFolderPath = "";
    let project: RealProject | undefined;
    let name = "";

    if (typeof projectOrName === "string") {
        name = projectOrName;
        selectedProjectName = projectOrName;
        project = currentProjects.find(p => p.name === projectOrName || p.path === projectOrName) || (selectedProject?.name === projectOrName ? selectedProject : undefined);
        if (project) {
            selectedProject = project;
        }
    } else {
        project = projectOrName;
        selectedProject = project;
        name = project.name;
        selectedProjectName = project.name;
    }

    currentNotes = [];
    updateNotesPanelToggleCount();
    setNotesPanelCollapsed(true);

    if (projectTitle) {
        projectTitle.textContent = name;
    }

    if (projectDescription) {
        projectDescription.textContent = project?.description?.trim() || "No project description";
    }

    if (fileList) {
        fileList.innerHTML = `
            <div class="empty-state">
                Loading files...
            </div>
        `;
    }

    if (notesContent) {
        notesContent.innerHTML = `<div class="empty-state">Loading notes…</div>`;
    }

    if (notesPanelTitle) {
        notesPanelTitle.textContent = "Notes";
    }

    if (projectDate) {
        projectDate.textContent = project?.created_at ? formatCardDate(project.created_at) : formatProjectDate();
    }

    if (projectTagsHeader) {
        projectTagsHeader.innerHTML = "";
    }

    if (createNoteButton) {
        createNoteButton.disabled = false;
    }

    loadProjectContents(project || name);
    loadProjectTags(project || name);
    loadProjectNotes(project || name);
}

// ==========================
// PROJECT TAGS
// ==========================

async function loadProjectTags(
    projectOrName: RealProject | string
) {
    const loc = getProjectLocation(projectOrName);
    if (!loc.name) return;

    const [tags, labels, people] =
        await Promise.all([
            loc.path ? window.electronAPI.getProjectTags(loc.path) : window.electronAPI.getProjectTags(loc.year, loc.month, loc.name),
            window.electronAPI.getDirectoryItems("label"),
            window.electronAPI.getDirectoryItems("person")
        ]);

    if (
        (activeView !== "projects" && activeView !== "pinned" && activeView !== "recurring") ||
        selectedProjectName !== loc.name
    ) return;

    renderProjectTags(
        loc.name,
        tags,
        labels,
        people
    );

}

function formatProjectDate() {
    const now = new Date();
    return `${MONTH_NAMES[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}

async function loadProjectNotes(projectOrName: RealProject | string) {
    if (!notesContent) return;

    const loc = getProjectLocation(projectOrName);
    if (!loc.name) return;

    notesContent.innerHTML = `<div class="empty-state">Loading notes…</div>`;

    try {
        currentNotes = loc.path
            ? await window.electronAPI.getProjectNotes(loc.path)
            : await window.electronAPI.getProjectNotes(loc.year, loc.month, loc.name);
    } catch (err) {
        console.error("Could not load notes:", err);
        currentNotes = [];
    }

    if (
        (activeView !== "projects" && activeView !== "pinned" && activeView !== "recurring") ||
        selectedProjectName !== loc.name
    ) return;

    renderProjectNotes();
}

function renderProjectNotes() {
    if (!notesContent) return;

    updateNotesPanelToggleCount();

    if (currentNotes.length === 0) {
        notesContent.innerHTML = `
            <div class="empty-state">
                No notes yet. Use the button above to add one.
            </div>
        `;
        return;
    }

    notesContent.innerHTML = getNoteGroups(currentNotes).map(monthGroup => `
        <section class="note-month-group project-note-month-group" data-note-month="${monthGroup.year}-${monthGroup.month}">
            ${monthGroup.weeks.map(weekGroup => `
                <div class="note-week-items">
                    ${weekGroup.items.map(note => `
                        <div class="note-card project-note-card" data-note-id="${note.id}">
                            <div class="note-card-header project-note-card-header">
                                <span class="project-note-date">${new Date(note.created_at).toLocaleString()}</span>
                                <div class="note-card-actions">
                                    <button class="note-action-button note-edit-button" data-note-id="${note.id}"><img src="${editProjectIcon}" alt="" /> Edit</button>
                                    <button class="note-action-button note-delete-button" data-note-id="${note.id}"><img src="${deleteIcon}" alt="" /> Delete</button>
                                </div>
                            </div>
                            <div class="note-card-body project-note-card-body">
                                ${note.content ? note.content : `<em>Empty note</em>`}
                            </div>
                        </div>
                    `).join("")}
                </div>
            `).join("")}
        </section>
    `).join("");

    notesContent.querySelectorAll<HTMLButtonElement>(".note-edit-button")
        .forEach(button => {
            button.addEventListener("click", () => {
                const noteId = button.dataset.noteId;
                const note = currentNotes.find(item => item.id === noteId);
                if (note) openNoteInGeneralEditor(note);
            });
        });

    notesContent.querySelectorAll<HTMLElement>(".project-note-card").forEach(card => {
        card.addEventListener("click", event => {
            if ((event.target as HTMLElement).closest("button")) return;
            const note = currentNotes.find(item => item.id === card.dataset.noteId);
            if (note) openNoteInGeneralEditor(note);
        });
    });

    notesContent.querySelectorAll<HTMLButtonElement>(".note-delete-button")
        .forEach(button => {
            button.addEventListener("click", async () => {
                const noteId = button.dataset.noteId;
                if (!noteId || !window.confirm("Delete this note?")) return;
                try {
                    await window.electronAPI.deleteNote(noteId);
                    currentNotes = currentNotes.filter(item => item.id !== noteId);
                    renderProjectNotes();
                } catch (err) {
                    console.error("Could not delete note:", err);
                }
            });
        });

    // Make checkboxes interactive directly in the note card view
    notesContent.querySelectorAll<HTMLInputElement>(".note-checkbox").forEach(checkbox => {
        checkbox.addEventListener("click", async (event) => {
            event.stopPropagation();
            const noteCard = checkbox.closest(".note-card");
            const noteId = noteCard?.getAttribute("data-note-id");
            if (!noteId) return;

            const note = currentNotes.find(item => item.id === noteId);
            if (!note) return;

            if (checkbox.checked) {
                checkbox.setAttribute("checked", "checked");
            } else {
                checkbox.removeAttribute("checked");
            }

            const bodyElem = noteCard?.querySelector(".note-card-body");
            if (bodyElem) {
                note.content = bodyElem.innerHTML;
                note.updated_at = new Date().toISOString();
                try {
                    await window.electronAPI.updateNote(note.id, note.content);
                } catch (err) {
                    console.error("Could not update note checkbox:", err);
                }
            }
        });
    });
}

async function createOrOpenNewNote() {
    const projectName = selectedProject?.name || selectedProjectName;
    if (!projectName) {
        window.alert("Select a project before creating a new note.");
        return;
    }

    const loc = getProjectLocation(selectedProject || projectName);
    const newNote = loc.path
        ? await window.electronAPI.createNote(loc.path, "", "")
        : await window.electronAPI.createNote(loc.year || yearSelect.value, loc.month || monthSelect.value, loc.name || projectName, "", "");

    currentNotes.unshift(newNote);
    renderProjectNotes();
    await openNoteInGeneralEditor(newNote);
}

async function openNoteInGeneralEditor(note: NoteRecord) {
    showNoteEditor(note);
}

function applyNoteFormat(command: string, value?: string) {
    document.execCommand(command, false, value);
}

function extractPlainText(html: string): string {
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || "";
}

function insertCheckboxTask(editor: HTMLElement) {
    editor.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    const getTopLevelBlock = (node: Node | null): HTMLElement | null => {
        let curr: Node | null = node;
        while (curr && curr.parentNode !== editor && curr !== editor) {
            curr = curr.parentNode;
        }
        if (curr && curr !== editor && curr.nodeType === Node.ELEMENT_NODE) {
            return curr as HTMLElement;
        }
        return null;
    };

    // If editor is completely empty
    if (!editor.hasChildNodes() || editor.innerHTML.trim() === "" || editor.innerHTML === "<br>") {
        editor.innerHTML = `<div class="note-task-item"><input type="checkbox" class="note-checkbox" /> <span>&nbsp;</span></div>`;
        const span = editor.querySelector("span");
        if (span) {
            const newRange = document.createRange();
            newRange.selectNodeContents(span);
            newRange.collapse(true);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }
        return;
    }

    const startBlock = getTopLevelBlock(range.startContainer);
    const endBlock = getTopLevelBlock(range.endContainer);

    const allChildren = Array.from(editor.children) as HTMLElement[];
    let targetBlocks: HTMLElement[] = [];

    if (startBlock && endBlock) {
        const startIndex = allChildren.indexOf(startBlock);
        const endIndex = allChildren.indexOf(endBlock);
        if (startIndex !== -1 && endIndex !== -1) {
            const [from, to] = startIndex <= endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
            targetBlocks = allChildren.slice(from, to + 1);
        }
    } else if (startBlock) {
        targetBlocks = [startBlock];
    } else if (endBlock) {
        targetBlocks = [endBlock];
    }

    // If selection is within a single block or across multiple
    if (targetBlocks.length === 0) {
        let node: Node | null = range.commonAncestorContainer;
        if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
        const block = node && node !== editor ? (node as HTMLElement).closest("p, div, h1, h2, blockquote") as HTMLElement : null;
        if (block && editor.contains(block)) {
            targetBlocks = [block];
        }
    }

    // If still no block (e.g. direct text in editor)
    if (targetBlocks.length === 0) {
        const selectedText = range.toString();
        const lines = selectedText ? selectedText.split(/\r?\n/) : [""];
        const frag = document.createDocumentFragment();
        let lastSpan: HTMLElement | null = null;

        lines.forEach(lineText => {
            const clean = lineText.trim();
            const taskDiv = document.createElement("div");
            taskDiv.className = "note-task-item";
            taskDiv.innerHTML = `<input type="checkbox" class="note-checkbox" /> <span>${clean ? clean : "&nbsp;"}</span>`;
            frag.appendChild(taskDiv);
            lastSpan = taskDiv.querySelector("span");
        });

        range.deleteContents();
        range.insertNode(frag);

        if (lastSpan) {
            const newRange = document.createRange();
            newRange.selectNodeContents(lastSpan);
            newRange.collapse(false);
            selection.removeAllRanges();
            selection.addRange(newRange);
        }
        return;
    }

    // Check if ALL target blocks are already task items (then toggle back to paragraphs)
    const allAreTasks = targetBlocks.every(b => b.classList.contains("note-task-item"));

    let lastTargetNode: HTMLElement | null = null;

    targetBlocks.forEach(block => {
        if (allAreTasks) {
            // Convert task back to paragraph
            const span = block.querySelector("span");
            const text = span ? span.textContent?.replace(/\u00a0/g, " ").trim() : block.textContent?.trim() || "";
            const p = document.createElement("p");
            p.innerHTML = text ? text : "<br>";
            block.replaceWith(p);
            lastTargetNode = p;
        } else {
            if (block.classList.contains("note-task-item")) {
                lastTargetNode = block.querySelector("span") || block;
                return;
            }

            const blockHtml = block.innerHTML;
            const innerParts = blockHtml.split(/<br\s*[\/]?>/gi);

            if (innerParts.length > 1 && innerParts.some(p => p.trim())) {
                const frag = document.createDocumentFragment();
                innerParts.forEach(part => {
                    const tempDiv = document.createElement("div");
                    tempDiv.innerHTML = part;
                    const text = tempDiv.textContent?.replace(/\u00a0/g, " ").trim() || "";
                    const taskDiv = document.createElement("div");
                    taskDiv.className = "note-task-item";
                    taskDiv.innerHTML = `<input type="checkbox" class="note-checkbox" /> <span>${text ? text : "&nbsp;"}</span>`;
                    frag.appendChild(taskDiv);
                    lastTargetNode = taskDiv.querySelector("span") || taskDiv;
                });
                block.replaceWith(frag);
            } else {
                const text = block.textContent?.replace(/\u00a0/g, " ").trim() || "";
                const taskDiv = document.createElement("div");
                taskDiv.className = "note-task-item";
                taskDiv.innerHTML = `<input type="checkbox" class="note-checkbox" /> <span>${text ? text : "&nbsp;"}</span>`;
                block.replaceWith(taskDiv);
                lastTargetNode = taskDiv.querySelector("span") || taskDiv;
            }
        }
    });

    if (lastTargetNode) {
        const newRange = document.createRange();
        newRange.selectNodeContents(lastTargetNode);
        newRange.collapse(false);
        selection.removeAllRanges();
        selection.addRange(newRange);
    }
}

function showNoteEditor(note: NoteRecord) {
    const overlay = document.createElement("div");
    overlay.className = "atom-modal-overlay";
    const sharedToolbar = document.querySelector<HTMLElement>("#note-editor-toolbar .toolbar-left-group")?.outerHTML
        .replace(/id="[^"]*"/g, "") ?? "";

    overlay.innerHTML = `
        <div class="atom-modal note-editor-modal project-note-editor-modal">
            <div class="atom-modal-header project-note-editor-header">
                <div>
                    <div class="project-editor-date">${formatNoteHeaderDate(note.created_at)}</div>
                    <input class="project-note-title-input" id="project-note-title" type="text" aria-label="Note title" value="${escapeHtmlAttribute(note.title?.trim() || "Note Title")}" />
                </div>
                <button class="atom-modal-close" id="close-note-editor">×</button>
            </div>

            <div class="atom-modal-body">
                <div class="note-editor-toolbar project-note-editor-toolbar">${sharedToolbar}</div>
                <div class="note-editor-body" contenteditable="true" id="note-editor-body"></div>
                <div class="note-editor-status" id="note-editor-status">Saved</div>
            </div>

            <div class="atom-modal-footer note-editor-footer">
                <button id="close-note-editor-footer" class="atom-button secondary">Close</button>
                <button id="delete-note-confirm" class="atom-button danger">Delete note</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    const noteBody = overlay.querySelector("#note-editor-body") as HTMLElement;
    const noteTitle = overlay.querySelector<HTMLInputElement>("#project-note-title")!;
    const status = overlay.querySelector("#note-editor-status") as HTMLElement;
    const closeButtons = overlay.querySelectorAll("#close-note-editor, #close-note-editor-footer");
    const deleteButton = overlay.querySelector("#delete-note-confirm") as HTMLButtonElement | null;

    noteBody.innerHTML = note.content || "";
    noteBody.focus();

    const saveNoteContent = async () => {
        if (!noteBody) return;
        const content = noteBody.innerHTML;
        try {
            await window.electronAPI.updateNote(note.id, content, noteTitle.value, note.project_id);
            status.textContent = "Saved";
            note.content = content;
            note.title = noteTitle.value;
            note.updated_at = new Date().toISOString();
            const index = currentNotes.findIndex(item => item.id === note.id);
            if (index >= 0) {
                currentNotes[index] = note;
                renderProjectNotes();
            }
        } catch (err) {
            console.error("Could not save note:", err);
            status.textContent = "Save failed";
        }
    };

    const scheduleSave = () => {
        if (openNoteEditorTimeout) {
            window.clearTimeout(openNoteEditorTimeout);
        }
        status.textContent = "Saving…";
        openNoteEditorTimeout = window.setTimeout(saveNoteContent, 800);
    };

    attachNoteImageInteractions(noteBody, scheduleSave);

    noteBody.addEventListener("input", scheduleSave);
    noteTitle.addEventListener("input", scheduleSave);

    // Keep checklist controls interactive in the shared General Notes format.
    noteBody.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const box = target.closest(".checklist-box") as HTMLElement | null;
        if (box) {
            box.classList.toggle("checked", !box.classList.contains("checked"));
            box.classList.toggle("unchecked", !box.classList.contains("checked"));
            box.innerHTML = box.classList.contains("checked") ? `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` : "";
            scheduleSave();
        }
    });

    // Enter and Backspace key handling in task items
    noteBody.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;
            const range = selection.getRangeAt(0);
            let el: Node | null = range.commonAncestorContainer;
            if (el.nodeType === Node.TEXT_NODE) {
                el = el.parentNode;
            }
            const taskItem = el && el !== noteBody ? (el as HTMLElement).closest(".note-task-item") : null;

            if (taskItem && noteBody.contains(taskItem)) {
                e.preventDefault();
                const span = taskItem.querySelector("span");
                const text = span ? span.textContent?.replace(/\u00a0/g, " ").trim() : "";

                if (!text) {
                    const p = document.createElement("p");
                    p.innerHTML = "<br>";
                    taskItem.replaceWith(p);
                    const newRange = document.createRange();
                    newRange.setStart(p, 0);
                    newRange.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                } else {
                    const newTask = document.createElement("div");
                    newTask.className = "note-task-item";
                    newTask.innerHTML = `<input type="checkbox" class="note-checkbox" /> <span>&nbsp;</span>`;
                    taskItem.after(newTask);

                    const newSpan = newTask.querySelector("span");
                    if (newSpan) {
                        const newRange = document.createRange();
                        newRange.selectNodeContents(newSpan);
                        newRange.collapse(true);
                        selection.removeAllRanges();
                        selection.addRange(newRange);
                    }
                }
                scheduleSave();
            }
        } else if (e.key === "Backspace") {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;
            const range = selection.getRangeAt(0);
            let el: Node | null = range.commonAncestorContainer;
            if (el.nodeType === Node.TEXT_NODE) {
                el = el.parentNode;
            }
            const taskItem = el && el !== noteBody ? (el as HTMLElement).closest(".note-task-item") : null;

            if (taskItem && noteBody.contains(taskItem)) {
                const span = taskItem.querySelector("span");
                const text = span ? span.textContent?.replace(/\u00a0/g, " ").trim() : "";
                if (!text || (range.startOffset === 0 && range.collapsed)) {
                    e.preventDefault();
                    const p = document.createElement("p");
                    p.innerHTML = text ? text : "<br>";
                    taskItem.replaceWith(p);
                    const newRange = document.createRange();
                    newRange.selectNodeContents(p);
                    newRange.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                    scheduleSave();
                }
            }
        }
    });

    // Typing shortcut: auto-convert "[] " or "[ ] " or "[x] " to a task item
    noteBody.addEventListener("keyup", (e: KeyboardEvent) => {
        if (e.key === " " || e.key === "Spacebar") {
            const selection = window.getSelection();
            if (!selection || selection.rangeCount === 0) return;
            const range = selection.getRangeAt(0);
            let el: Node | null = range.commonAncestorContainer;
            if (el.nodeType === Node.TEXT_NODE) {
                const text = el.textContent || "";
                if (/^(\[\]|\[ \]|\[x\]|\[X\])\s$/.test(text) || text.startsWith("[] ") || text.startsWith("[ ] ") || text.startsWith("[x] ") || text.startsWith("[X] ")) {
                    const isChecked = text.startsWith("[x] ") || text.startsWith("[X] ");
                    const parent = el.parentElement;
                    if (parent && parent !== noteBody && !parent.classList.contains("note-task-item")) {
                        const taskDiv = document.createElement("div");
                        taskDiv.className = "note-task-item";
                        taskDiv.innerHTML = `<input type="checkbox" class="note-checkbox" ${isChecked ? 'checked="checked"' : ""} /> <span>&nbsp;</span>`;
                        parent.replaceWith(taskDiv);

                        const span = taskDiv.querySelector("span");
                        if (span) {
                            const newRange = document.createRange();
                            newRange.selectNodeContents(span);
                            newRange.collapse(false);
                            selection.removeAllRanges();
                            selection.addRange(newRange);
                        }
                        scheduleSave();
                    }
                }
            }
        }
    });

    overlay.querySelectorAll<HTMLButtonElement>(".note-editor-toolbar button")
        .forEach(button => {
            button.addEventListener("click", () => {
                const cmd = button.dataset.action;
                const value = button.dataset.value;
                if (!cmd) return;
                if (cmd === "checklist") {
                    toggleChecklistLines(noteBody);
                    scheduleSave();
                    return;
                }
                if (cmd === "link") {
                    const url = window.prompt("Enter link URL:", "https://");
                    if (url) document.execCommand("createLink", false, url);
                    noteBody.focus();
                    scheduleSave();
                    return;
                }
                if (cmd === "image") {
                    const url = window.prompt("Enter image URL or path:");
                    if (url) document.execCommand("insertImage", false, url);
                    noteBody.focus();
                    scheduleSave();
                    return;
                }
                applyNoteFormat(cmd, value);
                noteBody.focus();
                scheduleSave();
            });
        });

    closeButtons.forEach(button => {
        button.addEventListener("click", async () => {
            if (openNoteEditorTimeout) {
                window.clearTimeout(openNoteEditorTimeout);
                await saveNoteContent();
            }
            overlay.remove();
        });
    });

    deleteButton?.addEventListener("click", async () => {
        if (!window.confirm("Delete this note permanently?")) return;
        try {
            await window.electronAPI.deleteNote(note.id);
            overlay.remove();
            currentNotes = currentNotes.filter(item => item.id !== note.id);
            renderProjectNotes();
        } catch (err) {
            console.error("Could not delete note:", err);
        }
    });

    overlay.addEventListener("click", event => {
        if (event.target === overlay) {
            if (openNoteEditorTimeout) {
                window.clearTimeout(openNoteEditorTimeout);
                saveNoteContent();
            }
            overlay.remove();
        }
    });
}

function renderProjectTags(
    projectName: string,
    tags: ProjectTags,
    labels: DirectoryItem[],
    people: DirectoryItem[]
) {
    if (!projectTagsHeader) return;

    const selectedLabels =
        labels.filter(label =>
            tags.labelIds.includes(label.id)
        );

    const selectedPeople =
        people.filter(person =>
            tags.personIds.includes(person.id)
        );

    const renderAddPicker = (
        type: "label" | "person",
        selected: DirectoryItem[],
        allItems: DirectoryItem[]
    ) => {
        const available = allItems.filter(item => !selected.some(selectedItem => selectedItem.id === item.id));

        return `
            <div class="project-tag-group">
                <div class="tag-chips">
                    ${selected.map(item => `
                        <button
                            class="tag-chip"
                            type="button"
                            data-tag-id="${item.id}"
                            data-tag-type="${type}"
                            title="Remove ${item.name}"
                        >
                            ${type === "person"
                                ? getUserIconMarkup(item.color, "tag-chip-user-icon")
                                : `<span class="tag-chip-dot" style="background: ${item.color}"></span>`
                            }
                            ${item.name}
                            <span class="tag-chip-close">×</span>
                        </button>
                    `).join("")}
                    <button class="tag-add-button" type="button" data-picker-type="${type}">+
                    </button>
                </div>
                <div class="tag-picker" data-picker-type="${type}">
                    ${available.length === 0
                        ? `<div class="tag-picker-empty">No ${type === "label" ? "labels" : "people"} available</div>`
                        : available.map(item => `
                            <button type="button" class="tag-picker-option" data-tag-id="${item.id}" data-tag-type="${type}">
                                ${type === "person"
                                    ? getUserIconMarkup(item.color, "tag-picker-user-icon")
                                    : `<span class="tag-picker-dot" style="background: ${item.color}"></span>`
                                }
                                ${item.name}
                            </button>
                        `).join("")
                    }
                </div>
            </div>
        `;
    };

    projectTagsHeader.innerHTML = `
        <div class="project-tags">
            ${renderAddPicker("label", selectedLabels, labels)}
            ${renderAddPicker("person", selectedPeople, people)}
        </div>
    `;

    const saveTags = async (nextTags: ProjectTags) => {
        const loc = getProjectLocation(projectName);
        if (loc.path) await window.electronAPI.setProjectTags(loc.path, nextTags);
        else await window.electronAPI.setProjectTags(loc.year, loc.month, loc.name, nextTags);
        await loadProjectTags(loc.name);
    };

    const closePickers = () => {
        projectTagsHeader.querySelectorAll<HTMLElement>(".tag-picker").forEach(picker => {
            picker.classList.remove("visible");
        });
    };

    projectTagsHeader.querySelectorAll<HTMLButtonElement>(".tag-add-button")
        .forEach(button => {
            button.addEventListener("click", () => {
                const type = button.dataset.pickerType;
                if (!type) return;

                closePickers();
                const picker = projectTagsHeader.querySelector<HTMLElement>(`.tag-picker[data-picker-type="${type}"]`);
                picker?.classList.toggle("visible");
            });
        });

    projectTagsHeader.querySelectorAll<HTMLButtonElement>(".tag-picker-option")
        .forEach(option => {
            option.addEventListener("click", () => {
                const id = option.dataset.tagId;
                const type = option.dataset.tagType as "label" | "person";
                if (!id) return;

                saveTags({
                    labelIds: type === "label" ? [...tags.labelIds, id] : tags.labelIds,
                    personIds: type === "person" ? [...tags.personIds, id] : tags.personIds
                });
                closePickers();
            });
        });

    projectTagsHeader.querySelectorAll<HTMLButtonElement>(".tag-chip")
        .forEach(button => {
            button.addEventListener("click", () => {
                const id = button.dataset.tagId;
                const isLabel = button.dataset.tagType === "label";
                if (!id) return;

                saveTags({
                    labelIds: isLabel
                        ? tags.labelIds.filter(tagId => tagId !== id)
                        : tags.labelIds,
                    personIds: isLabel
                        ? tags.personIds
                        : tags.personIds.filter(personId => personId !== id)
                });
            });
        });

    if (!projectTagDocumentHandlerAttached) {
        document.addEventListener("click", handleProjectTagDocumentClick);
        projectTagDocumentHandlerAttached = true;
    }
}

// ==========================
// BREADCRUMBS
// ==========================

function renderFileBreadcrumbs(projectName: string, folderPath: string) {
    const breadcrumbsElem = document.querySelector("#file-breadcrumbs");
    if (!breadcrumbsElem) return;

    if (!projectName) {
        breadcrumbsElem.innerHTML = "";
        return;
    }

    const segments = folderPath ? folderPath.split(/[\\/]/).filter(Boolean) : [];

    let html = `
        <button class="breadcrumb-item ${segments.length === 0 ? "breadcrumb-current" : ""}" data-folder-path="" type="button">
            ${projectName}
        </button>
    `;

    let accumulatedPath = "";
    segments.forEach((seg, idx) => {
        accumulatedPath = accumulatedPath ? `${accumulatedPath}\\${seg}` : seg;
        const isCurrent = idx === segments.length - 1;
        html += `
            <span class="breadcrumb-separator" aria-hidden="true">></span>
            <button class="breadcrumb-item ${isCurrent ? "breadcrumb-current" : ""}" data-folder-path="${accumulatedPath}" type="button">
                ${seg}
            </button>
        `;
    });

    breadcrumbsElem.innerHTML = html;

    breadcrumbsElem.querySelectorAll<HTMLButtonElement>(".breadcrumb-item").forEach(button => {
        button.addEventListener("click", () => {
            const targetPath = button.getAttribute("data-folder-path") ?? "";
            if (targetPath === currentFolderPath) return;
            currentFolderPath = targetPath;
            loadProjectContents(selectedProject || selectedProjectName || "", currentFolderPath);
        });
    });
}

// ==========================
// LOAD PROJECT CONTENTS
// ==========================

async function loadProjectContents(
    projectOrName: RealProject | string,
    folderPath = currentFolderPath
) {
    currentFolderPath = folderPath;
    selectedFilePaths.clear();
    const loc = getProjectLocation(projectOrName);
    if (!loc.name) {
        renderFileBreadcrumbs("", "");
        return;
    }

    renderFileBreadcrumbs(loc.name, currentFolderPath);

    let contents: ProjectContent[] = [];
    try {
        if (currentFolderPath) {
            contents = loc.path
                ? await window.electronAPI.getProjectFolderContents(loc.path, currentFolderPath)
                : await window.electronAPI.getProjectFolderContents(
                    loc.year,
                    loc.month,
                    loc.name,
                    currentFolderPath
                );
        } else {
            contents = loc.path
                ? await window.electronAPI.getProjectContents(loc.path)
                : await window.electronAPI.getProjectContents(
                    loc.year,
                    loc.month,
                    loc.name
                );
        }
    } catch (err) {
        console.error("Could not load project contents:", err);
        contents = [];
    }

    if (
        (activeView !== "projects" && activeView !== "pinned" && activeView !== "recurring") ||
        selectedProjectName !== loc.name
    ) return;

    if (!fileList)
        return;

    if (contents.length === 0) {
        fileList.innerHTML = `
            <div class="empty-state">
                ${currentFolderPath ? "Empty folder" : "No files or folders"}
            </div>
        `;
        return;
    }

    const files =
        contents.filter(
            item =>
                item.type === "file"
        );

    const folders =
        contents.filter(
            item =>
                item.type === "folder"
        );

    fileList.innerHTML = "";

    // ==========================
    // FOLDERS
    // ==========================

    folders.forEach(folder => {
        const element = document.createElement("div");
        element.className = "file-card folder-card";
        element.draggable = true;
        const relativeFolderPath = currentFolderPath ? `${currentFolderPath}\\${folder.name}` : folder.name;

        element.innerHTML = `
            ${getFolderIconMarkup()}

            <div class="file-info">
                <div class="file-name" title="${escapeHtmlAttribute(folder.name)}">
                    ${escapeDashboardHtml(folder.name)}
                </div>
            </div>

            <div class="file-more-actions">
                <button class="file-more-button" type="button" title="Folder options" aria-label="Folder options" aria-expanded="false">
                    <span aria-hidden="true">⋮</span>
                </button>
                <div class="file-action-menu" role="menu">
                    <button class="file-menu-item file-open-button" type="button" role="menuitem"><img src="${openFileIcon}" alt="" />Open folder</button>
                    <button class="file-menu-item file-rename-button" type="button" role="menuitem"><img src="${renameIcon}" alt="" />Rename</button>
                    <button class="file-menu-item file-duplicate-button" type="button" role="menuitem"><img src="${duplicateIcon}" alt="" />Duplicate</button>
                    <button class="file-menu-item file-share-button" type="button" role="menuitem"><img src="${shareIcon}" alt="" />Share</button>
                    <button class="file-menu-item file-delete-button danger" type="button" role="menuitem"><img src="${deleteIcon}" alt="" />Delete</button>
                </div>
            </div>
        `;

        fileList.appendChild(element);

        element.addEventListener("dragstart", event => {
            const projectPath = selectedProject?.path;
            if (!projectPath) {
                event.preventDefault();
                return;
            }

            // Hand the drag to Electron so the operating system receives a real folder path.
            event.preventDefault();
            element.classList.add("is-dragging");
            window.electronAPI.startFileDrag(projectPath, [relativeFolderPath]);
        });

        element.addEventListener("dragend", () => {
            element.classList.remove("is-dragging");
            fileList?.classList.remove("drop-active");
            element.classList.remove("internal-drop-target");
        });

        element.addEventListener("dragover", event => {
            const dataTransfer = (event as DragEvent).dataTransfer;
            if (!selectedProject?.path || !dataTransfer?.types.includes("Files")) return;
            event.preventDefault();
            dataTransfer.dropEffect = isInternalProjectDrop(dataTransfer) ? "move" : "copy";
            element.classList.add("internal-drop-target");
        });

        element.addEventListener("dragleave", event => {
            const relatedTarget = (event as DragEvent).relatedTarget;
            if (relatedTarget instanceof Node && element.contains(relatedTarget)) return;
            element.classList.remove("internal-drop-target");
        });

        element.addEventListener("drop", async event => {
            const dragEvent = event as DragEvent;
            const projectPath = selectedProject?.path;
            const dataTransfer = dragEvent.dataTransfer;
            if (!projectPath || !dataTransfer?.files.length) return;
            event.preventDefault();
            event.stopPropagation();
            element.classList.remove("internal-drop-target");
            fileList?.classList.remove("drop-active");
            fileList?.querySelectorAll(".internal-drop-target").forEach(target => target.classList.remove("internal-drop-target"));

            try {
                const sourcePaths = getDroppedFilePaths(dataTransfer);
                const isInternalMove = sourcePaths.length === dataTransfer.files.length
                    && sourcePaths.every(sourcePath => isPathInsideProject(projectPath, sourcePath));
                if (!isInternalMove) {
                    await importDroppedFiles(Array.from(dataTransfer.files), relativeFolderPath);
                    return;
                }

                const destinationPath = getAbsoluteProjectPath(projectPath, relativeFolderPath);
                const destinationKey = destinationPath.replace(/[\\/]+/g, "/").replace(/\/+$/, "").toLowerCase();
                if (sourcePaths.some(sourcePath => sourcePath.replace(/[\\/]+/g, "/").replace(/\/+$/, "").toLowerCase() === destinationKey)) return;

                const result = await window.electronAPI.moveProjectItems(projectPath, sourcePaths, destinationPath);
                if (result.moved > 0) {
                    selectedFilePaths.clear();
                    await loadProjectContents(projectPath, currentFolderPath);
                }
            } catch (error) {
                console.error("Could not move project items:", error);
                const reason = error instanceof Error ? error.message : "The items could not be moved due to an unexpected filesystem error.";
                window.alert(`Could not move the selected item${dataTransfer.files.length === 1 ? "" : "s"}.\n\n${reason}`);
            }
        });

        const moreButton = element.querySelector<HTMLButtonElement>(".file-more-button");
        const actionMenu = element.querySelector<HTMLElement>(".file-action-menu");

        const openMenu = () => {
            const willOpen = !actionMenu?.classList.contains("visible");
            closeFileActionMenu();
            closeProjectActionMenu();

            if (willOpen && actionMenu) {
                actionMenu.classList.add("visible");
                activeFileActionMenu = actionMenu;
            }

            moreButton?.setAttribute("aria-expanded", String(willOpen));
        };

        moreButton?.addEventListener("click", event => {
            event.stopPropagation();
            openMenu();
        });

        element.addEventListener("contextmenu", event => {
            event.preventDefault();
            event.stopPropagation();
            openMenu();
        });

        element.querySelector<HTMLButtonElement>(".file-open-button")?.addEventListener(
            "click",
            event => {
                event.stopPropagation();
                closeFileActionMenu();
                currentFolderPath = relativeFolderPath;
                loadProjectContents(selectedProject || loc.name, currentFolderPath);
            }
        );

        element.querySelector<HTMLButtonElement>(".file-rename-button")?.addEventListener(
            "click",
            event => {
                event.stopPropagation();
                closeFileActionMenu();
                showRenameItemModal(folder.name, true);
            }
        );

        element.querySelector<HTMLButtonElement>(".file-duplicate-button")?.addEventListener(
            "click",
            async event => {
                event.stopPropagation();
                closeFileActionMenu();
                if (!selectedProjectName) return;
                const curLoc = getProjectLocation(selectedProject);

                try {
                    await window.electronAPI.duplicateFile(
                        curLoc.path,
                        relativeFolderPath
                    );
                    await loadProjectContents(curLoc.name, currentFolderPath);
                } catch (err) {
                    console.error("Duplicate folder failed:", err);
                    window.alert("Could not duplicate the folder.");
                }
            }
        );

        element.querySelector<HTMLButtonElement>(".file-share-button")?.addEventListener(
            "click",
            async event => {
                event.stopPropagation();
                closeFileActionMenu();

                try {
                    const projectPath = selectedProject?.path;
                    if (!projectPath) throw new Error("The selected project folder is unavailable.");
                    await window.electronAPI.copyProjectPath(`${projectPath.replace(/[\\/]$/, "")}\\${relativeFolderPath}`);
                } catch (err) {
                    console.error("Copy folder path failed:", err);
                    window.alert("Could not copy the folder path.");
                }
            }
        );

        element.querySelector<HTMLButtonElement>(".file-delete-button")?.addEventListener(
            "click",
            async event => {
                event.stopPropagation();
                closeFileActionMenu();
                if (!selectedProjectName) return;
                if (!window.confirm(`Delete folder "${folder.name}" and all its contents?`)) return;

                const curLoc = getProjectLocation(selectedProject);

                try {
                    await window.electronAPI.deleteFile(
                        curLoc.path,
                        relativeFolderPath
                    );
                    await loadProjectContents(curLoc.name, currentFolderPath);
                } catch (err) {
                    console.error("Delete folder failed:", err);
                    window.alert("Could not delete the folder.");
                }
            }
        );

        element.addEventListener("click", event => {
            const target = event.target as HTMLElement;
            if (target.closest(".file-more-actions")) return;
            currentFolderPath = relativeFolderPath;
            loadProjectContents(selectedProject || loc.name, currentFolderPath);
        });
    });

    // ==========================
    // FILES
    // ==========================

    files.forEach(file => {
        const element =
            document.createElement("div");

        element.className =
            "file-card";
        element.draggable = true;

        const relativeFilePath = currentFolderPath ? `${currentFolderPath}\\${file.name}` : file.name;

        element.innerHTML = `
            ${getFileIconMarkup(file.name)}

            <div class="file-info">
                <div class="file-name" title="${escapeHtmlAttribute(file.name)}">
                    ${escapeDashboardHtml(file.name)}
                </div>
            </div>

            <div class="file-more-actions">
                <button class="file-more-button" type="button" title="File options" aria-label="File options" aria-expanded="false">
                    <span aria-hidden="true">⋮</span>
                </button>
                <div class="file-action-menu" role="menu">
                    <button class="file-menu-item file-open-button" type="button" role="menuitem"><img src="${openFileIcon}" alt="" />Open file</button>
                    <button class="file-menu-item file-rename-button" type="button" role="menuitem"><img src="${renameIcon}" alt="" />Rename</button>
                    <button class="file-menu-item file-duplicate-button" type="button" role="menuitem"><img src="${duplicateIcon}" alt="" />Duplicate</button>
                    <button class="file-menu-item file-share-button" type="button" role="menuitem"><img src="${shareIcon}" alt="" />Share</button>
                    <button class="file-menu-item file-delete-button danger" type="button" role="menuitem"><img src="${deleteIcon}" alt="" />Delete</button>
                </div>
            </div>
        `;

        fileList.appendChild(element);

        element.addEventListener("click", event => {
            const target = event.target as HTMLElement;
            if (target.closest(".file-more-actions")) return;

            if (event.ctrlKey || event.metaKey) {
                if (selectedFilePaths.has(relativeFilePath)) {
                    selectedFilePaths.delete(relativeFilePath);
                    element.classList.remove("selected");
                } else {
                    selectedFilePaths.add(relativeFilePath);
                    element.classList.add("selected");
                }
                return;
            }

            selectedFilePaths.clear();
            fileList?.querySelectorAll(".file-card:not(.folder-card)").forEach(card => card.classList.remove("selected"));
            selectedFilePaths.add(relativeFilePath);
            element.classList.add("selected");
        });

        element.addEventListener("dragstart", event => {
            const projectPath = selectedProject?.path;
            if (!projectPath) {
                event.preventDefault();
                return;
            }

            // Electron requires cancelling the DOM drag before the main process
            // can hand it off as an OS-level file drag operation.
            event.preventDefault();

            if (!selectedFilePaths.has(relativeFilePath)) {
                selectedFilePaths.clear();
                fileList?.querySelectorAll(".file-card:not(.folder-card)").forEach(card => card.classList.remove("selected"));
                selectedFilePaths.add(relativeFilePath);
                element.classList.add("selected");
            }

            event.dataTransfer?.setData("text/plain", file.name);
            if (event.dataTransfer) event.dataTransfer.effectAllowed = "copy";
            element.classList.add("is-dragging");
            window.electronAPI.startFileDrag(projectPath, [...selectedFilePaths]);
        });

        element.addEventListener("dragend", () => {
            element.classList.remove("is-dragging");
            fileList?.classList.remove("drop-active");
        });

        const moreButton = element.querySelector<HTMLButtonElement>(".file-more-button");
        const actionMenu = element.querySelector<HTMLElement>(".file-action-menu");

        const openMenu = () => {
            const willOpen = !actionMenu?.classList.contains("visible");
            closeFileActionMenu();
            closeProjectActionMenu();

            if (willOpen && actionMenu) {
                actionMenu.classList.add("visible");
                activeFileActionMenu = actionMenu;
            }

            moreButton?.setAttribute("aria-expanded", String(willOpen));
        };

        moreButton?.addEventListener("click", event => {
            event.stopPropagation();
            openMenu();
        });

        element.addEventListener("contextmenu", event => {
            event.preventDefault();
            event.stopPropagation();
            openMenu();
        });

        element.querySelector<HTMLButtonElement>(".file-open-button")?.addEventListener(
            "click",
            event => {
                event.stopPropagation();
                closeFileActionMenu();
                if (selectedProjectName) openProjectContent(selectedProjectName, relativeFilePath);
            }
        );

        element.querySelector<HTMLButtonElement>(".file-rename-button")?.addEventListener(
            "click",
            event => {
                event.stopPropagation();
                closeFileActionMenu();
                showRenameItemModal(file.name, false);
            }
        );

        element.querySelector<HTMLButtonElement>(".file-duplicate-button")?.addEventListener(
            "click",
            async event => {
                event.stopPropagation();
                closeFileActionMenu();
                if (!selectedProjectName) return;

                const curLoc = getProjectLocation(selectedProject);

                try {
                    await window.electronAPI.duplicateFile(
                        curLoc.path,
                        relativeFilePath
                    );
                    await loadProjectContents(curLoc.name, currentFolderPath);
                } catch (err) {
                    console.error("Duplicate file failed:", err);
                    window.alert("Could not duplicate the file.");
                }
            }
        );

        element.querySelector<HTMLButtonElement>(".file-share-button")?.addEventListener(
            "click",
            async event => {
                event.stopPropagation();
                closeFileActionMenu();

                const projectPath = selectedProject?.path;
                if (!projectPath || typeof window.electronAPI.shareFile !== "function") {
                    window.alert("Restart Atom to enable Microsoft Teams sharing.");
                    return;
                }

                try {
                    await window.electronAPI.shareFile(`${projectPath.replace(/[\\/]$/, "")}\\${relativeFilePath}`);
                } catch (err) {
                    console.error("Share file failed:", err);
                    const reason = err instanceof Error ? err.message : "Microsoft Teams is not available.";
                    window.alert(`Could not share this file through Microsoft Teams.\n\n${reason}`);
                }
            }
        );

        element.querySelector<HTMLButtonElement>(".file-delete-button")?.addEventListener(
            "click",
            async event => {
                event.stopPropagation();
                closeFileActionMenu();
                const fileName = file.name;
                if (!selectedProjectName) return;
                if (!window.confirm(`Delete file "${fileName}"?`)) return;

                const curLoc = getProjectLocation(selectedProject);

                try {
                    await window.electronAPI.deleteFile(
                        curLoc.path,
                        relativeFilePath
                    );
                    await loadProjectContents(curLoc.name, currentFolderPath);
                } catch (err) {
                    console.error("Delete file failed:", err);
                    window.alert("Could not delete the file.");
                }
            }
        );

        element.addEventListener(
            "dblclick",
            () => {
                const projectName = selectedProjectName;

                if (projectName) {
                    openProjectContent(
                        projectName,
                        relativeFilePath
                    );
                }
            }
        );
    });
}

// ==========================
// CLEAR WORKSPACE
// ==========================

function clearWorkspace() {
    selectedProject = null;
    selectedProjectName = null;
    selectedFilePaths.clear();
    document.querySelectorAll<HTMLElement>(".project-card.selected").forEach(card => card.classList.remove("selected"));
    currentFolderPath = "";
    renderFileBreadcrumbs("", "");

    const standardWorkspace = document.getElementById("standard-workspace-view");
    const projectHeader = standardWorkspace?.querySelector<HTMLElement>(".project-header");
    const workspaceContainer = standardWorkspace?.querySelector<HTMLElement>(".workspace-container");
    if (projectHeader) projectHeader.style.display = "none";
    if (workspaceContainer) workspaceContainer.style.display = "none";
    if (projectTitle) projectTitle.textContent = "";
    if (projectDescription) projectDescription.textContent = "";
    if (fileList) fileList.innerHTML = "";
    if (notesContent) notesContent.innerHTML = "";
    if (notesPanelTitle) notesPanelTitle.textContent = "";

    if (projectDate) {
        projectDate.textContent = "";
    }

    if (projectTagsHeader) {
        projectTagsHeader.innerHTML = "";
    }

    if (createNoteButton) {
        createNoteButton.disabled = true;
    }
}


// ==========================
// YEAR CHANGE
// ==========================

yearSelect?.addEventListener(
    "change",
    async () => {

        await loadMonths(
            yearSelect.value
        );

    }
);


// ==========================
// MONTH CHANGE
// ==========================

monthSelect?.addEventListener(
    "change",
    async () => {

        await loadProjects(
            yearSelect.value,
            monthSelect.value
        );

    }
);


// ==========================
// INITIALIZE
// ==========================

window.electronAPI.logRendererDiagnostic({ event: "renderer-initialization-started" });
clearWorkspace();
window.electronAPI.getProjectFolderTabs().then(folders => folders.filter(folder => !/template/i.test(folder.name)).forEach(folder => {
    const tab = document.createElement("button");
    tab.className = "project-tab";
    tab.dataset.folderPath = folder.path;
    tab.innerHTML = `📁 <span>${escapeDashboardHtml(folder.name)}</span>`;
    document.getElementById("add-project-folder")?.before(tab);
    tab.addEventListener("click", () => void activateProjectFolderTab(folder, tab));
})).catch(error => console.error("Could not load project folders:", error));
switchView("projects");
window.electronAPI.logRendererDiagnostic({ event: "renderer-initialization-complete" });

if (typeof window.electronAPI.getSettings === "function") {
    window.electronAPI.getSettings().then(settings => {
        document.documentElement.style.setProperty("--accent-color", settings.accentColor);
    }).catch(error => {
        console.error("Could not load Atom settings:", error);
    });
}

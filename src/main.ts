import { app, BrowserWindow, clipboard, dialog, ipcMain, nativeImage, powerMonitor, shell } from "electron";
import path from "node:path";
import fsSync from "node:fs";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";
import fs from "fs/promises";
import started from "electron-squirrel-startup";
import {
  initializeDatabase,
  insertProjectRecord,
  updateProjectPath,
  updateProjectRecord,
  deleteProjectRecordByPath,
  getProjectRecordByPath,
  getAllProjectRecords,
  getPinnedProjectRecords,
  toggleProjectPin,
  getRecentNotes,
  getProjectNotesByPath,
  getAllNotes,
  createNoteRecord,
  updateNoteRecord,
  deleteNoteRecord,
  punchInRecord,
  punchOutRecord,
  getTodayAttendanceSummary,
  getMonthlyAttendanceSummary,
  createAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecord,
  setAttendanceTargetSeconds,
  setHalfDayTargetSeconds,
  updateAttendanceBreaks,
  getAllProjectTemplates,
  getProjectTemplateById,
  saveProjectTemplate,
  deleteProjectTemplate,
} from "./db";

declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined;
declare const MAIN_WINDOW_VITE_NAME: string;

const DIAGNOSTIC_LOG_MAX_BYTES = 2 * 1024 * 1024;
const DIAGNOSTIC_LOG_BACKUPS = 3;
const disableGpuForDiagnostics = process.env.ATOM_DISABLE_GPU === "1";

// Must be applied before app readiness. The default remains Electron's normal GPU behavior.
if (disableGpuForDiagnostics) app.disableHardwareAcceleration();

const diagnosticLogPath = () => path.join(app.getPath("userData"), "logs", "atom-diagnostics.log");
const diagnosticLog = (event: string, details: Record<string, unknown> = {}) => {
  try {
    const logPath = diagnosticLogPath();
    fsSync.mkdirSync(path.dirname(logPath), { recursive: true });
    if (fsSync.existsSync(logPath) && fsSync.statSync(logPath).size >= DIAGNOSTIC_LOG_MAX_BYTES) {
      const oldest = `${logPath}.${DIAGNOSTIC_LOG_BACKUPS}`;
      if (fsSync.existsSync(oldest)) fsSync.unlinkSync(oldest);
      for (let index = DIAGNOSTIC_LOG_BACKUPS - 1; index >= 1; index -= 1) {
        const source = `${logPath}.${index}`;
        if (fsSync.existsSync(source)) fsSync.renameSync(source, `${logPath}.${index + 1}`);
      }
      fsSync.renameSync(logPath, `${logPath}.1`);
    }
    fsSync.appendFileSync(logPath, `${JSON.stringify({ timestamp: new Date().toISOString(), event, ...details })}\n`, "utf8");
  } catch (error) {
    console.error("Atom diagnostic log write failed:", error);
  }
};

diagnosticLog("app-start", {
  appVersion: app.getVersion(), electronVersion: process.versions.electron,
  chromiumVersion: process.versions.chrome, nodeVersion: process.versions.node,
  platform: process.platform, gpuDisabled: disableGpuForDiagnostics,
});
app.on("child-process-gone", (_event, details) => {
  diagnosticLog("child-process-gone", { type: details.type, reason: details.reason, exitCode: details.exitCode, serviceName: details.serviceName });
});
powerMonitor.on("lock-screen", () => diagnosticLog("lock-screen"));
powerMonitor.on("unlock-screen", () => diagnosticLog("unlock-screen"));
powerMonitor.on("suspend", () => diagnosticLog("system-suspend"));
powerMonitor.on("resume", () => diagnosticLog("system-resume"));
ipcMain.on("renderer-diagnostic", (_event, detail: { event?: string; message?: string; source?: string; line?: number; column?: number; errorName?: string }) => {
  diagnosticLog("renderer-error", {
    event: typeof detail?.event === "string" ? detail.event.slice(0, 80) : "unknown",
    message: typeof detail?.message === "string" ? detail.message.slice(0, 500) : undefined,
    source: typeof detail?.source === "string" ? path.basename(detail.source).slice(0, 120) : undefined,
    line: detail?.line, column: detail?.column,
    errorName: typeof detail?.errorName === "string" ? detail.errorName.slice(0, 100) : undefined,
  });
});


// ==========================
// PROJECTS ROOT
// ==========================

const DEFAULT_PROJECTS_ROOT = "D:\\Projects";

let projectsRoot = DEFAULT_PROJECTS_ROOT;
let recurringProjectsRoot = path.join(DEFAULT_PROJECTS_ROOT, "Recurring Projects");
let accentColor = "#bcf43b";
let userName = "Deepak";
let quotes: string[] = [];
let targetAttendanceSeconds = 8 * 3600;
let halfDayTargetSeconds = 4 * 3600;

interface DirectoryItem {
  id: string;
  name: string;
  color: string;
}

interface ProjectTags {
  labelIds: string[];
  personIds: string[];
}

let labels: DirectoryItem[] = [];
let people: DirectoryItem[] = [];
let projectTags: Record<string, ProjectTags> = {};

const getSettingsPath = () =>
  path.join(app.getPath("userData"), "settings.json");

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

const getDefaultYears = () => {
  const currentYear = new Date().getFullYear();
  const years = new Set<string>();

  for (let offset = -5; offset <= 5; offset += 1) {
    years.add(String(currentYear + offset));
  }

  return Array.from(years).sort((a, b) => Number(a) - Number(b));
};

const loadSettings = async () => {
  try {
    const settings = JSON.parse(
      await fs.readFile(getSettingsPath(), "utf8")
    ) as {
      projectsRoot?: string;
      recurringProjectsRoot?: string;
      accentColor?: string;
      userName?: string;
      quotes?: string[];
      targetAttendanceSeconds?: number;
      halfDayTargetSeconds?: number;
      labels?: DirectoryItem[];
      people?: DirectoryItem[];
      projectTags?: Record<string, ProjectTags>;
    };

    if (settings.projectsRoot) {
      projectsRoot = settings.projectsRoot;
    }
    if (settings.recurringProjectsRoot) {
      recurringProjectsRoot = settings.recurringProjectsRoot;
    }
    if (settings.accentColor) {
      accentColor = settings.accentColor;
    }
    if (typeof settings.userName === "string" && settings.userName.trim()) userName = settings.userName.trim();
    if (Array.isArray(settings.quotes)) quotes = settings.quotes.filter(quote => typeof quote === "string" && quote.trim());
    if (typeof settings.targetAttendanceSeconds === "number" && settings.targetAttendanceSeconds > 0) targetAttendanceSeconds = settings.targetAttendanceSeconds;
    if (typeof settings.halfDayTargetSeconds === "number" && settings.halfDayTargetSeconds > 0) halfDayTargetSeconds = settings.halfDayTargetSeconds;

    labels = settings.labels || [];
    people = settings.people || [];
    projectTags = settings.projectTags || {};
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Could not load Atom settings:", error);
    }
  }
  setAttendanceTargetSeconds(targetAttendanceSeconds);
  setHalfDayTargetSeconds(halfDayTargetSeconds);
};

const saveSettings = async () => {
  await fs.writeFile(
    getSettingsPath(),
    JSON.stringify({ projectsRoot, recurringProjectsRoot, accentColor, userName, quotes, targetAttendanceSeconds, halfDayTargetSeconds, labels, people, projectTags }, null, 2),
    "utf8"
  );
};


// ==========================
// SQUIRREL STARTUP
// ==========================

if (started) {
  app.quit();
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
}


// ==========================
// CREATE WINDOW
// ==========================

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    icon: path.resolve(__dirname, "../../src/icons/atomLogo.png"),
    autoHideMenuBar: true,
    titleBarStyle: process.platform === "win32" ? "hidden" : "default",
    titleBarOverlay: process.platform === "win32"
      ? { color: "#13171a", symbolColor: "#b6bac0", height: 32 }
      : false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  const windowId = mainWindow.id;
  const webContentsId = mainWindow.webContents.id;
  const windowEvent = (event: string) => diagnosticLog(`window-${event}`, { windowId, webContentsId, visible: mainWindow.isVisible(), minimized: mainWindow.isMinimized() });
  mainWindow.on("show", () => windowEvent("show"));
  mainWindow.on("hide", () => windowEvent("hide"));
  mainWindow.on("minimize", () => windowEvent("minimize"));
  mainWindow.on("restore", () => windowEvent("restore"));
  mainWindow.on("focus", () => windowEvent("focus"));
  mainWindow.on("blur", () => windowEvent("blur"));
  mainWindow.webContents.on("render-process-gone", (_event, details) => {
    diagnosticLog("render-process-gone", { windowId, webContentsId, rendererPid: mainWindow.webContents.getOSProcessId(), reason: details.reason, exitCode: details.exitCode });
  });
  mainWindow.webContents.on("unresponsive", () => diagnosticLog("renderer-unresponsive", { windowId, webContentsId, rendererPid: mainWindow.webContents.getOSProcessId() }));
  mainWindow.webContents.on("responsive", () => diagnosticLog("renderer-responsive", { windowId, webContentsId, rendererPid: mainWindow.webContents.getOSProcessId() }));
  mainWindow.webContents.on("did-fail-load", (_event, errorCode, errorDescription, _validatedURL, isMainFrame) => {
    diagnosticLog("did-fail-load", { windowId, webContentsId, errorCode, errorDescription, isMainFrame });
  });
  mainWindow.webContents.on("did-finish-load", () => diagnosticLog("did-finish-load", { windowId, webContentsId }));
  diagnosticLog("window-created", { windowId, webContentsId });
  mainWindow.setMenu(null);

  const handleShortcut = (event: Electron.Event, input: Electron.Input, fromDevTools = false) => {
    if (input.type !== "keyDown") return;
    const key = input.key.toLowerCase();
    const command = input.control || input.meta;

    if (!input.alt && (key === "f12" || (command && input.shift && key === "i"))) {
      event.preventDefault();
      mainWindow.webContents.toggleDevTools();
      return;
    }

    if (command && input.shift && key === "j") {
      // Let Chromium DevTools handle this itself when it already has focus.
      if (fromDevTools) return;
      event.preventDefault();
      mainWindow.webContents.openDevTools({ mode: "detach", activate: true });
      setTimeout(() => {
        const devTools = mainWindow.webContents.devToolsWebContents;
        if (!devTools || devTools.isDestroyed()) return;
        devTools.focus();
        devTools.sendInputEvent({ type: "keyDown", keyCode: "J", modifiers: ["control", "shift"] });
        devTools.sendInputEvent({ type: "keyUp", keyCode: "J", modifiers: ["control", "shift"] });
      }, 100);
      return;
    }

    if (command && key === "r") {
      event.preventDefault();
      if (input.shift) mainWindow.webContents.reloadIgnoringCache();
      else mainWindow.webContents.reload();
    }
  };

  mainWindow.webContents.on("before-input-event", (event, input) => handleShortcut(event, input));

  let devToolsContents: Electron.WebContents | null = null;
  let devToolsShortcutHandler: ((event: Electron.Event, input: Electron.Input) => void) | null = null;
  mainWindow.webContents.on("devtools-opened", () => {
    const contents = mainWindow.webContents.devToolsWebContents;
    if (!contents || contents === devToolsContents) return;
    if (devToolsContents && devToolsShortcutHandler) {
      devToolsContents.off("before-input-event", devToolsShortcutHandler);
    }
    devToolsContents = contents;
    devToolsShortcutHandler = (event, input) => handleShortcut(event, input, true);
    devToolsContents.on("before-input-event", devToolsShortcutHandler);
  });
  mainWindow.webContents.on("devtools-closed", () => {
    if (devToolsContents && devToolsShortcutHandler) {
      devToolsContents.off("before-input-event", devToolsShortcutHandler);
    }
    devToolsContents = null;
    devToolsShortcutHandler = null;
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }
};


// ==========================
// GET PROJECT YEARS
// ==========================

ipcMain.handle("get-project-years", async () => {
  const years = new Set(getDefaultYears());

  try {
    const items = await fs.readdir(projectsRoot, {
      withFileTypes: true,
    });

    items
      .filter(item => item.isDirectory() && /^\d{4}$/.test(item.name))
      .forEach(item => years.add(item.name));
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Could not read project years:", error);
    }
  }

  return Array.from(years).sort((a, b) => Number(a) - Number(b));
});

ipcMain.handle("create-project-folder-tab", async (_event, name: string) => {
  const clean = String(name || "").trim();
  if (!clean || clean === "." || clean === ".." || /[<>:"/\\|?*]/.test(clean) || /^\d{4}$/.test(clean)) throw new Error("Enter a valid folder name.");
  if (/template/i.test(clean)) throw new Error("Template folders cannot be added as project tabs.");
  const target = path.join(projectsRoot, clean);
  await fs.mkdir(target);
  return { name: clean, path: target };
});

ipcMain.handle("get-project-folder-tabs", async () => {
  try {
    return (await fs.readdir(projectsRoot, { withFileTypes: true }))
      .filter(item => item.isDirectory() && !/^\d{4}$/.test(item.name) && !/template/i.test(item.name) && path.resolve(path.join(projectsRoot, item.name)) !== path.resolve(recurringProjectsRoot))
      .map(item => ({ name: item.name, path: path.join(projectsRoot, item.name) }));
  } catch { return []; }
});

ipcMain.handle("get-projects-in-folder-tab", async (_event, folderPath: string) => {
  const isRecurringRoot = path.resolve(folderPath) === path.resolve(recurringProjectsRoot);
  const isMainProjectFolder = path.dirname(path.resolve(folderPath)) === path.resolve(projectsRoot);
  if ((!isRecurringRoot && !isMainProjectFolder) || !isConfiguredProjectPath(folderPath)) throw new Error("Invalid project folder.");
  const items = await fs.readdir(folderPath, { withFileTypes: true }).catch(() => []);
  return Promise.all(items.filter(item => item.isDirectory()).map(async item => {
    const projectPath = path.join(folderPath, item.name);
    let project = getProjectRecordByPath(projectPath);
    if (!project) {
      const date = (await fs.stat(projectPath)).birthtime.toISOString();
      project = { id: crypto.randomUUID(), name: item.name, path: projectPath, description: null, status: null, project_type: "default", progress: 0, deadline: null, created_at: date, updated_at: date };
      insertProjectRecord(project);
    }
    return project;
  }));
});

ipcMain.handle("create-project-in-folder-tab", async (_event, folderPath: string, projectName: string, details?: { description?: string; status?: ProjectStatus; project_type?: ProjectType; deadline?: string; created_at?: string; templateId?: string | null }) => {
  const isRecurringRoot = path.resolve(folderPath) === path.resolve(recurringProjectsRoot);
  const isMainProjectFolder = path.dirname(path.resolve(folderPath)) === path.resolve(projectsRoot);
  if ((!isRecurringRoot && !isMainProjectFolder) || !isConfiguredProjectPath(folderPath)) throw new Error("Invalid project folder.");
  const cleanName = String(projectName || "").trim();
  if (!cleanName || cleanName === "." || cleanName === ".." || /[<>:"/\\|?*]/.test(cleanName)) throw new Error("Enter a valid project name.");
  const projectPath = path.join(folderPath, cleanName);
  await fs.mkdir(projectPath);
  const date = details?.created_at || new Date().toISOString();
  insertProjectRecord({ id: crypto.randomUUID(), name: cleanName, path: projectPath, description: details?.description?.trim() || null, status: details?.status ?? "not-started", project_type: details?.project_type ?? "default", progress: 0, deadline: details?.deadline || null, created_at: date });
  return { name: cleanName, path: projectPath, templateWarning: null };
});


// ==========================
// LABELS AND PEOPLE
// ==========================

const getItemsForType = (type: "label" | "person") =>
  type === "label" ? labels : people;

const getProjectPath = (
  yearOrPath: string,
  month?: string,
  projectName?: string
) => {
  if (month && projectName) {
    return path.resolve(projectsRoot, yearOrPath, month, projectName);
  }
  return path.resolve(yearOrPath);
};

const isPathWithin = (rootPath: string, targetPath: string) => {
  const relativePath = path.relative(path.resolve(rootPath), path.resolve(targetPath));
  return relativePath === "" || (!path.isAbsolute(relativePath) && relativePath !== ".." && !relativePath.startsWith(`..${path.sep}`));
};

const isConfiguredProjectPath = (projectPath: string) =>
  [projectsRoot, recurringProjectsRoot].some(root => isPathWithin(root, projectPath));

const resolveProjectChildPath = (projectPath: string, relativePath: string) => {
  if (path.isAbsolute(relativePath)) {
    throw new Error("Project file paths must be relative to the selected project.");
  }
  const resolvedProjectPath = path.resolve(projectPath);
  const targetPath = path.resolve(resolvedProjectPath, relativePath);
  if (!isPathWithin(resolvedProjectPath, targetPath)) {
    throw new Error("That file is outside the selected project.");
  }
  return targetPath;
};

const getProjectTagKey = (
  yearOrPath: string,
  month?: string,
  projectName?: string
) => {
  if (month && projectName) {
    return path.resolve(projectsRoot, yearOrPath, month, projectName);
  }
  return path.resolve(yearOrPath);
};

const isSafeProjectName = (name: string) =>
  Boolean(name) &&
  name !== "." &&
  name !== ".." &&
  !name.includes("/") &&
  !name.includes("\\");

ipcMain.handle("get-directory-items", (_event, type: "label" | "person") =>
  getItemsForType(type)
);

ipcMain.handle(
  "create-directory-item",
  async (
    _event,
    type: "label" | "person",
    item: Omit<DirectoryItem, "id">
  ) => {
    const name = item.name.trim();

    if (!name) {
      throw new Error("A name is required.");
    }

    const newItem: DirectoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name,
      color: item.color,
    };

    getItemsForType(type).push(newItem);
    await saveSettings();

    return newItem;
  }
);

ipcMain.handle(
  "update-directory-item",
  async (_event, type: "label" | "person", item: DirectoryItem) => {
    const items = getItemsForType(type);
    const currentItem = items.find(entry => entry.id === item.id);

    if (!currentItem || !item.name.trim()) {
      throw new Error("The item could not be updated.");
    }

    currentItem.name = item.name.trim();
    currentItem.color = item.color;
    await saveSettings();

    return currentItem;
  }
);

ipcMain.handle(
  "delete-directory-item",
  async (_event, type: "label" | "person", id: string) => {
    if (type === "label") {
      labels = labels.filter(item => item.id !== id);
      Object.values(projectTags).forEach(tags => {
        tags.labelIds = tags.labelIds.filter(labelId => labelId !== id);
      });
    } else {
      people = people.filter(item => item.id !== id);
      Object.values(projectTags).forEach(tags => {
        tags.personIds = tags.personIds.filter(personId => personId !== id);
      });
    }

    await saveSettings();
  }
);

ipcMain.handle(
  "get-project-tags",
  (_event, yearOrPath: string, month?: string, projectName?: string) => {
    const key = getProjectTagKey(yearOrPath, month, projectName);
    return projectTags[key] || projectTags[path.normalize(key)] || { labelIds: [], personIds: [] };
  }
);

ipcMain.handle(
  "set-project-tags",
  async (
    _event,
    yearOrPath: string,
    month: string | ProjectTags,
    projectName?: string,
    tags?: ProjectTags
  ) => {
    let key: string;
    let targetTags: ProjectTags;
    if (typeof month === "string" && projectName !== undefined && tags !== undefined) {
      key = getProjectTagKey(yearOrPath, month, projectName);
      targetTags = tags;
    } else {
      key = getProjectTagKey(yearOrPath);
      targetTags = month as ProjectTags;
    }

    projectTags[key] = {
      labelIds: [...new Set(targetTags?.labelIds || [])],
      personIds: [...new Set(targetTags?.personIds || [])],
    };

    await saveSettings();
    return projectTags[key];
  }
);

ipcMain.handle(
  "get-project-notes",
  async (_event, yearOrPath: string, month?: string, projectName?: string) => {
    const projectPath = getProjectPath(yearOrPath, month, projectName);
    return getProjectNotesByPath(projectPath);
  }
);

ipcMain.handle("get-all-notes", async () => {
  const notes = getAllNotes();
  const projectMap = new Map(getAllProjectRecords().map(project => [project.id, project.name]));

  return notes.map(note => ({
    ...note,
    project_name: note.project_id ? (projectMap.get(note.project_id) ?? "Project") : "General",
  }));
});

ipcMain.handle("create-general-note", async (_event, title = "", content = "") =>
  createNoteRecord({ id: crypto.randomUUID(), project_id: null, title, content }));

ipcMain.handle(
  "create-note",
  async (
    _event,
    yearOrPath: string,
    month: string,
    projectName?: string,
    content?: string,
    title?: string
  ) => {
    let projectPath: string;
    let noteContent: string;
    let noteTitle: string;
    let projName: string;
    if (projectName !== undefined && content !== undefined) {
      projectPath = getProjectPath(yearOrPath, month, projectName);
      projName = projectName;
      noteContent = content ?? "";
      noteTitle = title ?? "";
    } else if (projectName !== undefined) {
      projectPath = getProjectPath(yearOrPath);
      projName = path.basename(projectPath);
      noteContent = month || "";
      noteTitle = projectName;
    } else {
      projectPath = getProjectPath(yearOrPath);
      projName = path.basename(projectPath);
      noteContent = month || "";
      noteTitle = "";
    }

    let project = getProjectRecordByPath(projectPath);

    if (!project) {
      project = {
        id: crypto.randomUUID(),
        name: projName,
        path: projectPath,
        description: null,
        status: null,
        project_type: "default",
        progress: 0,
        deadline: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      insertProjectRecord(project);
    }

    const noteId = crypto.randomUUID();
    return createNoteRecord({
      id: noteId,
      project_id: project.id,
      title: noteTitle,
      content: noteContent || "",
    });
  }
);

ipcMain.handle("update-note", async (_event, noteId: string, content: string, title?: string, projectId?: string | null) => {
  const updated = updateNoteRecord(noteId, {
    content,
    ...(title !== undefined ? { title } : {}),
    ...(projectId !== undefined ? { project_id: projectId } : {}),
  });

  if (!updated) {
    throw new Error("Note not found.");
  }
  return updated;
});

ipcMain.handle("delete-note", async (_event, noteId: string) => {
  deleteNoteRecord(noteId);
});

ipcMain.handle("update-attendance-breaks", async (_event, id: string, breaks: number[]) => {
  const updated = updateAttendanceBreaks(id, breaks);
  if (!updated) throw new Error("Attendance entry not found.");
  return getTodayAttendanceSummary();
});

ipcMain.handle("get-project-templates", () => getAllProjectTemplates());

ipcMain.handle("choose-template-file", async () => {
  const result = await dialog.showOpenDialog({ title: "Select template file", properties: ["openFile"] });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("save-project-template", async (_event, template: { id?: string; name: string; project_type: "graphics" | "document" | "code" | "presentation" | "video" | "image" | "default"; description?: string; source_file_path?: string | null }) => {
  if (!template.name.trim()) throw new Error("A template name is required.");
  return saveProjectTemplate(template);
});

ipcMain.handle("delete-project-template", async (_event, id: string) => { deleteProjectTemplate(id); });

ipcMain.handle(
  "rename-project",
  async (
    _event,
    yearOrPath: string,
    month: string,
    projectName?: string,
    nextProjectName?: string
  ) => {
    let currentPath: string;
    let nextName: string;
    let curKey: string;

    if (projectName !== undefined && nextProjectName !== undefined) {
      nextName = nextProjectName.trim();
      currentPath = getProjectPath(yearOrPath, month, projectName);
      curKey = getProjectTagKey(yearOrPath, month, projectName);
    } else {
      nextName = month.trim();
      currentPath = getProjectPath(yearOrPath);
      curKey = getProjectTagKey(yearOrPath);
    }

    if (!isSafeProjectName(nextName)) {
      throw new Error("Enter a valid project name.");
    }

    if (!isConfiguredProjectPath(currentPath)) throw new Error("The selected project is outside the configured project folders.");

    const nextPath = path.join(path.dirname(currentPath), nextName);
    const nextKey = path.resolve(nextPath);

    await fs.rename(currentPath, nextPath);
    updateProjectPath(currentPath, nextPath, nextName);

    if (projectTags[curKey]) {
      projectTags[nextKey] = projectTags[curKey];
      delete projectTags[curKey];
      await saveSettings();
    }

    return nextName;
  }
);

ipcMain.handle(
  "duplicate-project",
  async (
    _event,
    yearOrPath: string,
    month?: string,
    projectName?: string
  ) => {
    const currentPath = getProjectPath(yearOrPath, month, projectName);
    const currentProject = getProjectRecordByPath(currentPath);

    if (!currentProject) {
      throw new Error("Project metadata not found.");
    }

    const parentDir = path.dirname(currentPath);
    const getDuplicateName = async (name: string, index = 1): Promise<string> => {
      const suffix = index === 1 ? " Copy" : ` Copy ${index}`;
      const candidate = `${name}${suffix}`;
      const candidatePath = path.join(parentDir, candidate);
      if (await fs.stat(candidatePath).then(() => true).catch(() => false)) {
        return getDuplicateName(name, index + 1);
      }
      return candidate;
    };

    const nextName = await getDuplicateName(currentProject.name);
    const nextPath = path.join(parentDir, nextName);

    await fs.cp(currentPath, nextPath, { recursive: true });

    const duplicatedProject = {
      id: crypto.randomUUID(),
      name: nextName,
      path: nextPath,
      description: currentProject.description,
      status: currentProject.status,
      progress: currentProject.progress,
      deadline: currentProject.deadline,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    insertProjectRecord(duplicatedProject);

    const notes = getProjectNotesByPath(currentPath);
    for (const note of notes) {
      createNoteRecord({
        id: crypto.randomUUID(),
        project_id: duplicatedProject.id,
        content: note.content,
      });
    }

    const currentTagKey = getProjectTagKey(yearOrPath, month, projectName);
    const nextTagKey = path.resolve(nextPath);

    if (projectTags[currentTagKey]) {
      projectTags[nextTagKey] = projectTags[currentTagKey];
      await saveSettings();
    }

    return nextName;
  }
);

ipcMain.handle(
  "delete-project",
  async (_event, yearOrPath: string, month?: string, projectName?: string) => {
    const projectPath = getProjectPath(yearOrPath, month, projectName);
    if (!isConfiguredProjectPath(projectPath)) throw new Error("The selected project is outside the configured project folders.");

    await fs.rm(projectPath, { recursive: true, force: false });
    deleteProjectRecordByPath(projectPath);
    delete projectTags[getProjectTagKey(yearOrPath, month, projectName)];
    delete projectTags[path.resolve(projectPath)];
    await saveSettings();
  }
);


// ==========================
// GET PROJECT MONTHS
// ==========================

ipcMain.handle("get-project-months", async (_event, _year: string) => MONTH_NAMES);


// ==========================
// GET PROJECTS
// ==========================

ipcMain.handle("get-projects", async (_event, year: string, month: string) => {
  const monthPath = path.join(projectsRoot, year, month);

  try {
    const items = await fs.readdir(monthPath, {
      withFileTypes: true,
    });

    const projectPromises = items
      .filter(item => item.isDirectory())
      .map(async item => {
        const projectPath = getProjectPath(year, month, item.name);
        let project = getProjectRecordByPath(projectPath);
        let statDate: string | null = null;
        try {
          const stat = await fs.stat(projectPath);
          if (stat.birthtime && stat.birthtime.getTime() > 0) {
            statDate = stat.birthtime.toISOString();
          } else if (stat.mtime && stat.mtime.getTime() > 0) {
            statDate = stat.mtime.toISOString();
          }
        } catch {}

        if (!project) {
          const dateStr = statDate || new Date().toISOString();
          project = {
            id: crypto.randomUUID(),
            name: item.name,
            path: projectPath,
            description: null,
            status: null,
            project_type: "default",
            progress: 0,
            deadline: null,
            created_at: dateStr,
            updated_at: dateStr,
          };
          insertProjectRecord(project);
        } else if (statDate && (!project.created_at || project.created_at === project.updated_at)) {
          project = {
            ...project,
            created_at: project.created_at || statDate,
          };
        }
        return project;
      });

    const projects = await Promise.all(projectPromises);
    return projects.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
});

ipcMain.handle("get-dashboard-data", async () => {
  const allProjects = getAllProjectRecords();

  const existingProjects = (
    await Promise.all(
      allProjects.map(async project => {
        try {
          const stat = await fs.stat(project.path);
          return {
            ...project,
            created_at: project.created_at,
            updated_at: stat.mtime?.toISOString() || project.updated_at,
          };
        } catch {
          return null;
        }
      })
    )
  ).filter((p): p is NonNullable<typeof p> => p !== null);

  existingProjects.sort((a, b) => {
    const timeA = new Date(a.updated_at || a.created_at).getTime();
    const timeB = new Date(b.updated_at || b.created_at).getTime();
    return timeB - timeA;
  });

  const projectsWithFiles = await Promise.all(
    existingProjects.map(async (project, index) => {
      if (index >= 4) return { ...project, files: [] as string[] };
      try {
        const entries = await fs.readdir(project.path, { withFileTypes: true });
        const files = entries
          .filter(entry => entry.isFile())
          .map(entry => entry.name)
          .slice(0, 5);
        return { ...project, files };
      } catch {
        return { ...project, files: [] as string[] };
      }
    })
  );

  return {
    projects: projectsWithFiles,
    notes: getRecentNotes(3),
  };
});

ipcMain.handle("punch-in", async () => {
  punchInRecord();
  return getTodayAttendanceSummary();
});

ipcMain.handle("punch-out", async () => {
  punchOutRecord();
  return getTodayAttendanceSummary();
});

ipcMain.handle("get-attendance-data", async () => {
  return {
    today: getTodayAttendanceSummary(),
    monthly: getMonthlyAttendanceSummary(),
  };
});

ipcMain.handle("get-monthly-attendance", async (_event, year?: number, month?: number) => {
  return getMonthlyAttendanceSummary(year, month);
});

ipcMain.handle("create-attendance-record", async (_event, record: {
  date: string;
  punchIn?: string;
  punchOut?: string;
  attendanceType?: "regular" | "leave" | "holiday";
  breakDurations?: number[];
  halfDayPart?: "first" | "second" | null;
}) => createAttendanceRecord(record));

ipcMain.handle("update-attendance-record", async (_event, id: string, record: {
  date: string;
  punchIn?: string;
  punchOut?: string;
  attendanceType: "regular" | "leave" | "holiday";
  breakDurations?: number[];
  halfDayPart?: "first" | "second" | null;
  replaceDateRecords?: boolean;
}) => updateAttendanceRecord(id, record));

ipcMain.handle("delete-attendance-record", async (_event, id: string) => deleteAttendanceRecord(id));

ipcMain.handle(
  "update-project-details",
  async (
    _event,
    yearOrPath: string,
    month: string | {
      description: string;
      status: "not-started" | "in-progress" | "on-hold" | "cancelled" | "completed";
      project_type?: "graphics" | "document" | "code" | "presentation" | "video" | "image" | "default";
      deadline: string;
      created_at?: string;
    },
    projectName?: string | {
      description: string;
      status: "not-started" | "in-progress" | "on-hold" | "cancelled" | "completed";
      project_type?: "graphics" | "document" | "code" | "presentation" | "video" | "image" | "default";
      deadline: string;
      created_at?: string;
    },
    details?: {
      description: string;
      status: "not-started" | "in-progress" | "on-hold" | "cancelled" | "completed";
      project_type?: "graphics" | "document" | "code" | "presentation" | "video" | "image" | "default";
      deadline: string;
      created_at?: string;
    }
  ) => {
    let projectPath: string;
    let projectDetails: {
      description: string;
      status: "not-started" | "in-progress" | "on-hold" | "cancelled" | "completed";
      project_type?: "graphics" | "document" | "code" | "presentation" | "video" | "image" | "default";
      deadline: string;
      created_at?: string;
    };

    if (typeof month === "string" && typeof projectName === "string" && details !== undefined) {
      projectPath = getProjectPath(yearOrPath, month, projectName);
      projectDetails = details;
    } else {
      projectPath = getProjectPath(yearOrPath);
      projectDetails = (month as typeof projectDetails) || (projectName as typeof projectDetails);
    }

    const project = getProjectRecordByPath(projectPath);
    if (!project) throw new Error("Project metadata not found.");

    updateProjectRecord(projectPath, {
      description: projectDetails.description?.trim() || null,
      status: projectDetails.status,
      project_type: projectDetails.project_type,
      deadline: projectDetails.deadline || null,
      created_at: projectDetails.created_at || null,
    });
    return getProjectRecordByPath(projectPath);
  }
);

ipcMain.handle(
  "toggle-project-pin",
  async (_event, year: string, month: string, projectName: string) => {
    const projectPath = getProjectPath(year, month, projectName);
    return toggleProjectPin(projectPath);
  }
);

ipcMain.handle("toggle-project-pin-by-path", async (_event, projectPath: string) => {
  return toggleProjectPin(projectPath);
});

ipcMain.handle("get-pinned-projects", async () => {
  const allPinned = getPinnedProjectRecords();
  const existing = (
    await Promise.all(
      allPinned.map(async project => {
        try {
          const stat = await fs.stat(project.path);
          let updatedAt = project.updated_at;
          if (stat.mtime && stat.mtime.getTime() > 0) {
            updatedAt = stat.mtime.toISOString();
          }
          return {
            ...project,
            created_at: project.created_at,
            updated_at: updatedAt || project.updated_at,
          };
        } catch {
          return null;
        }
      })
    )
  ).filter((p): p is NonNullable<typeof p> => p !== null);

  return existing;
});

ipcMain.handle("get-recurring-projects", async () => {
  const recurringRoot = recurringProjectsRoot;

  try {
    const items = await fs.readdir(recurringRoot, { withFileTypes: true });

    const projectPromises = items
      .filter(item => item.isDirectory())
      .map(async item => {
        const projectPath = path.join(recurringRoot, item.name);
        let project = getProjectRecordByPath(projectPath);
        let statDate: string | null = null;
        try {
          const stat = await fs.stat(projectPath);
          if (stat.birthtime && stat.birthtime.getTime() > 0) {
            statDate = stat.birthtime.toISOString();
          } else if (stat.mtime && stat.mtime.getTime() > 0) {
            statDate = stat.mtime.toISOString();
          }
        } catch {}

        if (!project) {
          const dateStr = statDate || new Date().toISOString();
          project = {
            id: crypto.randomUUID(),
            name: item.name,
            path: projectPath,
            description: null,
            status: null,
            project_type: "default",
            progress: 0,
            deadline: null,
            created_at: dateStr,
            updated_at: dateStr,
          };
          insertProjectRecord(project);
        }

        return {
          ...project,
          created_at: project.created_at,
          updated_at: statDate || project.updated_at,
        };
      });

    const projects = await Promise.all(projectPromises);
    return projects.sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return [];
  }
});


// ==========================
// GET PROJECT CONTENTS
// ==========================

ipcMain.handle(
  "get-project-contents",
  async (_event, yearOrPath: string, month?: string, projectName?: string) => {
    const projectPath = getProjectPath(yearOrPath, month, projectName);

    const items = await fs.readdir(projectPath, {
      withFileTypes: true,
    });

    return items.map(item => ({
      name: item.name,
      type: item.isDirectory() ? "folder" : "file",
    }));
  }
);


// ==========================
// GET FOLDER CONTENTS
// ==========================

ipcMain.handle(
  "get-project-folder-contents",
  async (
    _event,
    yearOrPath: string,
    month: string,
    projectName?: string,
    folderName?: string
  ) => {
    let projectPath: string;
    let targetFolder: string;
    if (projectName !== undefined && folderName !== undefined) {
      projectPath = getProjectPath(yearOrPath, month, projectName);
      targetFolder = folderName;
    } else {
      projectPath = getProjectPath(yearOrPath);
      targetFolder = month;
    }

    const folderPath = path.join(projectPath, targetFolder);
    const items = await fs.readdir(folderPath, {
      withFileTypes: true,
    });

    return items.map(item => ({
      name: item.name,
      type: item.isDirectory() ? "folder" : "file",
    }));
  }
);


// ==========================
// OPEN PROJECT FILE
// ==========================

ipcMain.handle(
  "open-project-content",
  async (
    _event,
    yearOrPath: string,
    month: string,
    projectName?: string,
    relativePath?: string
  ) => {
    let projectPath: string;
    let relPath: string;
    if (projectName !== undefined && relativePath !== undefined) {
      projectPath = getProjectPath(yearOrPath, month, projectName);
      relPath = relativePath;
    } else {
      projectPath = getProjectPath(yearOrPath);
      relPath = month;
    }

    const resolvedProjectPath = path.resolve(projectPath);
    const targetPath = path.resolve(resolvedProjectPath, relPath);
    if (!isPathWithin(resolvedProjectPath, targetPath)) {
      throw new Error("That file is outside the selected project.");
    }

    if (!isConfiguredProjectPath(resolvedProjectPath)) {
      throw new Error("The selected project is outside the configured project folders.");
    }

    try {
      const [realProjectPath, realTargetPath] = await Promise.all([
        fs.realpath(resolvedProjectPath),
        fs.realpath(targetPath),
      ]);
      if (!isPathWithin(realProjectPath, realTargetPath)) {
        throw new Error("That file resolves outside the selected project.");
      }
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "ENOENT" || code === "ENOTDIR") {
        throw new Error("The selected file or folder no longer exists. Refresh the project and try again.");
      }
      if (code === "EACCES" || code === "EPERM") {
        throw new Error("Windows does not have permission to access this file or folder.");
      }
      throw error;
    }

    const openError = await shell.openPath(targetPath);

    if (openError) {
      throw new Error(openError);
    }
  }
);

ipcMain.handle("copy-project-path", (_event, projectPath: string) => {
  clipboard.writeText(projectPath);
});

ipcMain.handle("share-file", async (_event, filePath: string) => {
  if (process.platform !== "win32") {
    throw new Error("Microsoft Teams file sharing is only available on Windows.");
  }

  const targetPath = path.resolve(filePath);
  const isInAllowedRoot = [projectsRoot, recurringProjectsRoot].some(root => {
    const relativePath = path.relative(path.resolve(root), targetPath);
    return !relativePath.startsWith("..") && !path.isAbsolute(relativePath);
  });
  if (!isInAllowedRoot) {
    throw new Error("That file is outside the selected projects folder.");
  }

  const stats = await fs.stat(targetPath);
  if (!stats.isFile()) throw new Error("Only files can be shared through Teams.");

  const teamsUrl = `msteams://share?file=${encodeURIComponent(pathToFileURL(targetPath).toString())}`;
  await shell.openExternal(teamsUrl);
});

ipcMain.handle("create-project-folder", async (_event, projectPath: string, folderPath: string, folderName: string) => {
  const resolvedProjectPath = path.resolve(projectPath);
  if (!isConfiguredProjectPath(resolvedProjectPath)) {
    throw new Error("Invalid project path.");
  }

  const cleanName = folderName.trim();
  if (!cleanName || cleanName === "." || cleanName === ".." || /[\\/]/.test(cleanName)) {
    throw new Error("Enter a valid folder name.");
  }

  const targetParent = path.resolve(resolvedProjectPath, folderPath || "");
  const relativeParent = path.relative(resolvedProjectPath, targetParent);
  if (relativeParent.startsWith("..") || path.isAbsolute(relativeParent)) {
    throw new Error("Invalid destination folder.");
  }

  const parentStats = await fs.stat(targetParent);
  if (!parentStats.isDirectory()) throw new Error("The current folder is unavailable.");
  await fs.mkdir(path.join(targetParent, cleanName));
  return cleanName;
});

ipcMain.handle(
  "import-project-files",
  async (_event, projectPath: string, targetFolder: string, sourcePaths: string[]) => {
    const resolvedProjectPath = path.resolve(projectPath);
    if (!isConfiguredProjectPath(resolvedProjectPath)) {
      throw new Error("Invalid project path.");
    }

    const targetPath = path.resolve(resolvedProjectPath, targetFolder || "");
    const targetRelativePath = path.relative(resolvedProjectPath, targetPath);
    if (targetRelativePath.startsWith("..") || path.isAbsolute(targetRelativePath)) {
      throw new Error("Invalid destination folder.");
    }

    const targetStat = await fs.stat(targetPath);
    if (!targetStat.isDirectory()) throw new Error("Destination folder is unavailable.");

    const imported: string[] = [];
    const skipped: string[] = [];
    const seenDestinations = new Set<string>();

    for (const sourcePath of sourcePaths) {
      const resolvedSourcePath = path.resolve(sourcePath);
      const fileName = path.basename(resolvedSourcePath);
      const destinationPath = path.join(targetPath, fileName);

      if (!fileName || seenDestinations.has(destinationPath.toLowerCase()) || resolvedSourcePath === destinationPath) {
        skipped.push(fileName || sourcePath);
        continue;
      }
      seenDestinations.add(destinationPath.toLowerCase());

      let sourceStat;
      try {
        sourceStat = await fs.stat(resolvedSourcePath);
      } catch {
        skipped.push(fileName);
        continue;
      }
      if (!sourceStat.isFile()) {
        skipped.push(fileName);
        continue;
      }

      try {
        await fs.access(destinationPath);
        skipped.push(fileName);
        continue;
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code && code !== "ENOENT") throw error;
      }

      await fs.copyFile(resolvedSourcePath, destinationPath);
      imported.push(fileName);
    }

    return { imported, skipped };
  }
);

const fileDragIcon = nativeImage.createFromPath(
  path.resolve(__dirname, "../../src/icons/atomLogo.png")
);

ipcMain.on("start-file-drag", (event, projectPath: string, relativePaths: string[]) => {
  try {
    if (event.sender.isDestroyed() || !isConfiguredProjectPath(projectPath)) return;

    const resolvedProjectPath = path.resolve(projectPath);
    const realProjectPath = fsSync.realpathSync(resolvedProjectPath);
    const filePaths = [...new Set(relativePaths)]
      .map(relativePath => {
        if (typeof relativePath !== "string" || path.isAbsolute(relativePath)) {
          throw new Error("Drag paths must be relative to the selected project.");
        }

        const resolvedPath = path.resolve(resolvedProjectPath, relativePath);
        if (!isPathWithin(resolvedProjectPath, resolvedPath)) {
          throw new Error("A drag path points outside the selected project.");
        }

        const realPath = fsSync.realpathSync(resolvedPath);
        if (!isPathWithin(realProjectPath, realPath)) {
          throw new Error("A drag path resolves outside the selected project.");
        }

        const stats = fsSync.statSync(realPath);
        if (!stats.isFile() && !stats.isDirectory()) {
          throw new Error("Only files and folders can be dragged out of a project.");
        }
        return realPath;
      });

    if (filePaths.length === 0) return;
    event.sender.startDrag({
      file: filePaths[0],
      files: filePaths,
      icon: fileDragIcon,
    });
  } catch (error) {
    console.error("Could not start native file drag:", error);
  }
});

ipcMain.handle(
  "move-project-items",
  async (_event, projectPath: string, sourcePaths: string[], destinationFolder: string) => {
    if (!isConfiguredProjectPath(projectPath)) {
      throw new Error("The selected project is outside the configured project folders.");
    }

    const resolvedProjectPath = path.resolve(projectPath);
    const realProjectPath = await fs.realpath(resolvedProjectPath);
    if (typeof destinationFolder !== "string" || !path.isAbsolute(destinationFolder)) {
      throw new Error("The destination must be an absolute folder path.");
    }
    const resolvedDestination = path.resolve(destinationFolder);
    if (!isPathWithin(resolvedProjectPath, resolvedDestination)) {
      throw new Error("The destination folder is outside the selected project.");
    }
    const realDestination = await fs.realpath(resolvedDestination);
    if (!isPathWithin(realProjectPath, realDestination)) {
      throw new Error("The destination folder is outside the selected project.");
    }
    const destinationStats = await fs.stat(realDestination);
    if (!destinationStats.isDirectory()) {
      throw new Error("The destination is not a folder.");
    }

    const plannedMoves: Array<{ sourcePath: string; targetPath: string; name: string }> = [];
    const targetNames = new Set<string>();
    for (const sourceItemPath of [...new Set(sourcePaths)]) {
      if (typeof sourceItemPath !== "string" || !path.isAbsolute(sourceItemPath)) {
        throw new Error("Source items must be absolute file paths.");
      }
      const sourcePath = path.resolve(sourceItemPath);
      if (!isPathWithin(resolvedProjectPath, sourcePath)) {
        throw new Error("A source item is outside the selected project.");
      }
      const realSource = await fs.realpath(sourcePath);
      if (!isPathWithin(realProjectPath, realSource)) {
        throw new Error("A source item resolves outside the selected project.");
      }

      const sourceStats = await fs.stat(sourcePath);
      if (!sourceStats.isFile() && !sourceStats.isDirectory()) {
        throw new Error("Only files and folders can be moved.");
      }

      const realSourceParent = await fs.realpath(path.dirname(sourcePath));
      if (realSourceParent === realDestination) {
        continue;
      }

      if (sourceStats.isDirectory() && isPathWithin(realSource, realDestination)) {
        throw new Error(`Cannot move folder "${path.basename(sourcePath)}" into itself or one of its subfolders.`);
      }

      const name = path.basename(sourcePath);
      const targetPath = path.join(resolvedDestination, name);
      const targetKey = process.platform === "win32" ? name.toLowerCase() : name;
      if (targetNames.has(targetKey)) {
        throw new Error(`The destination already contains an item named "${name}".`);
      }
      targetNames.add(targetKey);

      try {
        await fs.lstat(targetPath);
        throw new Error(`The destination already contains an item named "${name}".`);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }

      plannedMoves.push({ sourcePath, targetPath, name });
    }

    for (const move of plannedMoves) {
      try {
        await fs.rename(move.sourcePath, move.targetPath);
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === "EEXIST" || code === "ENOTEMPTY") {
          throw new Error(`The destination already contains an item named "${move.name}".`);
        }
        throw error;
      }
    }

    return { moved: plannedMoves.length };
  }
);

ipcMain.handle(
  "rename-file",
  async (
    _event,
    yearOrPath: string,
    month: string,
    projectName: string,
    fileName?: string,
    nextFileName?: string
  ) => {
    let projectPath: string;
    let curFile: string;
    let nxtFile: string;
    if (fileName !== undefined && nextFileName !== undefined) {
      projectPath = getProjectPath(yearOrPath, month, projectName);
      curFile = fileName;
      nxtFile = nextFileName;
    } else {
      projectPath = getProjectPath(yearOrPath);
      curFile = month;
      nxtFile = projectName;
    }

    if (!isConfiguredProjectPath(projectPath)) throw new Error("The selected project is outside the configured project folders.");
    const currentPath = resolveProjectChildPath(projectPath, curFile);
    const nextPath = resolveProjectChildPath(projectPath, nxtFile);

    if (currentPath === nextPath) {
      return;
    }

    await fs.rename(currentPath, nextPath);
  }
);

ipcMain.handle(
  "duplicate-file",
  async (
    _event,
    yearOrPath: string,
    month: string,
    projectName?: string,
    fileName?: string
  ) => {
    let projectPath: string;
    let targetFileName: string;
    if (projectName !== undefined && fileName !== undefined) {
      projectPath = getProjectPath(yearOrPath, month, projectName);
      targetFileName = fileName;
    } else {
      projectPath = getProjectPath(yearOrPath);
      targetFileName = month;
    }

    if (!isConfiguredProjectPath(projectPath)) throw new Error("The selected project is outside the configured project folders.");
    const currentPath = resolveProjectChildPath(projectPath, targetFileName);
    const stat = await fs.stat(currentPath);
    const isDir = stat.isDirectory();
    const parentDir = path.dirname(currentPath);
    const ext = isDir ? "" : path.extname(targetFileName);
    const base = isDir ? path.basename(targetFileName) : path.basename(targetFileName, ext);
    let nextName = `${base} copy${ext}`;
    let nextPath = path.join(parentDir, nextName);
    let counter = 1;

    while (await fs.stat(nextPath).then(() => true).catch(() => false)) {
      nextName = `${base} copy ${counter}${ext}`;
      nextPath = path.join(parentDir, nextName);
      counter += 1;
    }

    if (isDir) {
      await fs.cp(currentPath, nextPath, { recursive: true });
    } else {
      await fs.copyFile(currentPath, nextPath);
    }
  }
);

ipcMain.handle(
  "delete-file",
  async (
    _event,
    yearOrPath: string,
    month: string,
    projectName?: string,
    fileName?: string
  ) => {
    let projectPath: string;
    let targetFileName: string;
    if (projectName !== undefined && fileName !== undefined) {
      projectPath = getProjectPath(yearOrPath, month, projectName);
      targetFileName = fileName;
    } else {
      projectPath = getProjectPath(yearOrPath);
      targetFileName = month;
    }

    if (!isConfiguredProjectPath(projectPath)) throw new Error("The selected project is outside the configured project folders.");
    const targetPath = resolveProjectChildPath(projectPath, targetFileName);
    await fs.rm(targetPath, { recursive: true, force: true });
  }
);


// ==========================
// PROJECT ROOT SETTINGS
// ==========================

ipcMain.handle("get-projects-root", () => projectsRoot);

ipcMain.handle("get-settings", () => ({ projectsRoot, recurringProjectsRoot, accentColor, userName, quotes, targetAttendanceSeconds, halfDayTargetSeconds }));

ipcMain.handle("set-attendance-preferences", async (_event, preferences: { userName: string; quotes: string[]; targetAttendanceSeconds: number; halfDayTargetSeconds: number }) => {
  userName = preferences.userName.trim() || "Deepak";
  quotes = preferences.quotes.filter(quote => quote.trim()).map(quote => quote.trim());
  targetAttendanceSeconds = Number.isFinite(preferences.targetAttendanceSeconds) && preferences.targetAttendanceSeconds > 0
    ? Math.round(preferences.targetAttendanceSeconds)
    : 8 * 3600;
  halfDayTargetSeconds = Number.isFinite(preferences.halfDayTargetSeconds) && preferences.halfDayTargetSeconds > 0
    ? Math.round(preferences.halfDayTargetSeconds)
    : 4 * 3600;
  setAttendanceTargetSeconds(targetAttendanceSeconds);
  setHalfDayTargetSeconds(halfDayTargetSeconds);
  await saveSettings();
  return { userName, quotes, targetAttendanceSeconds, halfDayTargetSeconds };
});

ipcMain.handle("choose-projects-root", async () => {
  const result = await dialog.showOpenDialog({
    title: "Choose main projects folder",
    properties: ["openDirectory", "createDirectory"],
  });

  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("set-projects-root", async (_event, newRoot: string) => {
  const root = newRoot.trim();
  const stats = await fs.stat(root);

  if (!stats.isDirectory()) {
    throw new Error("The selected path is not a folder.");
  }

  projectsRoot = root;
  await saveSettings();

  return projectsRoot;
});

ipcMain.handle("choose-recurring-projects-root", async () => {
  const result = await dialog.showOpenDialog({
    title: "Choose recurring projects folder",
    properties: ["openDirectory", "createDirectory"],
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("set-recurring-projects-root", async (_event, newRoot: string) => {
  const root = newRoot.trim();
  const stats = await fs.stat(root);
  if (!stats.isDirectory()) throw new Error("The selected path is not a folder.");
  recurringProjectsRoot = root;
  await saveSettings();
  return recurringProjectsRoot;
});

ipcMain.handle("set-accent-color", async (_event, color: string) => {
  if (!/^#[0-9a-f]{6}$/i.test(color)) throw new Error("Invalid accent color.");
  accentColor = color;
  await saveSettings();
  return accentColor;
});


// ==========================
// CREATE PROJECT
// ==========================

ipcMain.handle(
  "create-project",
  async (
    _event,
    year: string,
    month: string,
    projectName: string,
    details?: {
      description?: string;
      status?: "not-started" | "in-progress" | "on-hold" | "cancelled" | "completed";
      project_type?: "graphics" | "document" | "code" | "presentation" | "video" | "image" | "default";
      deadline?: string;
      created_at?: string;
      templateId?: string | null;
    }
  ) => {
    const cleanName = projectName.trim();

    if (!cleanName) {
      throw new Error("Project name cannot be empty.");
    }

    const monthPath = path.join(projectsRoot, year, month);
    const projectPath = path.join(monthPath, cleanName);

    await fs.mkdir(monthPath, { recursive: true });
    await fs.mkdir(projectPath);

    const projectId = crypto.randomUUID();
    insertProjectRecord({
      id: projectId,
      name: cleanName,
      path: projectPath,
      description: details?.description?.trim() || null,
      status: details?.status ?? "not-started",
      project_type: details?.project_type ?? "default",
      progress: 0,
      deadline: details?.deadline || null,
      created_at: details?.created_at || null,
    });

    let templateWarning: string | null = null;
    if (details?.templateId) {
      const template = getProjectTemplateById(details.templateId);
      if (template?.source_file_path) {
        try {
          const sourceStats = await fs.stat(template.source_file_path);
          if (!sourceStats.isFile()) throw new Error("The selected template source is not a file.");
          await fs.copyFile(template.source_file_path, path.join(projectPath, path.basename(template.source_file_path)));
        } catch (error) {
          templateWarning = `Project created, but the template file was not copied: ${template.source_file_path} is unavailable or could not be copied.`;
          console.warn("Template file copy skipped:", error);
        }
      }
    }

    console.log("Created project:", projectPath);

    return {
      name: cleanName,
      path: projectPath,
      templateWarning,
    };
  }
);


// ==========================
// APP READY
// ==========================

app.whenReady().then(async () => {
  await loadSettings();
  await initializeDatabase(app.getPath("userData"));

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});


// ==========================
// CLOSE
// ==========================

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

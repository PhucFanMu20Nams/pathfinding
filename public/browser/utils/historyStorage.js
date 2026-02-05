/**
 * History Storage Module
 * Manages run history in localStorage with 5-run limit
 * 
 * @module utils/historyStorage
 */

var STORAGE_KEY = "pfv:runs:v1";
var MAX_RUNS = 5;

function saveRun(run) {
    var runs = loadRuns();

    runs.unshift(run);

    if (runs.length > MAX_RUNS) {
        runs.length = MAX_RUNS;
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
        console.log("[History] Run saved:", run.id);
        console.log("[History] Total runs:", runs.length);
        return true;
    } catch (e) {
        console.error("[History] Failed to save:", e);
        return false;
    }
}

function loadRuns() {
    try {
        var stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("[History] Failed to load:", e);
        return [];
    }
}

function deleteRun(runId) {
    var runs = loadRuns();
    var filtered = [];

    for (var i = 0; i < runs.length; i++) {
        if (runs[i].id !== runId) {
            filtered.push(runs[i]);
        }
    }

    if (filtered.length === runs.length) {
        return false;
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
        console.log("[History] Run deleted:", runId);
        return true;
    } catch (e) {
        console.error("[History] Failed to delete:", e);
        return false;
    }
}

function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
    console.log("[History] All runs cleared");
}

function getRun(runId) {
    var runs = loadRuns();
    for (var i = 0; i < runs.length; i++) {
        if (runs[i].id === runId) {
            return runs[i];
        }
    }
    return null;
}

module.exports = {
    saveRun: saveRun,
    loadRuns: loadRuns,
    deleteRun: deleteRun,
    clearHistory: clearHistory,
    getRun: getRun,
    STORAGE_KEY: STORAGE_KEY,
    MAX_RUNS: MAX_RUNS
};

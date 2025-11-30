/**
 * Servant Stat Calculator
 * Calculates HP and ATK for FGO servants at any level (1-120) using growth curve data
 */

import { getStaticPath } from './routing.js';

/**
 * Cached experience/curve data indexed by type and level
 * Structure: { [type]: { [level]: curveValue } }
 */
let expDataCache = null;

/**
 * Loads and indexes the mstSvtExp.json data for efficient lookups
 * @returns {Promise<Object>} Indexed curve data
 */
async function loadExpData() {
    if (expDataCache) {
        return expDataCache;
    }

    try {
        let staticPath = getStaticPath();

        // Fix for GitHub Pages: Ensure correct path resolution when in subdirectories
        if (window.location.pathname.includes('/pages/') && (!staticPath || staticPath === '.')) {
            staticPath = '..';
        }

        const response = await fetch(`${staticPath}/static/data/mstSvtExp.json`);
        if (!response.ok) {
            throw new Error(`Failed to load exp data: ${response.statusText}`);
        }

        const expData = await response.json();

        // Index by type and level for O(1) lookups
        expDataCache = {};
        for (const entry of expData) {
            const { type, lv, curve } = entry;

            if (!expDataCache[type]) {
                expDataCache[type] = {};
            }

            expDataCache[type][lv] = curve;
        }

        return expDataCache;
    } catch (error) {
        console.error('Error loading exp data:', error);
        throw error;
    }
}

/**
 * Gets the curve modifier for a specific growth curve type and level
 * @param {number} growthCurve - The growth curve type (e.g., 5, 1, 14)
 * @param {number} level - The servant level (1-120)
 * @returns {number|null} The curve value, or null if not found
 */
function getCurveModifier(growthCurve, level) {
    if (!expDataCache) {
        console.error('Exp data not loaded. Call loadExpData() first.');
        return null;
    }

    // Validate level range
    if (level < 1 || level > 120) {
        console.error(`Invalid level: ${level}. Must be between 1 and 120.`);
        return null;
    }

    // Check if curve type exists
    if (!expDataCache[growthCurve]) {
        console.error(`Unknown growth curve type: ${growthCurve}`);
        return null;
    }

    // Get curve value for the level
    const curveValue = expDataCache[growthCurve][level];

    if (curveValue === undefined) {
        console.error(`No curve data for type ${growthCurve} at level ${level}`);
        return null;
    }

    return curveValue;
}

/**
 * Calculates a stat value using the FGO growth curve formula
 * @param {number} minStat - Base stat at level 1
 * @param {number} maxStat - Stat at natural max level (e.g., 90 for SSR)
 * @param {number} curveModifier - The curve value from mstSvtExp
 * @returns {number} The calculated stat value
 */
function calculateStat(minStat, maxStat, curveModifier) {
    // FGO formula: stat = minStat + (maxStat - minStat) * (curve / 1000)
    const statRange = maxStat - minStat;
    const multiplier = curveModifier / 1000;
    const calculatedStat = minStat + (statRange * multiplier);

    // Floor the result as FGO does
    return Math.floor(calculatedStat);
}

/**
 * Calculates HP and ATK for a servant at a specific level
 * @param {Object} servantData - Servant data object with min/max stats and growth curve
 * @param {number} servantData.hpMin - HP at level 1
 * @param {number} servantData.hpMax - HP at natural max level
 * @param {number} servantData.atkMin - ATK at level 1
 * @param {number} servantData.atkMax - ATK at natural max level
 * @param {number} servantData.growthCurve - Growth curve type
 * @param {number} level - Target level (1-120)
 * @returns {Object|null} Object with hp and atk values, or null on error
 */
function calculateServantStats(servantData, level) {
    // Validate input
    if (!servantData || typeof servantData !== 'object') {
        console.error('Invalid servant data provided');
        return null;
    }

    const { hpMin, hpMax, atkMin, atkMax, growthCurve } = servantData;

    // Validate required fields
    if (hpMin === undefined || hpMax === undefined ||
        atkMin === undefined || atkMax === undefined ||
        growthCurve === undefined) {
        console.error('Servant data missing required fields (hpMin, hpMax, atkMin, atkMax, growthCurve)');
        return null;
    }

    // Validate level
    if (!Number.isInteger(level) || level < 1 || level > 120) {
        console.error(`Invalid level: ${level}. Must be an integer between 1 and 120.`);
        return null;
    }

    // Get curve modifier
    const curveModifier = getCurveModifier(growthCurve, level);

    if (curveModifier === null) {
        return null;
    }

    // Calculate stats
    const hp = calculateStat(hpMin, hpMax, curveModifier);
    const atk = calculateStat(atkMin, atkMax, curveModifier);

    return { hp, atk };
}

/**
 * Calculates stats for multiple levels at once (useful for level progression display)
 * @param {Object} servantData - Servant data object
 * @param {Array<number>} levels - Array of levels to calculate
 * @returns {Array<Object>} Array of { level, hp, atk } objects
 */
function calculateStatsForLevels(servantData, levels) {
    return levels.map(level => {
        const stats = calculateServantStats(servantData, level);
        return stats ? { level, ...stats } : { level, hp: null, atk: null };
    });
}

// Export functions
export {
    loadExpData,
    getCurveModifier,
    calculateStat,
    calculateServantStats,
    calculateStatsForLevels
};

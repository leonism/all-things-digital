/**
 * Search Logger Utility
 * Captures search analytics data including user behavior, device info, and performance metrics
 */

/**
 * Get comprehensive device and browser information
 */
function getDeviceInfo() {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const language = navigator.language;
  const cookieEnabled = navigator.cookieEnabled;
  const onLine = navigator.onLine;
  
  // Screen information
  const screen = {
    width: window.screen.width,
    height: window.screen.height,
    availWidth: window.screen.availWidth,
    availHeight: window.screen.availHeight,
    colorDepth: window.screen.colorDepth,
    pixelDepth: window.screen.pixelDepth
  };
  
  // Viewport information
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
    devicePixelRatio: window.devicePixelRatio || 1
  };
  
  // Browser detection
  const getBrowserInfo = () => {
    const browsers = {
      chrome: /Chrome\/([\d.]+)/.exec(userAgent),
      firefox: /Firefox\/([\d.]+)/.exec(userAgent),
      safari: /Safari\/([\d.]+)/.exec(userAgent),
      edge: /Edg\/([\d.]+)/.exec(userAgent),
      opera: /Opera\/([\d.]+)/.exec(userAgent)
    };
    
    for (const [name, match] of Object.entries(browsers)) {
      if (match) {
        return { name, version: match[1] };
      }
    }
    return { name: 'unknown', version: 'unknown' };
  };
  
  // OS detection
  const getOSInfo = () => {
    const os = {
      windows: /Windows NT ([\d.]+)/.exec(userAgent),
      mac: /Mac OS X ([\d._]+)/.exec(userAgent),
      linux: /Linux/.test(userAgent),
      android: /Android ([\d.]+)/.exec(userAgent),
      ios: /OS ([\d_]+)/.exec(userAgent)
    };
    
    for (const [name, match] of Object.entries(os)) {
      if (match) {
        const version = Array.isArray(match) ? match[1] : 'unknown';
        return { name, version: version.replace(/_/g, '.') };
      }
    }
    return { name: 'unknown', version: 'unknown' };
  };
  
  // Device type detection
  const getDeviceType = () => {
    if (/Mobi|Android/i.test(userAgent)) return 'mobile';
    if (/Tablet|iPad/i.test(userAgent)) return 'tablet';
    return 'desktop';
  };
  
  return {
    userAgent,
    platform,
    language,
    cookieEnabled,
    onLine,
    screen,
    viewport,
    browser: getBrowserInfo(),
    os: getOSInfo(),
    deviceType: getDeviceType(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString()
  };
}

/**
 * Generate a unique session ID
 */
function generateSessionId() {
  return 'search_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Get or create session ID
 */
function getSessionId() {
  let sessionId = sessionStorage.getItem('search_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('search_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Log search event to local storage and optionally to server
 */
export function logSearchEvent(eventData) {
  const logEntry = {
    id: generateSessionId(),
    sessionId: getSessionId(),
    timestamp: new Date().toISOString(),
    deviceInfo: getDeviceInfo(),
    ...eventData
  };
  
  // Store in localStorage for persistence
  try {
    const existingLogs = JSON.parse(localStorage.getItem('search_logs') || '[]');
    existingLogs.push(logEntry);
    
    // Keep only last 1000 entries to prevent storage overflow
    if (existingLogs.length > 1000) {
      existingLogs.splice(0, existingLogs.length - 1000);
    }
    
    localStorage.setItem('search_logs', JSON.stringify(existingLogs));
    
    // Also log to console in development
    if (import.meta.env.DEV) {
      console.log('Search Event Logged:', logEntry);
    }
  } catch (error) {
    console.warn('Failed to log search event:', error);
  }
  
  return logEntry;
}

/**
 * Log search query with performance metrics
 */
export function logSearchQuery({
  query,
  resultsCount,
  searchTime,
  selectedResult = null,
  searchType = 'instant', // 'instant', 'manual', 'suggestion'
  filters = {},
  resultCategories = []
}) {
  return logSearchEvent({
    type: 'search_query',
    query: query.trim(),
    queryLength: query.trim().length,
    resultsCount,
    searchTime,
    selectedResult,
    searchType,
    filters,
    resultCategories,
    hasResults: resultsCount > 0
  });
}

/**
 * Log search result interaction
 */
export function logSearchInteraction({
  query,
  resultSlug,
  resultTitle,
  resultCategory,
  resultPosition,
  interactionType = 'click', // 'click', 'hover', 'keyboard_select'
  timeToInteraction
}) {
  return logSearchEvent({
    type: 'search_interaction',
    query: query.trim(),
    resultSlug,
    resultTitle,
    resultCategory,
    resultPosition,
    interactionType,
    timeToInteraction
  });
}

/**
 * Log search modal events
 */
export function logSearchModalEvent({
  action, // 'open', 'close', 'escape', 'outside_click'
  query = '',
  timeOpen = 0,
  searchCount = 0
}) {
  return logSearchEvent({
    type: 'search_modal',
    action,
    query: query.trim(),
    timeOpen,
    searchCount
  });
}

/**
 * Get search analytics data
 */
export function getSearchAnalytics() {
  try {
    const logs = JSON.parse(localStorage.getItem('search_logs') || '[]');
    
    const analytics = {
      totalSearches: logs.filter(log => log.type === 'search_query').length,
      totalInteractions: logs.filter(log => log.type === 'search_interaction').length,
      totalModalEvents: logs.filter(log => log.type === 'search_modal').length,
      averageSearchTime: 0,
      popularQueries: {},
      popularCategories: {},
      deviceBreakdown: {},
      browserBreakdown: {},
      osBreakdown: {},
      searchSuccessRate: 0,
      timeRange: {
        start: null,
        end: null
      }
    };
    
    if (logs.length === 0) return analytics;
    
    // Calculate time range
    const timestamps = logs.map(log => new Date(log.timestamp));
    analytics.timeRange.start = new Date(Math.min(...timestamps)).toISOString();
    analytics.timeRange.end = new Date(Math.max(...timestamps)).toISOString();
    
    // Process search queries
    const searchQueries = logs.filter(log => log.type === 'search_query');
    
    if (searchQueries.length > 0) {
      // Average search time
      const totalSearchTime = searchQueries.reduce((sum, log) => sum + (log.searchTime || 0), 0);
      analytics.averageSearchTime = totalSearchTime / searchQueries.length;
      
      // Popular queries
      searchQueries.forEach(log => {
        const query = log.query.toLowerCase();
        analytics.popularQueries[query] = (analytics.popularQueries[query] || 0) + 1;
      });
      
      // Popular categories
      searchQueries.forEach(log => {
        if (log.resultCategories) {
          log.resultCategories.forEach(category => {
            analytics.popularCategories[category] = (analytics.popularCategories[category] || 0) + 1;
          });
        }
      });
      
      // Search success rate
      const successfulSearches = searchQueries.filter(log => log.hasResults).length;
      analytics.searchSuccessRate = (successfulSearches / searchQueries.length) * 100;
    }
    
    // Device/Browser/OS breakdown
    logs.forEach(log => {
      if (log.deviceInfo) {
        const deviceType = log.deviceInfo.deviceType;
        const browser = log.deviceInfo.browser?.name;
        const os = log.deviceInfo.os?.name;
        
        analytics.deviceBreakdown[deviceType] = (analytics.deviceBreakdown[deviceType] || 0) + 1;
        analytics.browserBreakdown[browser] = (analytics.browserBreakdown[browser] || 0) + 1;
        analytics.osBreakdown[os] = (analytics.osBreakdown[os] || 0) + 1;
      }
    });
    
    return analytics;
  } catch (error) {
    console.warn('Failed to get search analytics:', error);
    return null;
  }
}

/**
 * Export search logs as JSON file
 */
export function exportSearchLogs() {
  try {
    const logs = JSON.parse(localStorage.getItem('search_logs') || '[]');
    const analytics = getSearchAnalytics();
    
    const exportData = {
      exportDate: new Date().toISOString(),
      analytics,
      logs
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `search-logs-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Failed to export search logs:', error);
    return false;
  }
}

/**
 * Clear search logs
 */
export function clearSearchLogs() {
  try {
    localStorage.removeItem('search_logs');
    sessionStorage.removeItem('search_session_id');
    return true;
  } catch (error) {
    console.warn('Failed to clear search logs:', error);
    return false;
  }
}
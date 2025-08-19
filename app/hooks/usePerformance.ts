'use client';

import { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  mountTime: number;
  updateCount: number;
  lastUpdate: number;
}

interface UsePerformanceOptions {
  componentName?: string;
  trackRenders?: boolean;
  trackMounts?: boolean;
  trackUpdates?: boolean;
  logToConsole?: boolean;
}

export function usePerformance(options: UsePerformanceOptions = {}) {
  const {
    componentName = 'Component',
    trackRenders = true,
    trackMounts = true,
    trackUpdates = true,
    logToConsole = process.env.NODE_ENV === 'development'
  } = options;

  const metricsRef = useRef<PerformanceMetrics>({
    renderTime: 0,
    mountTime: 0,
    updateCount: 0,
    lastUpdate: 0
  });

  const startTimeRef = useRef<number>(0);
  const mountTimeRef = useRef<number>(0);

  // Track component mount
  useEffect(() => {
    if (trackMounts) {
      mountTimeRef.current = performance.now();
      metricsRef.current.mountTime = mountTimeRef.current;
      
      if (logToConsole) {
        console.log(`🚀 ${componentName} mounted in ${metricsRef.current.mountTime.toFixed(2)}ms`);
      }
    }
  }, [componentName, trackMounts, logToConsole]);

  // Track component updates
  useEffect(() => {
    if (trackUpdates) {
      const now = performance.now();
      metricsRef.current.updateCount++;
      metricsRef.current.lastUpdate = now;
      
      if (logToConsole) {
        console.log(`🔄 ${componentName} updated (${metricsRef.current.updateCount} times)`);
      }
    }
  });

  // Track render performance
  const trackRender = useCallback(() => {
    if (trackRenders) {
      startTimeRef.current = performance.now();
    }
  }, [trackRenders]);

  const endRender = useCallback(() => {
    if (trackRenders) {
      const endTime = performance.now();
      metricsRef.current.renderTime = endTime - startTimeRef.current;
      
      if (logToConsole && metricsRef.current.renderTime > 16) {
        console.warn(`⚠️ ${componentName} render took ${metricsRef.current.renderTime.toFixed(2)}ms (target: <16ms)`);
      }
    }
  }, [componentName, trackRenders, logToConsole]);

  // Track user interactions
  const trackInteraction = useCallback((action: string, data?: unknown) => {
    if (logToConsole) {
      console.log(`👆 ${componentName} interaction: ${action}`, data);
    }
    
    // You could send this to analytics here
    // analytics.track('component_interaction', { component: componentName, action, data, timestamp: performance.now() });
  }, [componentName, logToConsole]);

  // Get current metrics
  const getMetrics = useCallback(() => {
    return { ...metricsRef.current };
  }, []);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      renderTime: 0,
      mountTime: 0,
      updateCount: 0,
      lastUpdate: 0
    };
  }, []);

  // Performance monitoring for specific operations
  const measureOperation = useCallback(async <T>(
    operationName: string,
    operation: () => Promise<T> | T
  ): Promise<T> => {
    const start = performance.now();
    
    try {
      const result = await operation();
      const end = performance.now();
      const duration = end - start;
      
      if (logToConsole) {
        console.log(`⚡ ${componentName} ${operationName} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      
      if (logToConsole) {
        console.error(`❌ ${componentName} ${operationName} failed after ${duration.toFixed(2)}ms:`, error);
      }
      
      throw error;
    }
  }, [componentName, logToConsole]);

  // Track memory usage (if available)
  const getMemoryInfo = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as Performance & { memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      return {
        usedJSHeapSize: formatBytes(memory.usedJSHeapSize),
        totalJSHeapSize: formatBytes(memory.totalJSHeapSize),
        jsHeapSizeLimit: formatBytes(memory.jsHeapSizeLimit),
        usage: `${((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(1)}%`
      };
    }
    return null;
  }, []);

  // Track network performance
  const trackNetworkRequest = useCallback(async <T>(
    requestName: string,
    request: () => Promise<T>
  ): Promise<T> => {
    const start = performance.now();
    
    try {
      const result = await request();
      const end = performance.now();
      const duration = end - start;
      
      if (logToConsole) {
        console.log(`🌐 ${componentName} ${requestName} completed in ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const end = performance.now();
      const duration = end - start;
      
      if (logToConsole) {
        console.error(`🌐 ${componentName} ${requestName} failed after ${duration.toFixed(2)}ms:`, error);
      }
      
      throw error;
    }
  }, [componentName, logToConsole]);

  return {
    trackRender,
    endRender,
    trackInteraction,
    trackNetworkRequest,
    measureOperation,
    getMetrics,
    resetMetrics,
    getMemoryInfo
  };
}

// Utility function to format bytes
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Hook for tracking scroll performance
export function useScrollPerformance(componentName: string = 'Component') {
  const scrollCountRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  
  const trackScroll = useCallback(() => {
    const now = performance.now();
    scrollCountRef.current++;
    
    // Throttle logging to avoid spam
    if (now - lastScrollTimeRef.current > 1000) {
      console.log(`📜 ${componentName} scroll count: ${scrollCountRef.current}`);
      lastScrollTimeRef.current = now;
    }
  }, [componentName]);
  
  return { trackScroll, scrollCount: scrollCountRef.current };
}

// Hook for tracking resize performance
export function useResizePerformance(componentName: string = 'Component') {
  const resizeCountRef = useRef(0);
  const lastResizeTimeRef = useRef(0);
  
  const trackResize = useCallback(() => {
    const now = performance.now();
    resizeCountRef.current++;
    
    // Throttle logging to avoid spam
    if (now - lastResizeTimeRef.current > 1000) {
      console.log(`📏 ${componentName} resize count: ${resizeCountRef.current}`);
      lastResizeTimeRef.current = now;
    }
  }, [componentName]);
  
  return { trackResize, resizeCount: resizeCountRef.current };
}

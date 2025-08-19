// Performance optimization utilities

// Debounce function for search inputs and API calls
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function for scroll events and frequent updates
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
): IntersectionObserver {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };
  
  return new IntersectionObserver(callback, defaultOptions);
}

// Image lazy loading utility
export function lazyLoadImage(
  imgElement: HTMLImageElement,
  src: string,
  placeholder?: string
): void {
  if (placeholder) {
    imgElement.src = placeholder;
  }
  
  const observer = createIntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        imgElement.src = src;
        imgElement.classList.remove('lazy');
        observer.unobserve(imgElement);
      }
    });
  });
  
  observer.observe(imgElement);
}

// Virtual scrolling helper for large lists
export function createVirtualScroller<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  scrollTop: number
): {
  startIndex: number;
  endIndex: number;
  visibleItems: T[];
  totalHeight: number;
} {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount, items.length);
  
  return {
    startIndex,
    endIndex,
    visibleItems: items.slice(startIndex, endIndex),
    totalHeight: items.length * itemHeight,
  };
}

// Memory management for large datasets
export function createDataChunker<T>(
  data: T[],
  chunkSize: number = 100
): T[][] {
  const chunks: T[][] = [];
  
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  
  return chunks;
}

// Cache management utility
export class SimpleCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;
  
  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }
  
  get(key: K): V | undefined {
    return this.cache.get(key);
  }
  
  set(key: K, value: V): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }
  
  has(key: K): boolean {
    return this.cache.has(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  size(): number {
    return this.cache.size;
  }
}

// Performance monitoring
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  console.log(`${name} took ${(end - start).toFixed(2)}ms`);
  return result;
}

// Async performance monitoring
export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  
  console.log(`${name} took ${(end - start).toFixed(2)}ms`);
  return result;
}

// Bundle size optimization helper
// Note: This function should be used in React component files, not in utility files
// export function createLazyComponent<T extends React.ComponentType<unknown>>(
//   importFunc: () => Promise<{ default: T }>
// ): React.LazyExoticComponent<T> {
//   return React.lazy(() => 
//     importFunc().then(module => ({
//       default: module.default
//     }))
//   );
// }

// Preload critical resources
export function preloadResource(href: string, as: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
}

// Prefetch non-critical resources
export function prefetchResource(href: string): void {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

// Service Worker registration helper
export async function registerServiceWorker(
  scriptURL: string,
  options?: RegistrationOptions
): Promise<ServiceWorkerRegistration | null> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(scriptURL, options);
      console.log('Service Worker registered successfully:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
}

// Web Vitals monitoring
export function monitorWebVitals(): void {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // Monitor Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // Monitor First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if ('processingStart' in entry && 'startTime' in entry) {
          const fidEntry = entry as PerformanceEntry & { processingStart: number; startTime: number };
          console.log('FID:', fidEntry.processingStart - fidEntry.startTime);
        }
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    
    // Monitor Cumulative Layout Shift (CLS)
    const clsObserver = new PerformanceObserver((list) => {
      let cls = 0;
      list.getEntries().forEach((entry: PerformanceEntry) => {
        if ('hadRecentInput' in entry && 'value' in entry) {
          const clsEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
          if (!clsEntry.hadRecentInput) {
            cls += clsEntry.value || 0;
          }
        }
      });
      console.log('CLS:', cls);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
}

"use client";
import { useEffect, useState } from "react";

export default function ClientInfo() {
  const [data, setData] = useState<any>(null);

  const serializeObject = (obj: any, depth = 0, parentKey = ''): any => {
    if (depth > 3) return '[Max depth reached]';
    if (obj === null) return null;
    if (typeof obj === 'function') return '[Function]';
    if (typeof obj !== 'object') return obj;
    
    const result: any = {};
    for (const key in obj) {
      try {
        let value = obj[key];
        if (parentKey === 'timing' && typeof value === 'number' && value > 0) {
          value = `${value} (${new Date(value).toISOString()})`;
        }
        result[key] = serializeObject(value, depth + 1, key);
      } catch {
        result[key] = '[Error accessing property]';
      }
    }
    return result;
  };

  useEffect(() => {
    const clientData: any = {};
    
    // Navigator data
    const navigatorData: any = {};
    for (const key in navigator) {
      try {
        if (key === 'mimeTypes' || key === 'plugins') {
          navigatorData[key] = '[Object]';
        } else {
          navigatorData[key] = serializeObject((navigator as any)[key]);
       }
      } catch (e) {
        navigatorData[key] = '[Error accessing property]';
      }
    }
    
    // Performance data
    const performanceData: any = {};
    for (const key in performance) {
      try {
        performanceData[key] = serializeObject((performance as any)[key], 0, key);
      } catch (e) {
        performanceData[key] = '[Error accessing property]';
      }
    }
    
    clientData.navigator = navigatorData;
    clientData.performance = performanceData;
    setData(clientData);
  }, []);

  if (!data) return null;
  return (
    <div>
      <h3>Client data (navigator and performance objects)</h3>
      <pre><code>{JSON.stringify(data, null, 2)}</code></pre>
    </div>
  );
}

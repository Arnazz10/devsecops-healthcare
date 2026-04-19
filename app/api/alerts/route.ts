import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Periodic security events
      const interval = setInterval(() => {
        const eventTypes = [
          { type: 'PHI Access Anomaly', severity: 'HIGH', service: 'patient-records-api' },
          { type: 'Brute Force Attempt', severity: 'CRITICAL', service: 'auth-gateway' },
          { type: 'Unexpected Outbound Connection', severity: 'MEDIUM', service: 'imaging-processor' },
          { type: 'Privilege Escalation', severity: 'CRITICAL', service: 'k8s-node-01' },
          { type: 'CVE Exploit Attempt', severity: 'HIGH', service: 'public-api-gateway' }
        ];

        const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const alert = {
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          description: `Alert: ${randomEvent.type} detected in ${randomEvent.service}`,
          status: 'Open',
          ...randomEvent
        };

        sendEvent(alert);
      }, 8000);

      // Keep alive
      const keepAlive = setInterval(() => {
        controller.enqueue(encoder.encode(': keepalive\n\n'));
      }, 15000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        clearInterval(keepAlive);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

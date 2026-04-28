import http from "node:http";
import net from "node:net";

const listenPort = Number.parseInt(process.env.GALLERY_PORT ?? "3001", 10);
const targetPort = Number.parseInt(process.env.MAIN_PORT ?? "3000", 10);
const targetHost = "127.0.0.1";
const galleryHost = `localhost:${listenPort}`;

const server = http.createServer((request, response) => {
  const proxyRequest = http.request(
    {
      hostname: targetHost,
      port: targetPort,
      method: request.method,
      path: request.url,
      headers: {
        ...request.headers,
        host: galleryHost,
      },
    },
    (proxyResponse) => {
      response.writeHead(proxyResponse.statusCode ?? 500, proxyResponse.headers);
      proxyResponse.pipe(response);
    },
  );

  proxyRequest.on("error", () => {
    response.writeHead(502, { "content-type": "text/plain; charset=utf-8" });
    response.end(`Gallery proxy could not reach http://localhost:${targetPort}. Start npm run dev first.`);
  });

  request.pipe(proxyRequest);
});

server.on("upgrade", (request, socket, head) => {
  const upstream = net.connect(targetPort, targetHost, () => {
    const headers = {
      ...request.headers,
      host: galleryHost,
    };

    const rawRequest = [
      `${request.method} ${request.url} HTTP/${request.httpVersion}`,
      ...Object.entries(headers).map(([key, value]) => `${key}: ${value}`),
      "",
      "",
    ].join("\r\n");

    upstream.write(rawRequest);
    if (head.length > 0) {
      upstream.write(head);
    }

    socket.pipe(upstream);
    upstream.pipe(socket);
  });

  upstream.on("error", () => socket.destroy());
});

server.listen(listenPort, () => {
  console.log(`Common Area gallery proxy listening at http://localhost:${listenPort}`);
  console.log(`Forwarding to http://localhost:${targetPort} with Host: ${galleryHost}`);
});

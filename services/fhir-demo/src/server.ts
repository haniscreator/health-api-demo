import app from './app';

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`[Server] FHIR Demo API running at http://${HOST}:${PORT}`);
  console.log(`[Server] Health Check: http://${HOST}:${PORT}/health`);
});

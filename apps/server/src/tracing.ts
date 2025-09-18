import tracer from 'dd-trace';

tracer.init({
  env: process.env.DD_ENV || 'production',
  service: process.env.DD_SERVICE || 'ralli-backend',
  version: process.env.DD_VERSION || '1.0.0',
  logInjection: true,
  runtimeMetrics: true,
});

export default tracer;

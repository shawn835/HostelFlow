
export default defineLazyEventHandler(() => {
  // It must return an event handler (or a dynamic import)
  return defineEventHandler(() => {
    return {
      status: "ok",
      service: "HostelFlow API",
      timestamp: new Date().toISOString(),
    };
  });
});

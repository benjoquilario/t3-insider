const reloadSession = () => {
  const event = new Event("visibilitychange");
  typeof window !== "undefined" && document.dispatchEvent(event);
};

export default reloadSession;

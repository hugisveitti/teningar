export const config = {
  // ENDPOINT: "http://127.0.0.1:8000",
  ENDPOINT:
    process.env.NODE_ENV === "production"
      ? window.location.hostname
      : "localhost:8000",
};

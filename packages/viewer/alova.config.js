export default {
  generator: [
    {
      input: "http://localhost:8000/api/docs/swagger.json",
      output: "src/api-alova",
      platform: "swagger",
    },
  ],
};

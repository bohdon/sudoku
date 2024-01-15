module.exports = {
  apps: [
    {
      name: "sudoku",
      script: "npm",
      args: "run prod",
      instances: "1",
      exec_mode: "fork",
    },
  ],
};

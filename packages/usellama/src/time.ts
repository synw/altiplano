
function formatHrtime(endTime: [number, number], precision = 2): number {
  const seconds = endTime[0];
  const milliseconds = endTime[1] / 1000000;
  return parseFloat(parseFloat((`${seconds}.${milliseconds}`)).toFixed(precision))
}

export { formatHrtime }


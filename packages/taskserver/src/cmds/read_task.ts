import YAML from 'yaml'
import { default as fs } from "fs";
import { default as path } from "path";
import { taskFromConf } from '../task.js';
import { LmTask } from '../interfaces.js';

/**
 * Reads all files in a directory that have a .yml extension and returns an array of their filenames.
 * @param {string} dir - The path to the directory containing the yaml files.
 * @returns {Array<string>} An array of filenames with a .yml extension found in the specified directory.
 */
function readTasksDir(dir: string): Array<string> {
  const tasks = new Array<string>();
  fs.readdirSync(dir).forEach((filename) => {
    const filepath = path.join(dir, filename);
    const isDir = fs.statSync(filepath).isDirectory();
    if (!isDir) {
      if (filename.endsWith(".yml")) {
        tasks.push(filename)
      }
    }
  });
  return tasks
}

function readTask(taskpath: string): { found: boolean, task: LmTask } {
  if (!fs.existsSync(taskpath)) {
    return { task: {} as LmTask, found: false }
  }
  const file = fs.readFileSync(taskpath, 'utf8');
  const data = YAML.parse(file);
  const task = taskFromConf(data);
  return { task: task, found: false }
}

export { readTasksDir, readTask }
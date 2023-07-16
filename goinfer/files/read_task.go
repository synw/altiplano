package files

import (
	"fmt"
	"io"
	"os"

	"gopkg.in/yaml.v3"

	"github.com/synw/altiplano/goinfer/lm"
	"github.com/synw/altiplano/goinfer/state"
)

func keyExists(m map[string]interface{}, key string) bool {
	_, ok := m[key]
	return ok
}

func convertTask(m map[string]interface{}) (lm.Task, error) {
	task := lm.Task{
		Name:     m["name"].(string),
		Model:    m["model"].(string),
		Template: m["template"].(string),
	}
	if keyExists(m, "modelConf") {
		mc := lm.ModelConf{}
		rmc := m["modelConf"].([]interface{})
		for _, param := range rmc {
			mp := param.(map[string]interface{})
			hasModelConf := false
			for k, v := range mp {
				if k == "ctx" {
					hasModelConf = true
					mc.Ctx = v.(int)
				}
			}
			if hasModelConf {
				task.ModelConf = mc
			}
		}
		//ip := lm.DefaultInferenceParams
		if keyExists(m, "inferParams") {
			rip := m["inferParams"].([]interface{})
			for _, param := range rip {
				ipr := param.(map[string]interface{})
				for k, v := range ipr {
					fmt.Println("P", k, v)
				}
			}
		}
	}
	return task, nil
}

func ReadTask(path string) (map[string]interface{}, error) {
	//var task lm.Task
	m := make(map[string]interface{})
	//p := filepath.Join(state.TasksDir, path)
	p := state.TasksDir + "/" + path
	fmt.Println("Opening", p)
	file, err := os.Open(p)
	if err != nil {
		return m, err
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		return m, err
	}
	err = yaml.Unmarshal([]byte(data), &m)
	if err != nil {
		return m, err
	}

	t, err := convertTask(m)
	if err != nil {
		return m, err
	}
	fmt.Println("Task:", t)
	return m, nil
}

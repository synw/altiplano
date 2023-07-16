package server

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/synw/altiplano/goinfer/files"
	"github.com/synw/altiplano/goinfer/state"
)

func ReadTaskHandler(c echo.Context) error {
	m := echo.Map{}
	if err := c.Bind(&m); err != nil {
		return err
	}
	var path string
	v, ok := m["path"]
	if ok {
		path = v.(string)
	}
	task, err := files.ReadTask(path)
	if err != nil {
		panic(err)
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusOK, task)
}

func ReadTasksHandler(c echo.Context) error {
	tasks, err := files.ReadTasks(state.TasksDir)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err)
	}
	return c.JSON(http.StatusOK, tasks)
}

package server

import (
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
)

func RunServer(origins []string) {
	e := echo.New()
	e.Use(middleware.Logger())
	if l, ok := e.Logger.(*log.Logger); ok {
		l.SetHeader("[${time_rfc3339}] ${level}")
	}
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     origins,
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAuthorization},
		AllowMethods:     []string{http.MethodGet, http.MethodOptions, http.MethodPost},
		AllowCredentials: true,
	}))

	// inference
	inf := e.Group("/infer")
	inf.POST("", InferHandler)
	inf.GET("/abort", AbortHandler)
	// models
	mod := e.Group("/model")
	mod.GET("/state", ModelsStateHandler)
	mod.POST("/load", LoadModelHandler)

	// tasks
	tas := e.Group("/task")
	tas.GET("/tree", ReadTasksHandler)
	tas.POST("/read", ReadTaskHandler)

	e.Start(":5143")
}
